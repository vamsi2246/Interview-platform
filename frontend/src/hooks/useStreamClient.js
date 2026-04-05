import { useState, useEffect, useCallback, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  // Refs to track instances for cleanup and leaveSession
  const videoCallRef = useRef(null);
  const chatClientRef = useRef(null);

  useEffect(() => {
    const initCall = async () => {
      if (!session?.callId) return;
      if (!isHost && !isParticipant) return;
      if (session.status === "completed") return;

      try {
        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();

        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        setStreamClient(client);

        const videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });
        setCall(videoCall);
        videoCallRef.current = videoCall;

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        const chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );
        setChatClient(chatClientInstance);
        chatClientRef.current = chatClientInstance;

        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        await chatChannel.watch();
        setChannel(chatChannel);
      } catch (error) {
        toast.error("Failed to join video call");
        console.error("Error init call", error);
      } finally {
        setIsInitializingCall(false);
      }
    };

    if (session && !loadingSession) initCall();

    // cleanup on unmount
    return () => {
      (async () => {
        try {
          if (videoCallRef.current) await videoCallRef.current.leave();
          if (chatClientRef.current) await chatClientRef.current.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [session, loadingSession, isHost, isParticipant]);

  // Explicit leave function for "Leave Session" button
  const leaveSession = useCallback(async () => {
    try {
      if (videoCallRef.current) {
        await videoCallRef.current.leave();
        videoCallRef.current = null;
      }
      if (chatClientRef.current) {
        await chatClientRef.current.disconnectUser();
        chatClientRef.current = null;
      }
      await disconnectStreamClient();

      setCall(null);
      setChatClient(null);
      setChannel(null);
      setStreamClient(null);
    } catch (error) {
      console.error("Error leaving session:", error);
    }
  }, []);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
    leaveSession,
  };
}

export default useStreamClient;