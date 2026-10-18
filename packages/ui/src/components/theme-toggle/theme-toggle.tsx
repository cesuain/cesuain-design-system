"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useSyncExternalStore } from "react";

import { IconButton, type IconButtonProps } from "../icon-button/icon-button.js";

export type Theme = "dark" | "light";

const root = () => document.documentElement;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ["data-theme", "class"] });
  return () => observer.disconnect();
}

/** Reads the active theme from `<html data-theme>` (or a `.light` class). Dark is the default. */
export function getDocumentTheme(): Theme {
  const el = root();
  return el.dataset.theme === "light" || el.classList.contains("light") ? "light" : "dark";
}

/** Applies a theme to `<html>` and, when `storageKey` is set, remembers it. */
export function setDocumentTheme(theme: Theme, storageKey?: string) {
  const el = root();
  el.dataset.theme = theme;
  el.classList.toggle("light", theme === "light");
  el.classList.toggle("dark", theme === "dark");
  el.style.colorScheme = theme;
  if (storageKey) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Storage can be unavailable (private mode, blocked cookies); the theme still applies.
    }
  }
}

/** Subscribes to the document theme, staying in sync with changes made elsewhere. */
export function useDocumentTheme(): Theme {
  return useSyncExternalStore(subscribe, getDocumentTheme, () => "dark");
}

export type ThemeToggleProps = Omit<IconButtonProps, "label" | "icon" | "onClick"> & {
  /** Controlled theme. Omit to read and write `<html data-theme>` directly. */
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  /** localStorage key used to persist the choice in uncontrolled mode. */
  storageKey?: string;
  labels?: { toLight: string; toDark: string };
};

/** Switches between the dark (default) and light themes. The label names the action, not the state. */
export function ThemeToggle({
  theme: controlled,
  onThemeChange,
  storageKey = "theme",
  labels = { toLight: "Switch to light theme", toDark: "Switch to dark theme" },
  ...props
}: ThemeToggleProps) {
  const documentTheme = useDocumentTheme();
  const theme = controlled ?? documentTheme;
  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = theme === "dark" ? labels.toLight : labels.toDark;

  return (
    <IconButton
      data-slot="theme-toggle"
      label={label}
      title={label}
      icon={theme === "dark" ? <SunIcon /> : <MoonIcon />}
      onClick={() => {
        if (controlled === undefined) setDocumentTheme(next, storageKey);
        onThemeChange?.(next);
      }}
      {...props}
    />
  );
}
