"use client";

import { openCookiePreferences } from "@/lib/cookie-consent";

interface CookieSettingsButtonProps {
  className?: string;
  label?: string;
}

export default function CookieSettingsButton({
  className = "hover:text-white transition-colors text-left cursor-pointer",
  label = "Cookie Settings",
}: CookieSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className={className}
    >
      {label}
    </button>
  );
}
