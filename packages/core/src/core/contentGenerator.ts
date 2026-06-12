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
} from '@google/genai';
import { RecordingContentGenerator } from './recordingContentGenerator.js';
import type { LlmRole } from '../telemetry/llmRole.js';
import { OllamaContentGenerator } from './ollamaContentGenerator.js';

/**
 * Interface abstracting the core functionalities for generating content and counting tokens.
 */
export interface ContentGenerator {
  generateContent(
    request: GenerateContentParameters,
    userPromptId: string,
    role: LlmRole,
  ): Promise<GenerateContentResponse>;

  generateContentStream(
    request: GenerateContentParameters,
    userPromptId: string,
    role: LlmRole,
  ): Promise<AsyncGenerator<GenerateContentResponse>>;

  countTokens(request: CountTokensParameters): Promise<CountTokensResponse>;

  embedContent(request: EmbedContentParameters): Promise<EmbedContentResponse>;

  userTier?: any;
  userTierName?: string;
  paidTier?: any;
}

export enum AuthType {
  OLLAMA = 'ollama',
}

/**
 * Detects the best authentication type based on environment variables.
 */
export function getAuthTypeFromEnv(): AuthType | undefined {
  return AuthType.OLLAMA;
}

export type ContentGeneratorConfig = {
  authType: AuthType;
  baseUrl?: string;
  proxy?: string;
  model?: string;
  sessionId?: string;
  clientName?: string;
  apiKey?: string;
  vertexai?: boolean;
};

// Stub for compatibility
export type VertexAiRoutingConfig = any;

export type ContentGeneratorGlobalConfig = {
  recordResponses?: string;
  getUsageStatisticsEnabled: () => boolean;
};

export function createContentGeneratorConfig(
  params: any,
  authType: AuthType,
): ContentGeneratorConfig {
  return {
    authType,
    baseUrl: params.baseUrl,
    proxy: params.proxy,
    model: params.model,
    sessionId: params.sessionId,
    clientName: params.clientName,
  };
}

/**
 * Factory function for creating a ContentGenerator based on the provided configuration.
 */
export async function createContentGenerator(
  config: ContentGeneratorConfig,
  gcConfig: ContentGeneratorGlobalConfig,
): Promise<ContentGenerator> {
  const generator = (() => {
    if (config.authType === AuthType.OLLAMA) {
      return new OllamaContentGenerator();
    }
    throw new Error(
      `Error creating contentGenerator: Unsupported authType: ${config.authType}`,
    );
  })();

  if (gcConfig.recordResponses) {
    return new RecordingContentGenerator(generator, gcConfig.recordResponses);
  }

  return generator;
}
