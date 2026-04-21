import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInterviewById, useSaveAnswer, useGenerateFeedback } from "../hooks/useMockInterview";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
  Volume2, Mic, MicOff, Save, ChevronRight, ChevronLeft,
  Loader2, Send, CheckCircle, AlertCircle,
} from "lucide-react";

// ── Web Speech API helpers ─────────────────────────────────────────────────

const speak = (text) => {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
};

// ── Main component ─────────────────────────────────────────────────────────

function MockInterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useInterviewById(id);
  const interview = data?.interview;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // questionId → text
  const [isRecording, setIsRecording] = useState(false);
  const [saveStates, setSaveStates] = useState({});
  const recognitionRef = useRef(null);

  const saveAnswerMutation = useSaveAnswer();
  const feedbackMutation = useGenerateFeedback();

  // Populate saved answers on load
  useEffect(() => {
    if (!interview) return;
    const existing = {};
    interview.answers?.forEach((a) => { existing[a.questionId] = a.text; });
    setAnswers(existing);
  }, [interview]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );

  if (isError || !interview?.questions?.length)
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <p className="text-error">Interview not found or no questions available.</p>
      </div>
    );

  const questions = interview.questions.sort((a, b) => a.order - b.order);
  const currentQuestion = questions[currentIdx];
  const currentQId = currentQuestion._id.toString();
  const totalQ = questions.length;

  // ── Speech recognition ──────────────────────────────────────────────────
  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Speech recognition not supported in this browser. Use Chrome.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = answers[currentQId] || "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interim = event.results[i][0].transcript;
        }
      }
      setAnswers((prev) => ({ ...prev, [currentQId]: finalTranscript + interim }));
    };

    recognition.onerror = () => {
      setIsRecording(false);
      toast.error("Recording stopped unexpectedly.");
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  // ── Save single answer ──────────────────────────────────────────────────
  const handleSaveAnswer = () => {
    const text = answers[currentQId] || "";
    if (!text.trim()) {
      toast.error("Please record or type an answer first.");
      return;
    }

    saveAnswerMutation.mutate(
      { interviewId: id, questionId: currentQId, answerText: text },
      {
        onSuccess: () => {
          setSaveStates((prev) => ({ ...prev, [currentQId]: true }));
          toast.success("Answer saved!");
        },
        onError: () => toast.error("Failed to save answer."),
      }
    );
  };

  // ── Submit all & get feedback ───────────────────────────────────────────
  const handleFinish = () => {
    feedbackMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success("Feedback generated!");
        navigate(`/mock-interview/${data.interview._id}/result`);
      },
      onError: () => toast.error("Failed to generate feedback. Please try again."),
    });
  };

  const savedCount = Object.values(saveStates).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-base-300 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl flex-1 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-base-content">{interview.role} Interview</h1>
          <p className="text-base-content/50 text-sm mt-0.5">{interview.techStack} · {interview.experience} yr(s) exp</p>
        </div>

        {/* Question tabs */}
        <div className="flex gap-2 flex-wrap">
          {questions.map((q, idx) => {
            const qId = q._id.toString();
            return (
              <button
                key={qId}
                id={`question-tab-${idx + 1}`}
                className={`btn btn-sm rounded-full ${
                  idx === currentIdx ? "btn-primary" : "btn-ghost"
                } ${saveStates[qId] ? "ring-2 ring-success ring-offset-1" : ""}`}
                onClick={() => setCurrentIdx(idx)}
              >
                Q{idx + 1}
                {saveStates[qId] && (
                  <CheckCircle className="w-3 h-3 text-success" />
                )}
              </button>
            );
          })}
        </div>

        {/* Question panel */}
        <div className="glass-card p-6 flex-1 flex flex-col gap-5">
          {/* Question text */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="badge badge-primary badge-sm mb-2">Question {currentIdx + 1} of {totalQ}</span>
              <p className="text-base-content text-lg font-medium leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>
            <button
              id="tts-btn"
              className="btn btn-ghost btn-sm btn-circle shrink-0"
              onClick={() => speak(currentQuestion.text)}
              title="Listen to question"
            >
              <Volume2 className="w-4 h-4 text-primary" />
            </button>
          </div>

          <div className="divider my-0" />

          {/* Answer textarea */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="label-text font-medium text-base-content">Your Answer</label>
            <textarea
              id={`answer-textarea-${currentIdx + 1}`}
              className="textarea textarea-bordered bg-base-200 w-full flex-1 min-h-36 resize-none text-sm"
              placeholder="Record your answer using the mic button below, or type it directly..."
              value={answers[currentQId] || ""}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [currentQId]: e.target.value }))
              }
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Record / Stop */}
            <button
              id={`record-btn-${currentIdx + 1}`}
              className={`btn btn-sm gap-2 ${isRecording ? "btn-error" : "btn-outline"}`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <>
                  <span className="inline-block w-2 h-2 bg-error rounded-full animate-pulse" />
                  <MicOff className="w-4 h-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Record Answer
                </>
              )}
            </button>

            {/* Save answer */}
            <button
              id={`save-answer-btn-${currentIdx + 1}`}
              className="btn btn-sm btn-secondary gap-2"
              onClick={handleSaveAnswer}
              disabled={saveAnswerMutation.isPending}
            >
              {saveAnswerMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Answer
            </button>

            {/* Saved indicator */}
            {saveStates[currentQId] && (
              <span className="text-success text-sm flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Saved
              </span>
            )}

            {/* Spacer */}
            <div className="ml-auto flex items-center gap-2">
              <button
                className="btn btn-ghost btn-sm gap-1"
                onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                disabled={currentIdx === 0}
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              {currentIdx < totalQ - 1 ? (
                <button
                  id="next-question-btn"
                  className="btn btn-primary btn-sm gap-1"
                  onClick={() => setCurrentIdx((p) => p + 1)}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="finish-interview-btn"
                  className="btn btn-success btn-sm gap-2"
                  onClick={handleFinish}
                  disabled={feedbackMutation.isPending || savedCount === 0}
                >
                  {feedbackMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating AI Feedback...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Finish & Get Feedback
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {savedCount === 0 && currentIdx === totalQ - 1 && (
            <div className="flex items-center gap-2 text-warning text-sm">
              <AlertCircle className="w-4 h-4" />
              Save at least one answer before finishing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MockInterviewPage;
