import Link from "next/link";
import { Library, Swords, Share2, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-50 md:text-5xl">
          杀戮尖塔2{" "}
          <span className="text-amber-400">卡组构建器</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-400">
          在线构建、分享和探索杀戮尖塔2卡组。完整的卡牌数据库，便捷的组卡工具，一键生成分享图。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/deckbuilder"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            <Swords className="h-5 w-5" />
            开始组卡
          </Link>
          <Link
            href="/cards"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            <Library className="h-5 w-5" />
            浏览卡牌
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-6 md:grid-cols-3">
        <FeatureCard
          icon={<Library className="h-6 w-6 text-sky-400" />}
          title="完整卡牌库"
          desc="覆盖全部角色卡牌、遗物、药水，支持多维度筛选和搜索。"
        />
        <FeatureCard
          icon={<Swords className="h-6 w-6 text-rose-400" />}
          title="在线组卡器"
          desc="拖拽式组卡，实时查看卡组曲线和核心数据。"
        />
        <FeatureCard
          icon={<Share2 className="h-6 w-6 text-emerald-400" />}
          title="一键分享"
          desc="生成精美分享图，直接发到贴吧、Reddit 或 Discord。"
        />
      </div>

      {/* Coming soon */}
      <div className="mt-16 rounded-xl border border-slate-800 bg-slate-900/50 p-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h2 className="text-xl font-bold text-slate-100">即将上线</h2>
        </div>
        <ul className="space-y-2 text-slate-400">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            卡组广场 — 浏览和点赞社区热门卡组
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            种子分享 — 分享有趣的随机种子
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            攻略文章 — 流派讲解和进阶技巧
          </li>
        </ul>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-slate-700">
      <div className="mb-3">{icon}</div>
      <h3 className="mb-2 font-bold text-slate-100">{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  );
}
