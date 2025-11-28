"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";


export function ThemeToggle() {
    const { theme, setTheme } = useTheme();


  return (
    <Button 
    variant="outline" 
    size="icon" 
    className="absolute top-4 right-4 rounded-full hover:scale-110 transition-transform cursor-pointer z-10"   
    onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        <FaSun className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0 "/> 
        <FaMoon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " />
      </Button>
  );
}