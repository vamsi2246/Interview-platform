import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// This will be set by the AuthProvider component once Clerk is ready
let getTokenFn = null;

export const setClerkGetToken = (fn) => {
  getTokenFn = fn;
};

// ─── Slow-request tracking (for Render cold-start UX) ────────────────────────
// Fires a custom DOM event if any request takes longer than 5 seconds.
// The ServerWakeupBanner component listens for these events globally.
let slowRequestCount = 0;
const SLOW_THRESHOLD_MS = 5000;
const slowTimers = new Map();

function notifyWakingUp() {
  slowRequestCount++;
  if (slowRequestCount === 1) {
    window.dispatchEvent(new CustomEvent('server-waking-up'));
  }
}

function notifyAwake() {
  if (slowRequestCount > 0) slowRequestCount--;
  if (slowRequestCount === 0) {
    window.dispatchEvent(new CustomEvent('server-awake'));
  }
}
// ─────────────────────────────────────────────────────────────────────────────

// Request interceptor: attach Clerk JWT + start slow-request timer
axiosInstance.interceptors.request.use(async (config) => {
  const requestId = `${Date.now()}-${Math.random()}`;
  config._requestId = requestId;

  // Timer fires after SLOW_THRESHOLD_MS — marks this request as "slow"
  const timer = setTimeout(() => {
    const entry = slowTimers.get(requestId);
    if (entry) entry.triggered = true;
    notifyWakingUp();
  }, SLOW_THRESHOLD_MS);

  slowTimers.set(requestId, { timer, triggered: false });

  if (getTokenFn) {
    try {
      const token = await getTokenFn();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Token not available (user not signed in)
    }
  }

  return config;
});

// Helper: clear the per-request timer and notify if it had already fired
function clearRequestTimer(config) {
  const requestId = config?._requestId;
  if (!requestId) return;
  const entry = slowTimers.get(requestId);
  if (!entry) return;
  clearTimeout(entry.timer);
  if (entry.triggered) notifyAwake();
  slowTimers.delete(requestId);
}

// Response interceptors: clear timer on success or error
axiosInstance.interceptors.response.use(
  (response) => {
    clearRequestTimer(response.config);
    return response;
  },
  (error) => {
    clearRequestTimer(error.config);
    return Promise.reject(error);
  }
);

export default axiosInstance;