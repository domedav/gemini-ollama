/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import type { LoadedSettings } from '../../config/settings.js';
import {
  AuthType,
  type Config,
  debugLogger,
} from 'gemini-ollama-core';
import { getErrorMessage } from 'gemini-ollama-core';
import { AuthState } from '../types.js';

export async function validateAuthMethodWithSettings(
  authType: AuthType,
  settings: LoadedSettings,
): Promise<string | null> {
  const enforcedType = settings.merged.security.auth.enforcedType;
  if (enforcedType && enforcedType !== authType) {
    return `Authentication is enforced to be ${enforcedType}, but you are currently using ${authType}.`;
  }
  return null;
}

import type { AccountSuspensionInfo } from '../contexts/UIStateContext.js';

export const useAuthCommand = (
  settings: LoadedSettings,
  config: Config,
  initialAuthError: string | null = null,
  initialAccountSuspensionInfo: AccountSuspensionInfo | null = null,
) => {
  const [authState, setAuthState] = useState<AuthState>(
    initialAuthError ? AuthState.Updating : AuthState.Unauthenticated,
  );

  const [authError, setAuthError] = useState<string | null>(initialAuthError);
  const [accountSuspensionInfo, setAccountSuspensionInfo] =
    useState<AccountSuspensionInfo | null>(initialAccountSuspensionInfo);

  const onAuthError = useCallback(
    (error: string | null) => {
      setAuthError(error);
      if (error) {
        setAuthState(AuthState.Updating);
      }
    },
    [setAuthError, setAuthState],
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      if (authState !== AuthState.Unauthenticated) {
        return;
      }

      const authType = settings.merged.security.auth.selectedType || AuthType.OLLAMA;

      if (authType === AuthType.OLLAMA) {
        try {
          await config.refreshAuth(authType);
          debugLogger.log(`Authenticated via "${authType}".`);
          setAuthError(null);
          setAuthState(AuthState.Authenticated);
        } catch (e) {
           onAuthError(`Failed to initialize Ollama: ${getErrorMessage(e)}`);
        }
        return;
      }

      onAuthError(`Unsupported authentication method: ${authType}`);
    })();
  }, [
    settings,
    config,
    authState,
    setAuthState,
    setAuthError,
    onAuthError,
  ]);

  return {
    authState,
    setAuthState,
    authError,
    onAuthError,
    accountSuspensionInfo,
    setAccountSuspensionInfo,
    apiKeyDefaultValue: '',
    reloadApiKey: async () => '',
  };
};
