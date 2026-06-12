/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ModelConfigServiceConfig } from '../services/modelConfigService.js';

// Minimal model configs for Ollama.
export const DEFAULT_MODEL_CONFIGS: ModelConfigServiceConfig = {
  aliases: {
    base: {
      modelConfig: {
        generateContentConfig: {
          temperature: 0,
          topP: 1,
        },
      },
    },
    'chat-base': {
      extends: 'base',
      modelConfig: {
        generateContentConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 64,
        },
      },
    },
  },
  overrides: [],
  modelDefinitions: {
    'gemma4': {
      displayName: 'Gemma 4',
      tier: 'pro',
      family: 'gemma',
      isPreview: false,
      isVisible: true,
      features: { thinking: false, multimodalToolUse: true },
    },
  },
  modelIdResolutions: {
      'auto': { default: 'auto' },
      'pro': { default: 'auto' },
      'flash': { default: 'auto' },
      'flash-lite': { default: 'auto' },
  },
  classifierIdResolutions: {
      'classifier-default': { default: 'auto' },
  },
  modelChains: {
      'default': [{ 
          model: 'auto',
          actions: { terminal: 'prompt', transient: 'prompt', not_found: 'prompt', unknown: 'prompt' } as any,
          stateTransitions: { terminal: 'terminal', transient: 'terminal', not_found: 'terminal', unknown: 'terminal' } as any
      }],
  },
};
