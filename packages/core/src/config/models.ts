/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ModelResolutionContext {
  useGemini3_1?: boolean;
  useGemini3_5Flash?: boolean;
  useCustomTools?: boolean;
  hasAccessToPreview?: boolean;
  requestedModel?: string;
  releaseChannel?: string;
}

/**
 * Interface for the ModelConfigService to break circular dependencies.
 */
export interface IModelConfigService {
  getModelDefinition(modelId: string):
    | {
        tier?: string;
        family?: string;
        isPreview?: boolean;
        displayName?: string;
        features?: {
          thinking?: boolean;
          multimodalToolUse?: boolean;
        };
      }
    | undefined;

  resolveModelId(
    requestedModel: string,
    context?: ModelResolutionContext,
  ): string;

  resolveClassifierModelId(
    tier: string,
    requestedModel: string,
    context?: ModelResolutionContext,
  ): string;
}

/**
 * Interface defining the minimal configuration required for model capability checks.
 * This helps break circular dependencies between Config and models.ts.
 */
export interface ModelCapabilityContext {
  readonly modelConfigService: IModelConfigService;
  getExperimentalDynamicModelConfiguration(): boolean;
}

// Ollama specific constants
export const OLLAMA_DEFAULT_MODEL = 'auto';

// Stubs for remaining Google references to avoid breakages in complex logic
export const PREVIEW_GEMINI_MODEL = 'ollama-stub';
export const PREVIEW_GEMINI_3_1_MODEL = 'ollama-stub';
export const PREVIEW_GEMINI_3_1_CUSTOM_TOOLS_MODEL = 'ollama-stub';
export let PREVIEW_GEMINI_FLASH_MODEL = 'ollama-stub';
export const DEFAULT_GEMINI_MODEL = 'ollama-stub';
export let DEFAULT_GEMINI_FLASH_MODEL = 'ollama-stub';
export const DEFAULT_GEMINI_3_5_FLASH_MODEL = 'ollama-stub';
export const SECONDARY_GEMINI_3_5_FLASH_MODEL = 'ollama-stub';
export function setFlashModels(_preview: string, _defaultFlash: string) {}
export const DEFAULT_GEMINI_FLASH_LITE_MODEL = 'ollama-stub';
export const PREVIEW_GEMINI_FLASH_LITE_MODEL = 'ollama-stub';
export const GEMMA_4_31B_IT_MODEL = 'ollama-stub';
export const GEMMA_4_26B_A4B_IT_MODEL = 'ollama-stub';

// New stubs to fix build
export const DEFAULT_GEMINI_MODEL_AUTO = 'ollama-stub';
export const PREVIEW_GEMINI_MODEL_AUTO = 'ollama-stub';
export const DEFAULT_GEMINI_EMBEDDING_MODEL = 'ollama-stub';
export const GEMINI_MODEL_ALIAS_PRO = 'pro';
export const GEMINI_MODEL_ALIAS_FLASH = 'flash';
export const GEMINI_MODEL_ALIAS_FLASH_LITE = 'flash-lite';
export const GEMINI_MODEL_ALIAS_AUTO = 'auto';
export const DEFAULT_THINKING_MODE = 0;

export const VALID_GEMINI_MODELS = new Set([OLLAMA_DEFAULT_MODEL]);

export const CCPA_AI_MODEL_MAPPINGS = {};

export function getDisplayString(modelId: string, ..._args: any[]): string {
  return modelId;
}

export function getAutoModelDescription(..._args: any[]): string {
  return 'Local Ollama Model';
}

export function isProModel(_modelId: string, ..._args: any[]): boolean {
  return false;
}

export function isAutoModel(modelId: string, ..._args: any[]): boolean {
  return modelId === 'auto';
}

export function isPreviewModel(_modelId: string, ..._args: any[]): boolean {
  return false;
}

export function isGemini3Model(_modelId: string, ..._args: any[]): boolean {
  return false;
}

export function isGemini2Model(_modelId: string, ..._args: any[]): boolean {
  return false;
}

export function isCustomModel(_modelId: string, ..._args: any[]): boolean {
  return true;
}

export function isActiveModel(_modelId: string, ..._args: any[]): boolean {
  return true;
}

export function supportsModernFeatures(_modelId: string, ..._args: any[]): boolean {
  return true;
}

export function supportsMultimodalFunctionResponse(_modelId: string, ..._args: any[]): boolean {
  return true;
}

export function resolveModel(modelId: string, ..._args: any[]): string {
  return modelId;
}

export function resolveClassifierModel(_tier: string, _modelId: string, ..._args: any[]): string {
  return OLLAMA_DEFAULT_MODEL;
}
