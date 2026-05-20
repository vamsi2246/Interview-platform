import { useEffect, useState, useRef } from "react";

/**
 * ServerWakeupBanner
 *
 * Listens for `server-waking-up` and `server-awake` custom DOM events
 * fired by the axios interceptors in lib/axios.js.
 *
 * Shows a professional, animated card in the bottom-right corner when
 * the Render free-tier backend is cold-starting (request takes > 5 seconds).
 * Auto-dismisses 2 seconds after the server responds.
 */
export default function ServerWakeupBanner() {
  const [visible, setVisible]       = useState(false); // controls mount
  const [entering, setEntering]     = useState(false); // controls slide-in
  const [leaving, setLeaving]       = useState(false); // controls slide-out
  const [progress, setProgress]     = useState(0);     // progress bar 0-100
  const [dots, setDots]             = useState("");     // animated "..."

  const progressInterval = useRef(null);
  const dotsInterval     = useRef(null);
  const dismissTimer     = useRef(null);
  const hideTimer        = useRef(null);

  // ── Show the banner ──────────────────────────────────────────────────────
  function show() {
    // Cancel any pending hide
    clearTimeout(dismissTimer.current);
    clearTimeout(hideTimer.current);

    setLeaving(false);
    setProgress(0);
    setVisible(true);

    // Trigger enter animation on next tick
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntering(true));
    });

    // Progress bar: reach ~85% over 30 seconds, then hold
    let elapsed = 0;
    clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      elapsed += 200;
      // Logarithmic fill so it slows down and never reaches 100%
      const pct = Math.min(85, (elapsed / 30000) * 100 * 1.5);
      setProgress(Math.round(pct));
    }, 200);

    // Animated dots
    let d = 0;
    clearInterval(dotsInterval.current);
    dotsInterval.current = setInterval(() => {
      d = (d + 1) % 4;
      setDots(".".repeat(d));
    }, 500);
  }

  // ── Hide the banner ──────────────────────────────────────────────────────
  function hide() {
    clearInterval(progressInterval.current);
    clearInterval(dotsInterval.current);
    setProgress(100);

    // Brief pause at 100% before sliding out
    dismissTimer.current = setTimeout(() => {
      setLeaving(true);
      setEntering(false);
      // Unmount after transition completes
      hideTimer.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
        setLeaving(false);
      }, 500);
    }, 800);
  }

  // ── Listen for axios events ──────────────────────────────────────────────
  useEffect(() => {
    const onWaking = () => show();
    const onAwake  = () => hide();

    window.addEventListener("server-waking-up", onWaking);
    window.addEventListener("server-awake",     onAwake);

    return () => {
      window.removeEventListener("server-waking-up", onWaking);
      window.removeEventListener("server-awake",     onAwake);
      clearInterval(progressInterval.current);
      clearInterval(dotsInterval.current);
      clearTimeout(dismissTimer.current);
      clearTimeout(hideTimer.current);
    };
  }, []);

  if (!visible) return null;

  // ── Slide / opacity transition classes ──────────────────────────────────
  const wrapperClass = [
    "fixed bottom-6 right-6 z-[9999] w-80 transition-all duration-500 ease-in-out",
    entering && !leaving ? "opacity-100 translate-y-0"
                         : "opacity-0 translate-y-10 pointer-events-none",
  ].join(" ");

  return (
    <div className={wrapperClass} role="status" aria-live="polite">
      <div className="glass-card p-5 shadow-2xl border border-primary/20 bg-base-100/90 backdrop-blur-xl">

        {/* ── Header ── */}
        <div className="flex items-start gap-3 mb-3">
          {/* Rocket with pulse ring */}
          <div className="relative shrink-0 mt-0.5">
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative size-9 rounded-full bg-primary/15 flex items-center justify-center">
              <span className="text-lg leading-none">🚀</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base-content text-sm leading-snug">
              Server waking up{dots}
            </p>
            <p className="text-xs text-base-content/50 mt-0.5 leading-relaxed">
              Render free tier spins down after inactivity. Please wait ~30 seconds.
            </p>
          </div>

          {/* Spinner */}
          <span className="loading loading-spinner loading-sm text-primary shrink-0 mt-0.5" />
        </div>

        {/* ── Progress bar ── */}
        <div className="w-full h-1.5 bg-base-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Footer hint ── */}
        <p className="text-[11px] text-base-content/35 mt-2 text-right">
          {progress < 100 ? `~${Math.max(0, 30 - Math.round(progress * 0.3))}s remaining` : "Almost ready ✓"}
        </p>
      </div>
    </div>
  );
}
