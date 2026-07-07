"use client";

import { type ReactNode } from "react";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  distance?: number;
  speed?: "slow" | "normal" | "fast";
}

export default function FloatingElement({
  children,
  className = "",
  distance = 12,
  speed = "normal",
}: FloatingElementProps) {
  const speedClass = {
    slow: "animate-float-slow",
    normal: "animate-float",
    fast: "animate-float-fast",
  }[speed];

  return (
    <div
      className={`${speedClass} ${className}`}
      style={{ ["--float-distance" as string]: `${distance}px` }}
    >
      {children}
    </div>
  );
}
