import { useParams, useNavigate } from "react-router-dom";
import { useInterviewById } from "../hooks/useMockInterview";
import Navbar from "../components/Navbar";
import {
  BarChart2, ChevronDown, ChevronUp, Star, ArrowLeft, Repeat2,
  CheckCircle, User, BookOpen,
} from "lucide-react";
import { useState } from "react";

// Score → colour mapping
const getRatingColour = (r) => {
  if (r >= 8) return "text-success";
  if (r >= 5) return "text-warning";
  return "text-error";
};

const getScoreBadge = (score) => {
  if (score >= 8) return "badge-success";
  if (score >= 5) return "badge-warning";
  return "badge-error";
};

function AccordionItem({ question, answer, feedback, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <button
        id={`accordion-q${index + 1}`}
        className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-base-content/5 transition-colors"
        onClick={() => setOpen((p) => !p)}
      >
        <div className="flex items-center gap-3">
          <span className="badge badge-primary badge-sm shrink-0">Q{index + 1}</span>
          <p className="font-medium text-base-content line-clamp-2 text-sm">
            {question.text}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {feedback && (
            <span className={`font-bold text-lg ${getRatingColour(feedback.rating)}`}>
              {feedback.rating}/10
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-base-content/10 pt-4">
          {/* User answer */}
          <div>
            <h4 className="text-xs font-semibold uppercase text-base-content/40 flex items-center gap-1 mb-2">
              <User className="w-3 h-3" /> Your Answer
            </h4>
            <p className="text-sm text-base-content/80 bg-base-200 rounded-lg p-3 leading-relaxed">
              {answer?.text || <span className="italic text-base-content/30">No answer recorded</span>}
            </p>
          </div>

          {/* Correct answer */}
          {feedback?.correctAnswer && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-base-content/40 flex items-center gap-1 mb-2">
                <BookOpen className="w-3 h-3" /> Model Answer
              </h4>
              <p className="text-sm text-base-content/80 bg-base-200 rounded-lg p-3 leading-relaxed">
                {feedback.correctAnswer}
              </p>
            </div>
          )}

          {/* Feedback */}
          {feedback?.feedback && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-base-content/40 flex items-center gap-1 mb-2">
                <Star className="w-3 h-3" /> AI Feedback
              </h4>
              <p className="text-sm text-base-content bg-base-200 rounded-lg p-3 leading-relaxed border-l-4 border-primary">
                {feedback.feedback}
              </p>
            </div>
          )}

          {/* Rating bar */}
          {feedback && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-base-content/50">Rating</span>
              <progress
                className={`progress w-40 ${
                  feedback.rating >= 8 ? "progress-success" :
                  feedback.rating >= 5 ? "progress-warning" : "progress-error"
                }`}
                value={feedback.rating}
                max="10"
              />
              <span className={`font-bold text-sm ${getRatingColour(feedback.rating)}`}>
                {feedback.rating} / 10
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MockInterviewResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useInterviewById(id);
  const interview = data?.interview;

  if (isLoading)
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );

  if (isError || !interview)
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <p className="text-error">Interview not found.</p>
      </div>
    );

  const questions = [...(interview.questions || [])].sort((a, b) => a.order - b.order);
  const answerMap = new Map((interview.answers || []).map((a) => [a.questionId, a]));
  const feedbackMap = new Map((interview.feedback || []).map((f) => [f.questionId, f]));

  const scoreLabel =
    interview.overallScore >= 8 ? "Excellent" :
    interview.overallScore >= 6 ? "Good" :
    interview.overallScore >= 4 ? "Needs Improvement" : "Needs More Practice";

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="container mx-auto px-4 py-10 max-w-4xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            className="btn btn-ghost btn-sm gap-1"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
          <div className="divider divider-horizontal" />
          <h1 className="text-2xl font-bold text-base-content">{interview.role} — Results</h1>
        </div>

        {/* Score summary */}
        <div className="glass-card p-8 flex flex-col sm:flex-row items-center gap-8 gradient-border">
          {/* Score ring */}
          <div className="flex flex-col items-center gap-2">
            <div
              className={`radial-progress text-primary font-bold text-3xl`}
              style={{ "--value": interview.overallScore * 10, "--size": "9rem", "--thickness": "8px" }}
              role="progressbar"
            >
              {interview.overallScore}
            </div>
            <span className="text-xs text-base-content/50">out of 10</span>
          </div>

          {/* Summary text */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
              <BarChart2 className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold text-base-content">Overall Performance</span>
            </div>
            <span className={`badge badge-lg ${getScoreBadge(interview.overallScore)} mb-3`}>
              {scoreLabel}
            </span>
            <p className="text-sm text-base-content/60">
              You answered {interview.answers?.length} of {questions.length} questions.
              Review the detailed feedback below to improve.
            </p>
          </div>

          {/* Retake button */}
          <button
            id="retake-btn"
            className="btn btn-outline btn-sm gap-2 shrink-0"
            onClick={() => navigate("/dashboard")}
          >
            <Repeat2 className="w-4 h-4" />
            New Interview
          </button>
        </div>

        {/* Per-question accordion */}
        <div>
          <h2 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Detailed Feedback
          </h2>
          <div className="flex flex-col gap-4">
            {questions.map((q, idx) => (
              <AccordionItem
                key={q._id}
                index={idx}
                question={q}
                answer={answerMap.get(q._id.toString())}
                feedback={feedbackMap.get(q._id.toString())}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MockInterviewResultPage;
