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

The widget uses `document.currentScript` to find the `<script>` tag, then mounts React into its **parent element**. No
special ID is required — just wrap the script in a container element.

**Important:** The script must load **synchronously** (no `async` or `defer`). Do not use TYPO3's `page.includeJSFooter`
or asset API, as they may add these attributes.

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
            src="/fileadmin/js/anythingllm-chat-widget.min.js"
    ></script>
</div>
```

Include it in your template:

```html

<f:render partial="Chat"/>
```

## Embedding via Backend (editor-managed)

Create a content element of type **"Plain HTML"** and paste the same `<div>` + `<script>` block. This lets editors place
the widget on specific pages.

### Per-language widgets

If your TYPO3 site uses multiple languages, create one **Plain HTML** content element per language and set the
`data-language` attribute accordingly. This ensures each language version of a page shows the widget in the correct
locale.

1. Go to **Web → Page** and select the page where the widget should appear.
2. Switch to the language you want to edit (e.g. "German") using the language selector at the top.
3. Create a new content element of type **Plain HTML** (under *Special elements*).
4. Paste the HTML block with the matching `data-language` value:

**German:**

```html
<div id="allm-chat">
  <script
    data-embed-id="your-embed-id"
    data-base-api-url="https://your-server.com/api/embed"
    data-language="de"
    src="/fileadmin/js/anythingllm-chat-widget.min.js"
  ></script>
</div>
```

**French:**

```html
<div id="allm-chat">
  <script
    data-embed-id="your-embed-id"
    data-base-api-url="https://your-server.com/api/embed"
    data-language="fr"
    src="/fileadmin/js/anythingllm-chat-widget.min.js"
  ></script>
</div>
```

**Italian:**

```html
<div id="allm-chat">
  <script
    data-embed-id="your-embed-id"
    data-base-api-url="https://your-server.com/api/embed"
    data-language="it"
    src="/fileadmin/js/anythingllm-chat-widget.min.js"
  ></script>
</div>
```

5. Repeat for each language version of the page.

Each content element is only visible on its respective language variant, so visitors always see the widget in their
language. You can also vary other `data-*` attributes per language (e.g. a different `data-greeting`).

## Notes

- The container `<div>` is where the widget renders — size and position it with CSS as needed.
- The `data-base-api-url` must be accessible from the visitor's browser. If you use a reverse proxy, ensure the
  `/api/embed` path is forwarded correctly.
- Both `.min.js` and `.min.css` must be in the same directory. The widget derives the CSS URL from the script's `src`
  attribute automatically.
- Restrict access in AnythingLLM backend to the embedded hostname.
