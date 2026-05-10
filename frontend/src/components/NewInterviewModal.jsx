import { useState } from "react";
import { X, Briefcase, Layers, Clock, Sparkles } from "lucide-react";

const TECH_STACKS = [
  "React", "Node.js", "Python", "Java", "TypeScript", "Go",
  "Vue.js", "Angular", "MongoDB", "PostgreSQL", "AWS", "Docker",
];

function NewInterviewModal({ isOpen, onClose, onCreate, isCreating }) {
  const [form, setForm] = useState({ role: "", techStack: "", experience: "" });

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.role || !form.techStack || form.experience === "") return;
    onCreate({ role: form.role, techStack: form.techStack, experience: Number(form.experience) });
  };

  const isValid = form.role && form.techStack && form.experience !== "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — disabled while creating to prevent accidental close */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={isCreating ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md glass-card p-6 rounded-2xl shadow-2xl">

        {/* AI Generating overlay */}
        {isCreating && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-base-300/90 rounded-2xl gap-4">
            <div className="relative">
              <span className="loading loading-spinner loading-lg text-primary" />
              <Sparkles className="w-5 h-5 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-base-content text-lg">AI is generating your questions...</p>
              <p className="text-sm text-base-content/50 mt-1">This takes about 10–15 seconds. Please wait.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-base-content">New Mock Interview</h2>
            <p className="text-sm text-base-content/50 mt-0.5">
              AI will generate 5 personalized questions
            </p>
          </div>
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={onClose}
            disabled={isCreating}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role */}
          <div>
            <label className="label">
              <span className="label-text font-medium flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                Job Role
              </span>
            </label>
            <input
              id="mock-role"
              name="role"
              type="text"
              placeholder="e.g. Frontend Developer, Data Engineer"
              className="input input-bordered w-full bg-base-200"
              value={form.role}
              onChange={handleChange}
              disabled={isCreating}
              required
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="label">
              <span className="label-text font-medium flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-secondary" />
                Tech Stack
              </span>
            </label>
            <input
              id="mock-tech-stack"
              name="techStack"
              type="text"
              placeholder="e.g. React, Node.js, MongoDB"
              className="input input-bordered w-full bg-base-200"
              value={form.techStack}
              onChange={handleChange}
              disabled={isCreating}
              list="tech-stack-list"
              required
            />
            <datalist id="tech-stack-list">
              {TECH_STACKS.map((t) => <option key={t} value={t} />)}
            </datalist>
          </div>

          {/* Experience */}
          <div>
            <label className="label">
              <span className="label-text font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                Years of Experience
              </span>
            </label>
            <input
              id="mock-experience"
              name="experience"
              type="number"
              min="0"
              max="30"
              placeholder="e.g. 2"
              className="input input-bordered w-full bg-base-200"
              value={form.experience}
              onChange={handleChange}
              disabled={isCreating}
              required
            />
          </div>

          {/* Info note */}
          <div className="alert alert-info py-2 text-sm">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Questions are generated using AI based on your profile.</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="btn btn-ghost flex-1"
              onClick={onClose}
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              id="mock-create-btn"
              type="submit"
              className="btn btn-primary flex-1"
              disabled={!isValid || isCreating}
            >
              {isCreating ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Generating...
                </>
              ) : (
                "Start Interview"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewInterviewModal;
