import { useState } from "react";
import ChatWindowHeader from "./Header";
import ChatContainer from "./ChatContainer";
import Sponsor from "../Sponsor";
import ResetChat from "../ResetChat";

export default function ChatWindow({ settings, sessionId, resetSessionId }) {
  // Every page load starts a fresh session, so there is no history to fetch.
  const [chatHistory, setChatHistory] = useState([]);

  setEventDelegatorForCodeSnippets();

  return (
    <div className="allm-flex allm-flex-col allm-h-full">
      {settings.headerDisplayed && (
        <ChatWindowHeader
          sessionId={sessionId}
          settings={settings}
          iconUrl={settings.brandImageUrl}
          setChatHistory={setChatHistory}
          resetSessionId={resetSessionId}
        />
      )}
      <div className="allm-flex-grow allm-overflow-y-auto">
        <ChatContainer
          sessionId={sessionId}
          settings={settings}
          knownHistory={chatHistory}
        />
      </div>
      <div className="allm-mt-4 allm-pb-4 allm-h-fit allm-gap-y-2 allm-z-10">
        <Sponsor settings={settings} />
        <ResetChat
          setChatHistory={setChatHistory}
          settings={settings}
          sessionId={sessionId}
          resetSessionId={resetSessionId}
        />
      </div>
    </div>
  );
}

// Enables us to safely markdown and sanitize all responses without risk of injection
// but still be able to attach a handler to copy code snippets on all elements
// that are code snippets.
function copyCodeSnippet(uuid) {
  const target = document.querySelector(`[data-code="${uuid}"]`);
  if (!target) return false;

  const markdown =
    target.parentElement?.parentElement?.querySelector(
      "pre:first-of-type",
    )?.innerText;
  if (!markdown) return false;

  window.navigator.clipboard.writeText(markdown);

  target.classList.add("allm-text-green-500");
  const originalText = target.innerHTML;
  target.innerText = "Copied!";
  target.setAttribute("disabled", true);

  setTimeout(() => {
    target.classList.remove("allm-text-green-500");
    target.innerHTML = originalText;
    target.removeAttribute("disabled");
  }, 2500);
}

// Listens and hunts for all data-code-snippet clicks.
function setEventDelegatorForCodeSnippets() {
  document?.addEventListener("click", function (e) {
    const target = e.target.closest("[data-code-snippet]");
    const uuidCode = target?.dataset?.code;
    if (!uuidCode) return false;
    copyCodeSnippet(uuidCode);
  });
}
