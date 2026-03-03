# Embedding AnythingLLM Chat Widget in TYPO3 v12.4

## Prerequisites

1. Build the widget:
   ```bash
   yarn build
   ```
2. Upload both files from `dist/` to the same directory on your TYPO3 server (e.g. `fileadmin/js/`):
   - `anythingllm-chat-widget.min.js`
   - `anythingllm-chat-widget.min.css`

   The CSS is loaded automatically by the widget — you only reference the JS file.

## How It Works

The widget uses `document.currentScript` to find the `<script>` tag, then mounts React into its **parent element**. No special ID is required — just wrap the script in a container element.

**Important:** The script must load **synchronously** (no `async` or `defer`). Do not use TYPO3's `page.includeJSFooter` or asset API, as they may add these attributes.

## Embedding via TypoScript (site-wide)

Add this to your TypoScript setup (e.g. in your site package):

```typoscript
page.footerData.100 = TEXT
page.footerData.100.value (
  <div id="allm-chat">
    <script
      data-embed-id="your-embed-id"
      data-base-api-url="https://your-server.com/api/embed"
      src="/fileadmin/js/anythingllm-chat-widget.min.js">
    </script>
  </div>
)
```

## Embedding via Fluid Template (specific pages)

Create a partial `Resources/Private/Partials/Chat.html`:

```html
<div id="allm-chat">
  <script
    data-embed-id="your-embed-id"
    data-base-api-url="https://your-server.com/api/embed"
    src="/fileadmin/js/anythingllm-chat-widget.min.js">
  </script>
</div>
```

Include it in your template:

```html
<f:render partial="Chat" />
```

## Embedding via Backend (editor-managed)

Create a content element of type **"Plain HTML"** and paste the same `<div>` + `<script>` block. This lets editors place the widget on specific pages.

## Configuration

All configuration is passed via `data-*` attributes on the script tag. Common options:

| Attribute | Description |
|---|---|
| `data-embed-id` | Your embed ID (required) |
| `data-base-api-url` | API base URL (required) |
| `data-no-header` | Hide the chat header |
| `data-no-sponsor` | Hide the sponsor link |
| `data-language` | Force a language (e.g. `de`, `en`) |
| `data-user-bg-color` | User message bubble color |
| `data-assistant-bg-color` | Assistant message bubble color |
| `data-greeting` | Initial greeting message |
| `data-show-thoughts` | Show AI thinking process (`true`/`false`) |

## Notes

- The container `<div>` is where the widget renders — size and position it with CSS as needed.
- The `data-base-api-url` must be accessible from the visitor's browser. If you use a reverse proxy, ensure the `/api/embed` path is forwarded correctly.
- Both `.min.js` and `.min.css` must be in the same directory. The widget derives the CSS URL from the script's `src` attribute automatically.
