import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  Eye,
  UsersIcon,
  VideoIcon,
  ZapIcon,
  PawPrint,
  BrainCircuitIcon,
  MessageSquareIcon,
  MonitorIcon,
  TimerIcon,
  TerminalIcon,
  BarChart3Icon,
  MicIcon,
  ShieldCheckIcon,
  SparklesIcon,
  RocketIcon,
  HeartHandshakeIcon,
  TargetIcon,
  PlayCircleIcon,
  UserPlusIcon,
  ClipboardCheckIcon,
  LineChartIcon,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import ThemeController from "../components/ThemeController";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

function HomePage() {
  useScrollAnimation();

  return (
    <div className="bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* NAVBAR */}
      <nav className="bg-base-100/50 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to={"/"}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          >
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
              <Eye className="size-6 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-secondary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
                I Platform
              </span>
              <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
            </div>
          </Link>

          {/* AUTH BTN */}
          <div className="flex items-center gap-4">
            <ThemeController />
            <SignInButton mode="modal">
              <button className="group px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2">
                <span>Get Started</span>
                <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </SignInButton>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <div className="badge badge-primary badge-lg">
              <ZapIcon className="size-4" />
              Real-time Collaboration
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Master the Art of
              </span>
              <br />
              <span className="text-base-content">Technical Interviews</span>
            </h1>

            <p className="text-xl text-base-content/70 leading-relaxed max-w-xl">
              Join a community of top-tier developers. Practice in real-time, simulate pressure, and elevate your coding skills with our advanced collaborative platform.
            </p>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-3">
              <div className="badge badge-lg badge-outline">
                <CheckIcon className="size-4 text-success" />
                Live Video Chat
              </div>
              <div className="badge badge-lg badge-outline">
                <CheckIcon className="size-4 text-success" />
                Code Editor
              </div>
              <div className="badge badge-lg badge-outline">
                <CheckIcon className="size-4 text-success" />
                Multi-Language
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-lg">
                  Start Coding Now
                  <ArrowRightIcon className="size-5" />
                </button>
              </SignInButton>

              <button className="btn btn-outline btn-lg">
                <VideoIcon className="size-5" />
                Watch Demo
              </button>
            </div>

            {/* STATS */}
            <div className="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-lg">
              <div className="stat">
                <div className="stat-value text-primary">10K+</div>
                <div className="stat-title">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-value text-secondary">50K+</div>
                <div className="stat-title">Sessions</div>
              </div>
              <div className="stat">
                <div className="stat-value text-accent">99.9%</div>
                <div className="stat-title">Uptime</div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <img
            src="/main.png"
            alt="CodeCollab Platform"
            className="w-full h-auto rounded-3xl shadow-2xl border-4 border-base-100 hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — HOW THE PLATFORM WORKS
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden">
        {/* Decorative gradient orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="animate-on-scroll fade-up text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/10 text-primary mb-4">
              How It Works
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              From Setup to{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Success
              </span>
            </h2>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
              Get started in minutes. Our streamlined workflow takes you from creating an interview to actionable insights.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-secondary/40 to-accent/40" />

            {[
              { step: 1, icon: <PlayCircleIcon className="size-6" />, title: "Create Interview", desc: "Set up a new interview session with your preferred language, difficulty, and topic in seconds." },
              { step: 2, icon: <UserPlusIcon className="size-6" />, title: "Join Session", desc: "Share the invite link with your candidate or pair-programming partner. One click to join." },
              { step: 3, icon: <Code2Icon className="size-6" />, title: "Live Video + Coding", desc: "Collaborate in real-time with HD video, a powerful code editor, and an integrated terminal." },
              { step: 4, icon: <BrainCircuitIcon className="size-6" />, title: "AI Evaluates Responses", desc: "Our AI engine analyzes code quality, problem-solving approach, and communication in real-time." },
              { step: 5, icon: <LineChartIcon className="size-6" />, title: "Feedback & Analytics", desc: "Receive detailed reports with strengths, improvement areas, and performance trends over time." },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`animate-on-scroll ${i % 2 === 0 ? "slide-left" : "slide-right"} relative flex flex-col md:flex-row items-center gap-6 mb-16 last:mb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
              >
                {/* Card */}
                <div className="glass-card p-6 md:w-[45%] flex items-start gap-4">
                  <div className="flex-shrink-0 size-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-base-content mb-1">{item.title}</h3>
                    <p className="text-base-content/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {/* Step circle on the line */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 size-10 rounded-full bg-gradient-to-br from-primary to-accent text-white font-black text-sm items-center justify-center shadow-lg ring-4 ring-base-100">
                  {item.step}
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block md:w-[45%]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — REAL INTERVIEW EXPERIENCE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute -right-40 top-20 w-[500px] h-[500px] bg-secondary/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div className="animate-on-scroll slide-left space-y-8">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-secondary/10 text-secondary">
              Real Experience
            </span>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight">
              Feel the Pressure of a{" "}
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Real Interview
              </span>
            </h2>
            <p className="text-lg text-base-content/60 leading-relaxed">
              Our platform replicates every aspect of a real technical interview — from face-to-face communication to live collaborative coding — so you're never caught off guard.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <VideoIcon className="size-5 text-primary" />, label: "Live Video Communication" },
                { icon: <Code2Icon className="size-5 text-secondary" />, label: "Real-time Collaborative Coding" },
                { icon: <TerminalIcon className="size-5 text-accent" />, label: "Multi-language Support" },
                { icon: <MonitorIcon className="size-5 text-primary" />, label: "Screen Sharing" },
                { icon: <UsersIcon className="size-5 text-secondary" />, label: "Interviewer & Candidate Roles" },
                { icon: <MicIcon className="size-5 text-accent" />, label: "Audio Analysis" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-base-100/50 border border-base-content/5">
                  <div className="flex-shrink-0 size-9 rounded-lg bg-base-200 flex items-center justify-center">
                    {f.icon}
                  </div>
                  <span className="text-sm font-medium text-base-content/80">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — decorative card stack */}
          <div className="animate-on-scroll slide-right relative">
            <div className="glass-card p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-base-content/10">
                <div className="size-3 rounded-full bg-error" />
                <div className="size-3 rounded-full bg-warning" />
                <div className="size-3 rounded-full bg-success" />
                <span className="ml-auto text-xs text-base-content/40 font-mono">interview_session.live</span>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 rounded-xl bg-base-100/60 p-4 flex flex-col items-center justify-center min-h-[160px]">
                  <VideoIcon className="size-10 text-primary/60 mb-2" />
                  <span className="text-xs text-base-content/50">Candidate Feed</span>
                </div>
                <div className="flex-1 rounded-xl bg-base-100/60 p-4 flex flex-col items-center justify-center min-h-[160px]">
                  <VideoIcon className="size-10 text-secondary/60 mb-2" />
                  <span className="text-xs text-base-content/50">Interviewer Feed</span>
                </div>
              </div>
              <div className="rounded-xl bg-base-100/60 p-4 font-mono text-xs text-base-content/60 leading-relaxed">
                <span className="text-primary">function</span> <span className="text-accent">solve</span>(arr, target) {"{"}<br />
                &nbsp;&nbsp;<span className="text-secondary">// collaborative coding in progress...</span><br />
                &nbsp;&nbsp;<span className="text-primary">return</span> result;<br />
                {"}"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — AI MOCK INTERVIEW ENGINE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="animate-on-scroll fade-up text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-accent/10 text-accent mb-4">
              AI-Powered
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Your Personal{" "}
              <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
                AI Interviewer
              </span>
            </h2>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
              Practice anytime with our AI mock interview engine. It asks real questions, watches how you code, and gives you detailed, actionable feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <BrainCircuitIcon className="size-7" />,
                title: "AI Asks Technical Questions",
                desc: "Dynamic question generation tailored to your skill level and target role.",
                gradient: "from-primary to-secondary",
              },
              {
                icon: <Eye className="size-7" />,
                title: "Tracks Coding Behavior",
                desc: "Monitors keystrokes, debugging patterns, and problem-solving approach in real-time.",
                gradient: "from-secondary to-accent",
              },
              {
                icon: <ClipboardCheckIcon className="size-7" />,
                title: "Gives Detailed Feedback",
                desc: "Receive scored evaluations with specific tips on code quality, efficiency, and communication.",
                gradient: "from-accent to-primary",
              },
              {
                icon: <MonitorIcon className="size-7" />,
                title: "Simulates Real Environment",
                desc: "Timed sessions, webcam feed, and realistic pressure — just like the real thing.",
                gradient: "from-primary to-accent",
              },
              {
                icon: <MicIcon className="size-7" />,
                title: "Audio & Response Analysis",
                desc: "AI evaluates your verbal explanations, clarity of thought, and communication skills.",
                gradient: "from-secondary to-primary",
              },
              {
                icon: <SparklesIcon className="size-7" />,
                title: "Adaptive Difficulty",
                desc: "Questions get harder or easier based on your performance, ensuring optimal learning.",
                gradient: "from-accent to-secondary",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="animate-on-scroll fade-up glass-card gradient-border p-6 group"
              >
                <div className={`size-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-lg text-base-content mb-2">{card.title}</h3>
                <p className="text-sm text-base-content/60 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — KEY FEATURES GRID
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-on-scroll fade-up text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/10 text-primary mb-4">
              Platform Features
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Packed with{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Powerful Tools
              </span>
            </h2>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
              Everything you need for a world-class interview experience, all in one place.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <VideoIcon className="size-6" />, title: "Live Video Chat", desc: "HD video & audio with low-latency streaming", color: "text-primary", bg: "bg-primary/10" },
              { icon: <Code2Icon className="size-6" />, title: "Code Editor", desc: "Monaco-powered editor with IntelliSense", color: "text-secondary", bg: "bg-secondary/10" },
              { icon: <BrainCircuitIcon className="size-6" />, title: "AI Interviewer", desc: "Practice with an intelligent AI partner", color: "text-accent", bg: "bg-accent/10" },
              { icon: <MessageSquareIcon className="size-6" />, title: "Chat Messaging", desc: "In-session text chat for quick collaboration", color: "text-primary", bg: "bg-primary/10" },
              { icon: <MonitorIcon className="size-6" />, title: "Screen Sharing", desc: "Share your screen for code reviews & demos", color: "text-secondary", bg: "bg-secondary/10" },
              { icon: <TimerIcon className="size-6" />, title: "Timer & Sessions", desc: "Built-in countdown timer & session management", color: "text-accent", bg: "bg-accent/10" },
              { icon: <TerminalIcon className="size-6" />, title: "Code Execution", desc: "Run code in 10+ languages inside the browser", color: "text-primary", bg: "bg-primary/10" },
              { icon: <BarChart3Icon className="size-6" />, title: "Analytics Dashboard", desc: "Track progress, streaks, and performance trends", color: "text-secondary", bg: "bg-secondary/10" },
            ].map((f, i) => (
              <div
                key={i}
                className="animate-on-scroll fade-up glass-card p-5 flex flex-col items-start gap-4 group cursor-default"
              >
                <div className={`size-12 rounded-xl ${f.bg} flex items-center justify-center ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base-content mb-1">{f.title}</h3>
                  <p className="text-xs text-base-content/55 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════════════════════════════════════════════════════
          SECTION 6 — FINAL CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 relative z-10 text-center animate-on-scroll fade-up">
          <div className="glass-card p-12 md:p-16">
            <SparklesIcon className="size-12 text-accent mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
              Ready to Ace Your{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Next Interview?
              </span>
            </h2>
            <p className="text-lg text-base-content/60 mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of developers who practice smarter, not harder.
              Start a free mock interview now and see the difference AI-powered prep makes.
            </p>

            <SignInButton mode="modal">
              <button className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl text-white font-bold text-lg shadow-2xl hover:shadow-primary/25 hover:scale-105 transition-all duration-300">
                <span>Start Interview</span>
                <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </button>
            </SignInButton>

            <p className="mt-6 text-xs text-base-content/40">
              No credit card required · Free tier available · Setup in 30 seconds
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-base-content/5 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <Eye className="size-4 text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent font-mono">
              I Platform
            </span>
          </div>
          <p className="text-xs text-base-content/40">
            © 2026 I Platform. Built for developers, by developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
export default HomePage;
