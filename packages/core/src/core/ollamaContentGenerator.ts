/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  type GenerateContentResponse,
  type CountTokensResponse,
  type GenerateContentParameters,
  type CountTokensParameters,
  type EmbedContentResponse,
  type EmbedContentParameters,
  type Content,
  type Part,
} from '@google/genai';
import type { ContentGenerator } from './contentGenerator.js';
import type { LlmRole } from '../telemetry/llmRole.js';

export class OllamaContentGenerator implements ContentGenerator {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env['OLLAMA_BASE_URL'] || 'http://localhost:11434';
  }

  private async getModel(requestedModel?: string): Promise<string> {
    if (requestedModel && requestedModel !== 'auto' && requestedModel !== 'pro' && requestedModel !== 'flash' && requestedModel !== 'flash-lite') {
      return requestedModel;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        if (data.models && data.models.length > 0) {
          return data.models[0].name;
        }
      }
    } catch (e) {
      // ignore
    }

    return 'llama3'; // Absolute fallback
  }

  async generateContent(
    request: GenerateContentParameters,
    _userPromptId: string,
    _role: LlmRole,
  ): Promise<GenerateContentResponse> {
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(await this.mapRequest(request, false)),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    return this.mapResponse(data);
  }

  async generateContentStream(
    request: GenerateContentParameters,
    _userPromptId: string,
    _role: LlmRole,
  ): Promise<AsyncGenerator<GenerateContentResponse>> {
    const requestBody = await this.mapRequest(request, true);
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${await response.text()}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is null');

    const self = this;
    async function* stream() {
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulatedToolCalls: any[] = [];

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === '[DONE]') break;
              try {
                const data = JSON.parse(jsonStr);
                const delta = data.choices[0].delta;
                
                if (delta.tool_calls) {
                  for (const tc of delta.tool_calls) {
                    if (tc.index !== undefined) {
                      if (!accumulatedToolCalls[tc.index]) {
                        accumulatedToolCalls[tc.index] = {
                          id: tc.id,
                          type: 'function',
                          function: { name: tc.function?.name || '', arguments: '' }
                        };
                      }
                      if (tc.function?.name) accumulatedToolCalls[tc.index].function.name = tc.function.name;
                      if (tc.function?.arguments) accumulatedToolCalls[tc.index].function.arguments += tc.function.arguments;
                    }
                  }
                }

                yield self.mapStreamResponse(data, accumulatedToolCalls);
              } catch (e) {
                // Silently ignore parse errors for non-JSON lines
              }
            }
          }
        }
    }

    return stream();
  }

  async countTokens(
    _request: CountTokensParameters,
  ): Promise<CountTokensResponse> {
    return { totalTokens: 0 };
  }

  async embedContent(
    _request: EmbedContentParameters,
  ): Promise<EmbedContentResponse> {
    throw new Error('OllamaContentGenerator: embedContent not implemented');
  }

  private async mapRequest(request: GenerateContentParameters, stream: boolean) {
    const contents = Array.isArray(request.contents) ? request.contents : [];
    const messages = contents.map((content: Content) => {
      const role = content.role === 'model' ? 'assistant' : content.role || 'user';
      const parts: any[] = (content.parts || []).map((p: Part) => {
        if (p.text) return { type: 'text', text: p.text };
        if (p.inlineData) {
            return {
                type: 'image_url',
                image_url: {
                    url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}`
                }
            };
        }
        if (p.functionCall) return { 
          type: 'function', 
          function: { name: p.functionCall.name, arguments: JSON.stringify(p.functionCall.args) } 
        };
        if (p.functionResponse) return {
          role: 'tool',
          tool_call_id: p.functionResponse.name,
          content: JSON.stringify(p.functionResponse.response)
        };
        return null;
      }).filter(Boolean);

      const toolResponses = parts.filter((p: any) => p.role === 'tool');
      if (toolResponses.length > 0) {
          return toolResponses;
      }

      // If it's a mix of text/image or just image, use array content
      const hasMedia = parts.some(p => p.type === 'image_url');
      const textContent = (content.parts || []).map((p: Part) => p.text || '').join('');

      return {
        role,
        content: hasMedia ? parts.filter(p => p.type === 'text' || p.type === 'image_url') : textContent,
        ...((content.parts || []).some(p => p.functionCall) ? {
            tool_calls: (content.parts || []).filter(p => p.functionCall).map((p, i) => ({
                id: p.functionCall?.name || `call_${i}`, // Try to use name as ID if possible
                type: 'function',
                function: { name: p.functionCall!.name, arguments: JSON.stringify(p.functionCall!.args) }
            }))
        } : {})
      };
    }).flat();

    const systemInstruction = (request as any).systemInstruction;
    if (systemInstruction) {
        const systemText = Array.isArray(systemInstruction) 
            ? systemInstruction.map((p: any) => p.text || '').join('')
            : (systemInstruction as any).text || systemInstruction;
        
        messages.unshift({ role: 'system', content: systemText });
    }

    const tools = (request as any).tools;

    return {
      model: await this.getModel(request.model),
      messages,
      stream,
      tools: tools?.map((t: any) => ({
          type: 'function',
          function: {
              name: t.function_declarations?.[0]?.name,
              description: t.function_declarations?.[0]?.description,
              parameters: t.function_declarations?.[0]?.parameters,
          }
      })),
      temperature: (request as any).generationConfig?.temperature,
      top_p: (request as any).generationConfig?.topP,
      max_tokens: (request as any).generationConfig?.maxOutputTokens,
    };
  }

  private mapResponse(data: any): GenerateContentResponse {
    const message = data.choices[0].message;
    const parts: Part[] = [];
    if (message.content) parts.push({ text: message.content });
    if (message.tool_calls) {
        for (const tc of message.tool_calls) {
            parts.push({
                functionCall: {
                    name: tc.function.name,
                    args: JSON.parse(tc.function.arguments),
                }
            });
        }
    }

    return {
      candidates: [
        {
          content: { role: 'model', parts },
          finishReason: data.choices[0].finish_reason === 'stop' ? 'STOP' : 'OTHER',
        },
      ],
      usageMetadata: {
        promptTokenCount: data.usage?.prompt_tokens || 0,
        candidatesTokenCount: data.usage?.completion_tokens || 0,
        totalTokenCount: data.usage?.total_tokens || 0,
      },
    } as GenerateContentResponse;
  }

  private mapStreamResponse(data: any, accumulatedToolCalls: any[]): GenerateContentResponse {
      const delta = data.choices[0].delta;
      const parts: Part[] = [];
      if (delta.content) parts.push({ text: delta.content });
      
      if (data.choices[0].finish_reason === 'tool_calls') {
          for (const tc of accumulatedToolCalls) {
              if (tc) {
                parts.push({
                    functionCall: {
                        name: tc.function.name,
                        args: JSON.parse(tc.function.arguments),
                    }
                });
              }
          }
      }

      return {
          candidates: [
              {
                  content: { role: 'model', parts },
                  finishReason: data.choices[0].finish_reason === 'stop' ? 'STOP' : undefined,
              },
          ],
      } as GenerateContentResponse;
  }
}