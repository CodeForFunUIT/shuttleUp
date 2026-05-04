"use client";

const tiers = [
  {
    name: "Kim Cương",
    range: "≥ 2000",
    color: "bg-cyan-100 text-cyan-800 border-cyan-300",
    barColor: "bg-cyan-500",
    barWidth: "w-full",
    emoji: "💎",
    percent: "~1%",
  },
  {
    name: "Vàng",
    range: "1700 – 1999",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    barColor: "bg-amber-500",
    barWidth: "w-[85%]",
    emoji: "🥇",
    percent: "~5%",
  },
  {
    name: "Bạc",
    range: "1400 – 1699",
    color: "bg-slate-100 text-slate-700 border-slate-300",
    barColor: "bg-slate-400",
    barWidth: "w-[70%]",
    emoji: "🥈",
    percent: "~15%",
  },
  {
    name: "Đồng",
    range: "1100 – 1399",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    barColor: "bg-orange-500",
    barWidth: "w-[55%]",
    emoji: "🥉",
    percent: "Đa số",
  },
  {
    name: "Sắt",
    range: "800 – 1099",
    color: "bg-stone-100 text-stone-700 border-stone-300",
    barColor: "bg-stone-400",
    barWidth: "w-[40%]",
    emoji: "⚙️",
    percent: "Mới bắt đầu",
  },
  {
    name: "Nhập môn",
    range: "< 800",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    barColor: "bg-purple-400",
    barWidth: "w-[25%]",
    emoji: "🌱",
    percent: "Lần đầu",
  },
];

export function BeloTierTable() {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight mb-1">
        Bảng xếp hạng (Tiers)
      </h2>
      <p className="text-sm text-muted-foreground mb-5">
        Mỗi game type (Đơn / Đôi / Hỗn hợp) có tier riêng biệt
      </p>

      <div className="space-y-2.5">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${tier.color} transition-transform hover:scale-[1.01]`}
          >
            <span className="text-xl flex-shrink-0 w-8 text-center">
              {tier.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-sm">{tier.name}</span>
                <span className="text-xs opacity-70">{tier.range}</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-black/5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${tier.barColor} transition-all duration-500`}
                  style={{ width: tier.barWidth.replace("w-[", "").replace("]", "").replace("w-full", "100%") }}
                />
              </div>
            </div>
            <span className="text-xs font-medium opacity-60 whitespace-nowrap flex-shrink-0">
              {tier.percent}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-3 italic">
        * ELO chỉ hiển thị công khai sau khi hoàn thành ≥ 5 trận (giai đoạn calibrating).
        Khởi điểm mặc định: 1000.
      </p>
    </section>
  );
}
