function VideoCallUI({ chatClient, channel }) {
    return (
        <div className="h-full flex flex-col gap-4">
            {/* Video Call Area */}
            <div className="flex-1 bg-base-100 rounded-xl flex items-center justify-center border border-base-300">
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">📹</div>
                    <h3 className="text-xl font-bold text-base-content mb-2">Video Call</h3>
                    <p className="text-base-content/60">
                        Video call UI will appear here once Stream SDK is configured.
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="h-1/3 bg-base-100 rounded-xl flex items-center justify-center border border-base-300">
                <div className="text-center p-4">
                    <div className="text-4xl mb-2">💬</div>
                    <h3 className="text-lg font-bold text-base-content mb-1">Chat</h3>
                    <p className="text-base-content/60 text-sm">
                        Chat will appear here once Stream SDK is configured.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default VideoCallUI;
