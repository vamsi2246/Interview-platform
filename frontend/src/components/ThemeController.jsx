import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeController = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <label className="swap swap-rotate p-2 rounded-lg hover:bg-base-200 transition-colors">
            {/* this hidden checkbox controls the state */}
            <input
                type="checkbox"
                className="theme-controller"
                onChange={toggleTheme}
                checked={theme === "dark"}
            />

            {/* sun icon */}
            <Sun className="swap-off h-5 w-5 text-yellow-500 fill-current" />

            {/* moon icon */}
            <Moon className="swap-on h-5 w-5 text-blue-500 fill-current" />
        </label>
    );
};
export default ThemeController;
