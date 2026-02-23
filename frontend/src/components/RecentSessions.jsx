import {
  CalendarIcon,
  Code2Icon,
  HistoryIcon,
  LoaderIcon,
  Trash2Icon,
} from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function RecentSessions({ sessions, isLoading, onDeleteSession, currentUserId }) {
  return (
    <div className="mt-6 card bg-base-100 border-2 border-secondary/20 hover:border-secondary/30">
      <div className="card-body">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-secondary to-accent rounded-xl">
            <HistoryIcon className="size-5" />
          </div>
          <h2 className="text-2xl font-black">Recent Sessions</h2>
        </div>

        {/* Sessions list */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoaderIcon className="size-10 animate-spin text-secondary" />
            </div>
          ) : sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className="card bg-base-200 border-2 border-base-300 hover:border-secondary/50"
              >
                <div className="flex items-center gap-4 p-5">
                  {/* Icon */}
                  <div className="size-12 rounded-xl bg-gradient-to-br from-secondary/30 to-accent/30 flex items-center justify-center">
                    <Code2Icon className="size-6 text-secondary" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg truncate">
                        {session.problem}
                      </h3>
                      {session.difficulty && (
                        <span
                          className={`badge badge-sm ${getDifficultyBadgeClass(
                            session.difficulty
                          )}`}
                        >
                          {session.difficulty.charAt(0).toUpperCase() +
                            session.difficulty.slice(1)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-sm opacity-60">
                      <CalendarIcon className="size-3.5" />
                      <span>
                        {new Date(session.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="badge badge-ghost badge-sm">Completed</span>
                    {session.host?.clerkId === currentUserId && (
                      <button
                        onClick={() => onDeleteSession(session._id)}
                        className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/20"
                        title="Delete session"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-3xl flex items-center justify-center">
                <HistoryIcon className="w-10 h-10 text-secondary/50" />
              </div>
              <p className="text-lg font-semibold opacity-70 mb-1">
                No recent sessions
              </p>
              <p className="text-sm opacity-50">
                Your completed sessions will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentSessions;