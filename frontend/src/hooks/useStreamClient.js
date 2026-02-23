// Stub hook — returns null/false values until Stream SDK is installed and configured.
// eslint-disable-next-line no-unused-vars
function useStreamClient(session, loadingSession, isHost, isParticipant) {
    return {
        call: null,
        channel: null,
        chatClient: null,
        isInitializingCall: false,
        streamClient: null,
    };
}

export default useStreamClient;
