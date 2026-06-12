# gemini-ollama (gmol) 🦙

[![GitHub License](https://img.shields.io/github/license/domedav/gemini-ollama)](https://github.com/domedav/gemini-ollama/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/domedav/gemini-ollama)](https://github.com/domedav/gemini-ollama/stargazers)

`gemini-ollama` (or simply `gmol`) is a powerful, privacy-focused AI agent CLI that brings the intelligence of Large Language Models directly to your terminal—**100% locally**. 

Born from a fork of the original Gemini CLI, this project has been fully decoupled from Google Cloud services and rebranded to serve as the ultimate local-first AI companion, powered by [Ollama](https://ollama.com/).

---

## ✨ Why gemini-ollama?

- **🔒 100% Private**: Your code, logs, and prompts never leave your machine.
- **🚀 Local Performance**: No latency from API calls or cloud queues.
- **🛠️ Developer-First**: Designed for the terminal, with deep support for file reading, searching, and command execution.
- **🧩 Extensible**: Built-in support for skills, MCP servers, and custom agents.
- **⚡ Universal Alias**: Access your agent instantly with the `gmol` command.

---

## 🛠️ Prerequisites

Before using `gmol`, you must have **Ollama** installed and running on your system.

1. **Install Ollama**: Download it from [ollama.com](https://ollama.com/).
2. **Pull a Model**: `gmol` works best with models like Llama 3, Mistral, or Phi-3.
   ```bash
   ollama pull llama3
   ```
3. **Start the Server**: Ensure the Ollama server is running (usually automatic after installation).

---

## 📦 Installation

This project is currently installed from source to ensure you have the latest local-first features.

```bash
# Clone the repository
git clone https://github.com/domedav/gemini-ollama.git
cd gemini-ollama

# Install dependencies and build
npm install
npm run build

# Link the binaries globally
npm link ./packages/cli
```

---

## 🚀 Getting Started

### 1. Launch the CLI
Simply type `gmol` in any directory to start a session.

```bash
gmol
```

### 2. Select Your Model
By default, `gmol` will attempt to pick the first available model from your Ollama instance. To explicitly select a model, use the slash command within the chat:

```text
/model
```
*Use the arrow keys to pick from your locally pulled models.*

### 3. Usage Examples

**Start with a specific model:**
```bash
gmol -m llama3:8b
```

**Include specific directories for context:**
```bash
gmol --include-directories ./src,./docs
```

**Run a one-off prompt (non-interactive):**
```bash
gmol -p "Explain the logic in packages/core/src/utils/paths.ts"
```

---

## ⌨️ Command Overview

While in the chat interface, use these commands to control your agent:

- `/model` - Change the active LLM.
- `/clear` - Clear the current chat history.
- `/help` - See a full list of available commands and keyboard shortcuts.

---

## 📜 License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.

---

<p align="center">
  Built for developers who value privacy and local power.
</p>
