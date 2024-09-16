# Open Agent Harness

**Open Agent Harness** (`openagent-harness` on npm) is an [OpenCode](https://opencode.ai) plugin that adds orchestrated agents, background tasks, LSP and AST tools, hooks, and bundled workflows on top of the core editor.

## Install

Use the steps in **[docs/guide/installation.md](docs/guide/installation.md)**. They cover OpenCode, adding the plugin, models, and first run.

- **Package and CLI:** `openagent-harness` (install with your package manager, e.g. `npm install -g openagent-harness` if you use the published CLI).
- **Plugin entry:** prefer `openagent-harness` in `opencode.json`. Older entries such as `oh-my-openagent` / `oh-my-opencode` are still recognized and migrated when possible.
- **Config files:** typically `.opencode/openagent-harness.jsonc` (or `.json`). The same filenames under `~/.config/opencode/` are also used. Legacy basenames `oh-my-openagent` / `oh-my-opencode` are still detected for existing setups.solo
- 

Optional tooling (comment checker, ripgrep, ast-grep) can be fetched using release base URLs from the environment—see the installation guide. Nothing is hard-coded to a specific host in this repository.

## What it provides

- **Agents:** Orchestration (e.g. Sisyphus), planning (Prometheus), deep work (Hephaestus), codebase search (Explore), documentation search (Librarian), and other built-in roles. Defaults and model routing are documented in the guides below.
- **Delegation:** Categories map work types to models; background agents can run in parallel where configured.
- **Tools:** LSP helpers, AST-grep-based search and rewrite, tmux-backed interactive sessions, hash-stamped line edits for safer patches, and integration with OpenCode’s tool surface.
- **Hooks and compatibility:** Many hooks and Claude Code–style commands/skills can be used from the same layouts OpenCode supports.
- **MCPs:** Optional built-in or skill-scoped MCP usage depending on your configuration.

For a full list, see **[docs/reference/features.md](docs/reference/features.md)**.

## Documentation


| Topic                | Link                                                               |
| -------------------- | ------------------------------------------------------------------ |
| Overview             | [docs/guide/overview.md](docs/guide/overview.md)                   |
| Installation         | [docs/guide/installation.md](docs/guide/installation.md)           |
| Orchestration        | [docs/guide/orchestration.md](docs/guide/orchestration.md)         |
| Configuration        | [docs/reference/configuration.md](docs/reference/configuration.md) |
| Features (reference) | [docs/reference/features.md](docs/reference/features.md)           |


Schema for editor validation: published as `openagent-harness.schema.json` (see `package.json` `exports`).

## Diagnostics

```bash
bunx openagent-harness doctor
```

Use this to verify plugin load, config paths, and environment expectations.

## Uninstall

1. Remove the plugin entry from `opencode.json` / `opencode.jsonc` (e.g. `openagent-harness` and any legacy `oh-my-openagent` / `oh-my-opencode` entries you no longer want).
2. Remove plugin config files if you do not need them anymore, for example:

```bash
rm -f ~/.config/opencode/openagent-harness.jsonc ~/.config/opencode/openagent-harness.json \
      ~/.config/opencode/oh-my-openagent.jsonc ~/.config/opencode/oh-my-openagent.json \
      ~/.config/opencode/oh-my-opencode.jsonc ~/.config/opencode/oh-my-opencode.json

rm -f .opencode/openagent-harness.jsonc .opencode/openagent-harness.json \
      .opencode/oh-my-openagent.jsonc .opencode/oh-my-openagent.json \
      .opencode/oh-my-opencode.jsonc .opencode/oh-my-opencode.json
```

1. Confirm OpenCode starts without loading the plugin (`opencode --version` or your usual check).

