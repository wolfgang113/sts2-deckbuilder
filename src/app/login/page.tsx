"use client";

import AuthModal from "@/components/AuthModal";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-100">登录</h1>
        <p className="mt-2 text-sm text-slate-500">登录后可使用收藏、评论等功能</p>
      </div>
      <AuthModal
        isOpen={true}
        onClose={() => { window.location.href = "/"; }}
        onSuccess={() => { window.location.href = "/stats"; }}
      />
    </div>
  );
}
