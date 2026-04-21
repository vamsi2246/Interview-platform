import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions, useDeleteSession } from "../hooks/useSessions";
import { useQueryClient } from "@tanstack/react-query";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import NewInterviewModal from "../components/NewInterviewModal";
import InterviewCard from "../components/InterviewCard";
import { useMyInterviews, useCreateInterview } from "../hooks/useMockInterview";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const createSessionMutation = useCreateSession();
  const deleteSessionMutation = useDeleteSession();
  const createInterviewMutation = useCreateInterview();
  const queryClient = useQueryClient();

  const handleDeleteSession = (sessionId) => {
    if (confirm("Are you sure you want to delete this session? This cannot be undone.")) {
      deleteSessionMutation.mutate(sessionId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
          queryClient.invalidateQueries({ queryKey: ["myRecentSessions"] });
        },
      });
    }
  };

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();
  const { data: myInterviewsData, isLoading: loadingInterviews } = useMyInterviews();

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const handleCreateInterview = ({ role, techStack, experience }) => {
    createInterviewMutation.mutate(
      { role, techStack, experience },
      {
        onSuccess: (data) => {
          setShowInterviewModal(false);
          navigate(`/mock-interview/${data.interview._id}/setup`);
        },
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];
  const myInterviews = myInterviewsData?.interviews || [];

  const isUserInSession = (session) => {
    if (!user.id) return false;

    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        {/* Grid layout */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
              onDeleteSession={handleDeleteSession}
              currentUserId={user?.id}
            />
          </div>

          <RecentSessions
            sessions={recentSessions}
            isLoading={loadingRecentSessions}
            onDeleteSession={handleDeleteSession}
            currentUserId={user?.id}
          />

          {/* ── Mock Interview Section ─────────────────────────────── */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-base-content">AI Mock Interviews</h2>
                <p className="text-sm text-base-content/50 mt-0.5">
                  Practice with AI-generated questions tailored to your role.
                </p>
              </div>
              <button
                id="new-mock-interview-btn"
                className="btn btn-primary btn-sm gap-2"
                onClick={() => setShowInterviewModal(true)}
              >
                + New Interview
              </button>
            </div>

            {loadingInterviews ? (
              <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-md text-primary" />
              </div>
            ) : myInterviews.length === 0 ? (
              <div className="glass-card p-10 text-center text-base-content/40">
                <p className="text-lg font-medium">No mock interviews yet.</p>
                <p className="text-sm mt-1">Click "+ New Interview" to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {myInterviews.map((interview) => (
                  <InterviewCard key={interview._id} interview={interview} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />

      <NewInterviewModal
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
        onCreate={handleCreateInterview}
        isCreating={createInterviewMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;