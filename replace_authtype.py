import os
import re

files = [
    "./evals/component-test-helper.ts",
    "./packages/a2a-server/src/config/config.test.ts",
    "./packages/a2a-server/src/config/config.ts",
    "./packages/cli/src/acp/acpResume.test.ts",
    "./packages/cli/src/acp/acpRpcDispatcher.test.ts",
    "./packages/cli/src/acp/acpRpcDispatcher.ts",
    "./packages/cli/src/acp/acpSessionManager.test.ts",
    "./packages/cli/src/acp/acpSessionManager.ts",
    "./packages/cli/src/acp/acpUtils.ts",
    "./packages/cli/src/config/auth.test.ts",
    "./packages/cli/src/config/auth.ts",
    "./packages/cli/src/config/settings.test.ts",
    "./packages/cli/src/config/settings.ts",
    "./packages/cli/src/core/auth.test.ts",
    "./packages/cli/src/gemini.test.tsx",
    "./packages/cli/src/gemini.tsx",
    "./packages/cli/src/services/BuiltinCommandLoader.test.ts",
    "./packages/cli/src/services/BuiltinCommandLoader.ts",
    "./packages/cli/src/test-utils/AppRig.tsx",
    "./packages/cli/src/ui/AppContainer.test.tsx",
    "./packages/cli/src/ui/AppContainer.tsx",
    "./packages/cli/src/ui/auth/AuthDialog.test.tsx",
    "./packages/cli/src/ui/auth/useAuth.test.tsx",
    "./packages/cli/src/ui/commands/chatCommand.test.ts",
    "./packages/cli/src/ui/commands/upgradeCommand.test.ts",
    "./packages/cli/src/ui/commands/upgradeCommand.ts",
    "./packages/cli/src/ui/components/Footer.test.tsx",
    "./packages/cli/src/ui/components/Footer.tsx",
    "./packages/cli/src/ui/components/ModelDialog.test.tsx",
    "./packages/cli/src/ui/components/ModelDialog.tsx",
    "./packages/cli/src/ui/components/ProQuotaDialog.test.tsx",
    "./packages/cli/src/ui/components/ProQuotaDialog.tsx",
    "./packages/cli/src/ui/components/UserIdentity.test.tsx",
    "./packages/cli/src/ui/components/UserIdentity.tsx",
    "./packages/cli/src/ui/hooks/useGeminiStream.test.tsx",
    "./packages/cli/src/ui/hooks/useQuotaAndFallback.test.ts",
    "./packages/cli/src/ui/hooks/useQuotaAndFallback.ts",
    "./packages/cli/src/ui/privacy/PrivacyNotice.tsx",
    "./packages/cli/src/ui/commands/commandsCommand.ts", # Found via earlier grep
    "./packages/cli/src/validateNonInterActiveAuth.test.ts",
    "./packages/core/src/agents/browser/browserAgentFactory.ts",
    "./packages/core/src/availability/autoRoutingFallback.integration.test.ts",
    "./packages/core/src/availability/policyHelpers.test.ts",
    "./packages/core/src/code_assist/codeAssist.test.ts",
    "./packages/core/src/code_assist/codeAssist.ts",
    "./packages/core/src/code_assist/oauth2.test.ts",
    "./packages/core/src/code_assist/oauth2.ts",
    "./packages/core/src/config/config.test.ts",
    "./packages/core/src/config/config.ts",
    "./packages/core/src/core/baseLlmClient.test.ts",
    "./packages/core/src/core/client.test.ts",
    "./packages/core/src/core/contentGenerator.test.ts",
    "./packages/core/src/core/geminiChat.test.ts",
    "./packages/core/src/core/logger.test.ts",
    "./packages/core/src/fallback/handler.test.ts",
    "./packages/core/src/routing/strategies/approvalModeStrategy.test.ts",
    "./packages/core/src/routing/strategies/classifierStrategy.test.ts",
    "./packages/core/src/routing/strategies/numericalClassifierStrategy.test.ts",
    "./packages/core/src/telemetry/clearcut-logger/clearcut-logger.test.ts",
    "./packages/core/src/telemetry/loggers.test.ts",
    "./packages/core/src/telemetry/metrics.ts",
    "./packages/core/src/telemetry/types.ts",
    "./packages/core/src/utils/errorParsing.test.ts",
    "./packages/core/src/utils/errorParsing.ts",
    "./packages/core/src/utils/flashFallback.test.ts",
    "./packages/core/src/utils/retry.test.ts",
    "./packages/sdk/src/session.ts"
]

pattern = re.compile(r'AuthType\.(LOGIN_WITH_GOOGLE|USE_GEMINI|USE_VERTEX_AI|LEGACY_CLOUD_SHELL|COMPUTE_ADC|GATEWAY)')

for file_path in files:
    abs_path = os.path.abspath(file_path)
    if not os.path.exists(abs_path):
        print(f"File not found: {abs_path}")
        continue
    
    with open(abs_path, 'r') as f:
        content = f.read()
    
    new_content = pattern.sub('AuthType.OLLAMA', content)
    
    if new_content != content:
        with open(abs_path, 'w') as f:
            f.write(new_content)
        print(f"Updated: {abs_path}")
    else:
        print(f"No changes: {abs_path}")
