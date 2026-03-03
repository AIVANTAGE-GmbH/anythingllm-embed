import ChatService from "@/models/chatService";
import { useTranslation } from "react-i18next";

export default function ResetChat({ setChatHistory, settings, sessionId, resetSessionId }) {
  const { t } = useTranslation();

  const handleChatReset = async () => {
    await ChatService.resetEmbedChatSession(settings, sessionId);
    setChatHistory([]);
    resetSessionId();
  };

  return (
    <div className="allm-w-full allm-flex allm-justify-center allm-gap-x-1 p-0">
      <button
        style={{ color: "#06689A" }}
        className="allm-h-fit allm-px-0 hover:allm-cursor-pointer allm-border-none allm-text-sm allm-bg-transparent hover:allm-text-[#C31A1A] hover:allm-underline"
        onMouseEnter={(e) => (e.currentTarget.style.color = "#C31A1A")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#06689A")}
        onClick={() => handleChatReset()}
      >
        {settings.resetChatText || t("chat.reset-chat")}
      </button>
    </div>
  );
}
