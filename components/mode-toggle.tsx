"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <ActionTooltip side="right" align="center" label={
      theme === "light" ? "Switch to dark mode" : "Switch to light mode"
    }>
    <Button
      variant="outline"
      size={"icon"}
      className="rounded-full w-[48px] h-[48px]"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      )}
    </Button>
    </ActionTooltip>
  );
}
