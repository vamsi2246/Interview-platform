import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import { useInterviewById } from "../hooks/useMockInterview";
import Navbar from "../components/Navbar";
import {
  Briefcase, Layers, Clock, Camera, CameraOff,
  Mic, MicOff, Play, AlertCircle, CheckCircle,
} from "lucide-react";

function MockInterviewSetupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [camEnabled, setCamEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [camError, setCamError] = useState(null);

  const { data, isLoading, isError } = useInterviewById(id);
  const interview = data?.interview;

  const handleToggleCam = () => {
    setCamEnabled((prev) => !prev);
    setCamError(null);
  };

  const handleCamError = () => {
    setCamError("Camera access denied. Please allow camera permissions.");
    setCamEnabled(false);
  };

  const handleToggleMic = async () => {
    if (!micEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop()); // just request permission
        setMicEnabled(true);
      } catch {
        alert("Microphone access denied. Please allow microphone permissions.");
      }
    } else {
      setMicEnabled(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <h1 className="text-3xl font-bold text-base-content mb-2">Interview Setup</h1>
        <p className="text-base-content/50 mb-8">
          Review your details and enable camera/mic before starting.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Interview Details */}
          <div className="flex flex-col gap-6">
            {/* Details card */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-semibold text-lg text-base-content">Interview Details</h2>

              {[
                { icon: <Briefcase className="w-4 h-4 text-primary" />, label: "Role", value: interview.role },
                { icon: <Layers className="w-4 h-4 text-secondary" />, label: "Tech Stack", value: interview.techStack },
                { icon: <Clock className="w-4 h-4 text-accent" />, label: "Experience", value: `${interview.experience} year(s)` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  {icon}
                  <span className="text-sm text-base-content/60 w-24">{label}</span>
                  <span className="font-medium text-base-content">{value}</span>
                </div>
              ))}

              <div className="divider my-1" />
              <p className="text-sm text-base-content/50">
                5 questions will be presented one at a time. You can record your
                answer verbally and submit text for AI evaluation.
              </p>
            </div>

            {/* Permissions */}
            <div className="glass-card p-6 space-y-3">
              <h2 className="font-semibold text-base-content mb-2">Permissions</h2>

              {/* Camera toggle */}
              <button
                id="toggle-camera-btn"
                className={`btn w-full gap-2 ${camEnabled ? "btn-success" : "btn-outline"}`}
                onClick={handleToggleCam}
              >
                {camEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                {camEnabled ? "Camera On" : "Enable Camera"}
                {camEnabled
                  ? <CheckCircle className="w-4 h-4 ml-auto" />
                  : null}
              </button>

              {camError && (
                <p className="text-error text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {camError}
                </p>
              )}

              {/* Mic toggle */}
              <button
                id="toggle-mic-btn"
                className={`btn w-full gap-2 ${micEnabled ? "btn-success" : "btn-outline"}`}
                onClick={handleToggleMic}
              >
                {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                {micEnabled ? "Microphone On" : "Enable Microphone"}
                {micEnabled
                  ? <CheckCircle className="w-4 h-4 ml-auto" />
                  : null}
              </button>

              <p className="text-xs text-base-content/40 mt-1">
                Camera and mic are optional but recommended for a realistic experience.
              </p>
            </div>

            {/* Start button */}
            <button
              id="start-interview-btn"
              className="btn btn-primary btn-lg w-full gap-2"
              onClick={() => navigate(`/mock-interview/${id}`)}
            >
              <Play className="w-5 h-5" />
              Start Interview
            </button>
          </div>

          {/* Right — Webcam Preview */}
          <div className="glass-card p-4 flex flex-col items-center justify-center min-h-72">
            {camEnabled ? (
              <Webcam
                ref={webcamRef}
                audio={false}
                onUserMediaError={handleCamError}
                videoConstraints={{ facingMode: "user" }}
                className="rounded-xl w-full max-h-80 object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-base-content/30">
                <Camera className="w-16 h-16" />
                <p className="text-sm">Camera preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MockInterviewSetupPage;
