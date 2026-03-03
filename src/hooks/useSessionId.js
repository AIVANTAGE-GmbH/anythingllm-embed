import { useCallback, useEffect, useState } from "react";
import { embedderSettings } from "../main";
import { v4 } from "uuid";

export default function useSessionId() {
  const [sessionId, setSessionId] = useState("");

  const generateNewSessionId = useCallback(() => {
    if (!window || !embedderSettings?.settings?.embedId) return;
    const STORAGE_IDENTIFIER = `allm_${embedderSettings?.settings?.embedId}_session_id`;
    const newId = v4();
    console.log(`Registering new session id`, newId);
    window.localStorage.setItem(STORAGE_IDENTIFIER, newId);
    setSessionId(newId);
  }, []);

  useEffect(() => {
    generateNewSessionId();
  }, [generateNewSessionId]);

  return { sessionId, resetSessionId: generateNewSessionId };
}
