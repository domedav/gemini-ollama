/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { useCallback } from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { RadioButtonSelect } from '../components/shared/RadioButtonSelect.js';
import {
  SettingScope,
  type LoadableSettingScope,
  type LoadedSettings,
} from '../../config/settings.js';
import {
  AuthType,
  clearCachedCredentialFile,
  type Config,
} from '@google/gemini-cli-core';
import { useKeypress } from '../hooks/useKeypress.js';
import { AuthState } from '../types.js';
import { validateAuthMethodWithSettings } from './useAuth.js';

interface AuthDialogProps {
  config: Config;
  settings: LoadedSettings;
  setAuthState: (state: AuthState) => void;
  authError: string | null;
  onAuthError: (error: string | null) => void;
  setAuthContext: (context: { requiresRestart?: boolean }) => void;
}

export function AuthDialog({
  config,
  settings,
  setAuthState,
  authError,
  onAuthError,
  setAuthContext,
}: AuthDialogProps): React.JSX.Element {
  const items = [
    {
      label: 'Local Ollama (Offline)',
      value: AuthType.OLLAMA,
      key: AuthType.OLLAMA,
    },
  ];

  const onSelect = useCallback(
    async (authType: AuthType | undefined, scope: LoadableSettingScope) => {
      if (authType) {
        setAuthContext({});
        await clearCachedCredentialFile();
        settings.setValue(scope, 'security.auth.selectedType', authType);
      }
      setAuthState(AuthState.Unauthenticated);
    },
    [settings, setAuthState, setAuthContext],
  );

  const handleAuthSelect = async (authMethod: AuthType) => {
    const error = await validateAuthMethodWithSettings(
      authMethod,
      settings,
    ).catch((e) => (e instanceof Error ? e.message : String(e)));
    if (error) {
      onAuthError(error);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      onSelect(authMethod, SettingScope.User);
    }
  };

  useKeypress(
    (key) => {
      if (key.name === 'escape') {
        if (authError) {
          return true;
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        onSelect(undefined, SettingScope.User);
        return true;
      }
      return false;
    },
    { isActive: true },
  );

  return (
    <Box
      borderStyle="round"
      borderColor={theme.ui.focus}
      flexDirection="row"
      padding={1}
      width="100%"
      alignItems="flex-start"
    >
      <Text color={theme.text.accent}>? </Text>
      <Box flexDirection="column" flexGrow={1}>
        <Text bold color={theme.text.primary}>
          Gemini-Ollama
        </Text>
        <Box marginTop={1}>
          <Text color={theme.text.primary}>
            Using local Ollama instance for all processing.
          </Text>
        </Box>
        <Box marginTop={1}>
          <RadioButtonSelect
            items={items}
            initialIndex={0}
            onSelect={handleAuthSelect}
            onHighlight={() => {
              onAuthError(null);
            }}
          />
        </Box>
        {authError && (
          <Box marginTop={1}>
            <Text color={theme.status.error}>{authError}</Text>
          </Box>
        )}
        <Box marginTop={1}>
          <Text color={theme.text.secondary}>(Use Enter to select)</Text>
        </Box>
      </Box>
    </Box>
  );
}
