"use client";

import { Heart } from "lucide-react";

// TODO: 把下面的链接换成你的真实爱发电主页
const AFDIAN_URL = "https://ifdian.net/a/wolfgang113";

export default function SponsorButton() {
  return (
    <a
      href={AFDIAN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
    >
      <Heart className="h-3.5 w-3.5" fill="currentColor" />
      <span className="hidden sm:inline">赞助</span>
    </a>
  );
}
