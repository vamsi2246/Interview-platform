import { useNavigate } from "react-router-dom";
import { Briefcase, Layers, Clock, CalendarDays, ChevronRight, BarChart2 } from "lucide-react";

const STATUS_STYLES = {
  pending: "badge-warning",
  "in-progress": "badge-info",
  completed: "badge-success",
};

function InterviewCard({ interview }) {
  const navigate = useNavigate();
  const { _id, role, techStack, experience, status, overallScore, createdAt } = interview;

  const date = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base-content truncate text-lg">{role}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs text-base-content/60">
              <Layers className="w-3 h-3" />
              {techStack}
            </span>
            <span className="flex items-center gap-1 text-xs text-base-content/60">
              <Clock className="w-3 h-3" />
              {experience} yr{experience !== 1 ? "s" : ""} exp
            </span>
            <span className="flex items-center gap-1 text-xs text-base-content/60">
              <CalendarDays className="w-3 h-3" />
              {date}
            </span>
          </div>
        </div>

        <span className={`badge badge-sm shrink-0 ${STATUS_STYLES[status] || "badge-ghost"}`}>
          {status}
        </span>
      </div>

      {/* Score (only when completed) */}
      {status === "completed" && (
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-primary" />
          <span className="text-sm text-base-content/70">Overall Score:</span>
          <span className="font-bold text-primary">{overallScore} / 10</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        {status !== "completed" ? (
          <button
            id={`interview-start-${_id}`}
            className="btn btn-primary btn-sm flex-1 gap-1"
            onClick={() => navigate(`/mock-interview/${_id}/setup`)}
          >
            <Briefcase className="w-4 h-4" />
            {status === "pending" ? "Start" : "Continue"}
          </button>
        ) : (
          <button
            id={`interview-feedback-${_id}`}
            className="btn btn-secondary btn-sm flex-1 gap-1"
            onClick={() => navigate(`/mock-interview/${_id}/result`)}
          >
            <BarChart2 className="w-4 h-4" />
            View Feedback
          </button>
        )}
        <button
          className="btn btn-ghost btn-sm gap-1"
          onClick={() => navigate(`/mock-interview/${_id}/setup`)}
          title="Details"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default InterviewCard;
