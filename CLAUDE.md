# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AnythingLLM embedded chat widget — a React app that renders an inline chat widget via a `<script>` tag. It builds to a single UMD bundle (`dist/anythingllm-chat-widget.js`) + CSS file that can be dropped into any HTML page.

## Commands

- `yarn dev` — watch mode with live rebuild + serve on port 3080
- `yarn dev:build` — one-shot dev build (unminified)
- `yarn build` — production build (vite + terser + cleancss)
- `yarn lint` — format with Prettier (`yarn prettier --write ./src`)
- `yarn verify:translations` — check all locale files match English schema
- `yarn normalize:translations` — normalize English locale file

There are no tests or test framework configured.

## Architecture

### Embed Lifecycle

1. **Script tag** in host page provides config via `data-*` attributes
2. **`src/main.jsx`** reads `document.currentScript.dataset`, creates the exported `embedderSettings` object, initializes i18n, and mounts React into the script's parent element
3. **`src/App.jsx`** uses `useGetScriptAttributes` hook to parse/validate settings, wraps everything in i18n provider
4. **`ChatWindow`** → `ChatContainer` → `ChatHistory` + `PromptInput` render the chat UI
5. **`src/models/chatService.js`** handles all API communication (SSE streaming via `@microsoft/fetch-event-source`)

### Key Patterns

- **Settings flow**: HTML `data-*` attrs → `currentScript.dataset` → `embedderSettings` (main.jsx) + `useGetScriptAttributes` hook → passed as props to components. No Redux/Context — simple prop drilling.
- **Session management**: UUID stored in localStorage under key `allm_{embedId}_session_id`. Persists across reloads.
- **Streaming**: `ChatService.streamChat()` uses SSE. Response chunks have types: `textResponse`, `textResponseChunk`, `abort`. The `handleChat` callback in `ChatContainer` accumulates chunks into message state.
- **Thought process**: AI responses may contain `<think>...</think>` tags, rendered as expandable bubbles when `data-show-thoughts="true"`.
- **Custom events**: `SEND_TEXT_EVENT` dispatched on window for programmatic message sending (used by default message suggestions).

### Styling

- **Tailwind with `allm-` prefix** on all utility classes to avoid conflicts with host page CSS
- **Preflight disabled** (`corePlugins.preflight: false`) — no CSS reset, safe for embedding
- **`src/components/Head.jsx`** injects HLJS theme CSS, custom animations, and links to the extracted stylesheet
- Custom colors defined in `tailwind.config.js` (e.g., `black-900`, `accent`, `sidebar`, `primary-button`)

### Build

- Vite UMD library build → single file, all assets inlined (base64), inline sourcemaps
- `@phosphor-icons/react/dist/ssr` excluded from bundle (unused SSR variant)
- PostCSS pipeline: Tailwind → Autoprefixer
- Production: additional terser (JS) + cleancss (CSS) minification step

### i18n

- 18 languages in `src/locales/`, each with a `common.js` exporting a `TRANSLATIONS` object
- Initialized in `main.jsx` before React render via `initI18n(scriptSettings)`
- Language set via `data-language` attribute or auto-detected (localStorage → navigator)
- Components use `useTranslation()` hook with keys like `t("chat.send-message")`

### API Endpoints (via ChatService)

All use `${baseApiUrl}/${embedId}` as base:
- `GET /${sessionId}` — fetch chat history
- `DELETE /${sessionId}` — reset chat session
- `POST /stream-chat` — send message (SSE streaming response)