import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import { Code2Icon, PlayIcon, TrendingUpIcon } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* WELCOME SECTION */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, <span className="text-primary">{user?.firstName || "Coder"}</span>! 👋
          </h1>
          <p className="text-base-content/70 text-lg">
            Ready to tackle some new challenges today?
          </p>
        </div>

        {/* QUICK STATS/ACTIONS GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* ACTION CARD 1: PRACTICE */}
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-base-content/5">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Code2Icon className="size-8" />
                </div>
                <h2 className="card-title text-2xl">Practice</h2>
              </div>
              <p className="text-base-content/70 mb-6">
                Sharpen your skills with our curated list of coding problems.
              </p>
              <div className="card-actions justify-end">
                <Link to="/problems" className="btn btn-primary w-full">
                  Solve Problems
                </Link>
              </div>
            </div>
          </div>

          {/* ACTION CARD 2: INTERVIEW */}
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-base-content/5">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                  <PlayIcon className="size-8" />
                </div>
                <h2 className="card-title text-2xl">Mock Interview</h2>
              </div>
              <p className="text-base-content/70 mb-6">
                Start a live mock interview session with a peer or AI.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-secondary w-full">Start Session</button>
              </div>
            </div>
          </div>

          {/* ACTION CARD 3: PROGRESS */}
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-base-content/5">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-accent/10 text-accent">
                  <TrendingUpIcon className="size-8" />
                </div>
                <h2 className="card-title text-2xl">Your Progress</h2>
              </div>
              <p className="text-base-content/70 mb-6">
                Track your solved problems and interview performance.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-accent w-full">View Stats</button>
              </div>
            </div>
          </div>

        </div>

        {/* RECENT ACTIVITY (Placeholder) */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="text-center py-8 text-base-content/60">
                No recent activity found. Start solving problems to see your progress!
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;