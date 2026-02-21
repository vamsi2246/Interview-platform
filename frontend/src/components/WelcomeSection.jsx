import { useUser } from "@clerk/clerk-react";
import { PlusIcon, SparklesIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
    const { user } = useUser();

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="card bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20">
                <div className="card-body flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left: Greeting */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-2xl">
                            <SparklesIcon className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black">
                                Welcome back,{" "}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {user?.firstName || "Coder"}
                                </span>
                                !
                            </h1>
                            <p className="text-sm opacity-70 mt-1">
                                Ready to start a coding session? Create one or join an existing room.
                            </p>
                        </div>
                    </div>

                    {/* Right: Create button */}
                    <button className="btn btn-primary gap-2" onClick={onCreateSession}>
                        <PlusIcon className="size-5" />
                        Create Session
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WelcomeSection;
