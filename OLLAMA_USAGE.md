# Gemini-Ollama Usage Guide

This tool is a locally-powered AI CLI agent that communicates exclusively with your local Ollama instance. It has been completely detached from Google services.

## Prerequisites
- **Ollama:** Must be running locally (usually on `http://localhost:11434`).
- **Models:** Ensure you have models installed (e.g., `ollama pull gemma4`).

## Running the CLI

From the project root directory, use the following command to start the CLI:

```bash
node packages/cli/dist/index.js
```

### Specifying a Model
To launch with a specific local model:
```bash
node packages/cli/dist/index.js --model <model_name>
```
*Example: `node packages/cli/dist/index.js --model mistral`*

## Key Commands within the CLI

- `/model`: Lists all models currently installed in your local Ollama instance and allows you to switch between them.
- `/tools`: View available local tools (file editing, shell execution, etc.) that the model can use.
- `/clear`: Clears the current chat history and screen.
- `/settings`: Opens the settings menu to configure your local experience.
- `/quit` or `/exit`: Exit the CLI.

## Environment Variables

- `OLLAMA_BASE_URL`: (Optional) Change the default Ollama API address. 
  - *Default: `http://localhost:11434`*

## Features
- **Privacy First:** Zero telemetry, zero external API calls. Everything stays on your machine.
- **Dynamic Discovery:** New models pulled into Ollama are automatically visible in the CLI.
- **Tool Use:** Use the agent to perform local tasks like running shell commands and modifying code files using your local models.
