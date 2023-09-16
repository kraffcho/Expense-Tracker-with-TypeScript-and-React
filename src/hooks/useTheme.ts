import { useEffect, useState } from "react";

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    // Load theme preference from localStorage or default to 'light'
    const savedTheme = localStorage.getItem("theme") || "light";
    const isDark = savedTheme === "dark";
    setIsDarkMode(isDark);

    // IMPORTANT: Set the attribute to make sure it's applied on initial load
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    // Save theme preference to localStorage
    const theme = isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [isDarkMode]);

  return [isDarkMode, setIsDarkMode] as const;
};
