import {
    StreamVideo,
    StreamCall,
    SpeakerLayout,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { Chat, Channel, MessageList, MessageInput, Window } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { useState } from "react";
import {
    MessageSquareIcon,
    VideoIcon,
    MicIcon,
    MicOffIcon,
    CameraIcon,
    CameraOffIcon,
    PhoneOffIcon,
    ScreenShareIcon,
    ScreenShareOffIcon,
} from "lucide-react";

function CallControls() {
    const { useMicrophoneState, useCameraState, useScreenShareState, useCallCallingState } =
        useCallStateHooks();

    const { microphone, isMute: isMicMuted } = useMicrophoneState();
    const { camera, isMute: isCamOff } = useCameraState();
    const { screenShare, isMute: isScreenShareOff } = useScreenShareState();

    const toggleMic = async () => {
        if (isMicMuted) {
            await microphone.enable();
        } else {
            await microphone.disable();
        }
    };

    const toggleCamera = async () => {
        if (isCamOff) {
            await camera.enable();
        } else {
            await camera.disable();
        }
    };

    const toggleScreenShare = async () => {
        if (isScreenShareOff) {
            await screenShare.enable();
        } else {
            await screenShare.disable();
        }
    };

    return (
        <div className="flex items-center justify-center gap-3 p-3 bg-base-200 rounded-b-xl">
            {/* Mic Toggle */}
            <button
                onClick={toggleMic}
                className={`btn btn-circle btn-sm ${isMicMuted ? "btn-error" : "btn-success"}`}
                title={isMicMuted ? "Unmute" : "Mute"}
            >
                {isMicMuted ? (
                    <MicOffIcon className="w-4 h-4" />
                ) : (
                    <MicIcon className="w-4 h-4" />
                )}
            </button>

            {/* Camera Toggle */}
            <button
                onClick={toggleCamera}
                className={`btn btn-circle btn-sm ${isCamOff ? "btn-error" : "btn-success"}`}
                title={isCamOff ? "Turn Camera On" : "Turn Camera Off"}
            >
                {isCamOff ? (
                    <CameraOffIcon className="w-4 h-4" />
                ) : (
                    <CameraIcon className="w-4 h-4" />
                )}
            </button>

            {/* Screen Share Toggle */}
            <button
                onClick={toggleScreenShare}
                className={`btn btn-circle btn-sm ${!isScreenShareOff ? "btn-warning" : "btn-ghost border-base-300"}`}
                title={isScreenShareOff ? "Share Screen" : "Stop Sharing"}
            >
                {isScreenShareOff ? (
                    <ScreenShareIcon className="w-4 h-4" />
                ) : (
                    <ScreenShareOffIcon className="w-4 h-4" />
                )}
            </button>
        </div>
    );
}

function VideoCallUI({ streamClient, call, chatClient, channel }) {
    const [activeTab, setActiveTab] = useState("video");

    return (
        <div className="h-full flex flex-col gap-3">
            {/* Tab Switcher */}
            <div className="flex gap-2">
                <button
                    className={`btn btn-sm flex-1 gap-2 ${activeTab === "video" ? "btn-primary" : "btn-ghost"
                        }`}
                    onClick={() => setActiveTab("video")}
                >
                    <VideoIcon className="w-4 h-4" />
                    Video
                </button>
                <button
                    className={`btn btn-sm flex-1 gap-2 ${activeTab === "chat" ? "btn-primary" : "btn-ghost"
                        }`}
                    onClick={() => setActiveTab("chat")}
                >
                    <MessageSquareIcon className="w-4 h-4" />
                    Chat
                </button>
            </div>

            {/* Video Call Area */}
            {activeTab === "video" && (
                <div className="flex-1 rounded-xl overflow-hidden bg-base-100 border border-base-300 flex flex-col">
                    <StreamVideo client={streamClient}>
                        <StreamCall call={call}>
                            <div className="flex-1 relative">
                                <SpeakerLayout />
                            </div>
                            <CallControls />
                        </StreamCall>
                    </StreamVideo>
                </div>
            )}

            {/* Chat Area */}
            {activeTab === "chat" && (
                <div className="flex-1 rounded-xl overflow-hidden bg-base-100 border border-base-300">
                    {chatClient && channel ? (
                        <Chat client={chatClient} theme="str-chat__theme-dark">
                            <Channel channel={channel}>
                                <Window>
                                    <div className="h-full flex flex-col">
                                        <div className="flex-1 overflow-y-auto">
                                            <MessageList />
                                        </div>
                                        <MessageInput />
                                    </div>
                                </Window>
                            </Channel>
                        </Chat>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-base-content/60">Loading chat...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default VideoCallUI;
