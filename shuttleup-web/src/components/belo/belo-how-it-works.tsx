"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Gauge, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Calculator,
    title: "Xác suất thắng kỳ vọng",
    desc: "E(A) = 1 / (1 + 10^((R_B − R_A) / 400))",
    detail:
      "Hệ thống tính xác suất bạn thắng dựa trên chênh lệch ELO với đối thủ. Chênh 200 điểm ≈ 76% thắng.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Gauge,
    title: "K-Factor theo kinh nghiệm",
    desc: "Mới: K=32 • Thường: K=24 • Kỳ cựu: K=16",
    detail:
      "Người mới có K cao để nhanh tìm đúng ngưỡng. Kỳ cựu (>100 trận) có K thấp giúp điểm ổn định hơn.",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: BarChart3,
    title: "Carry Weight (Đôi)",
    desc: "gap = |R_A − R_B| / 400 → weight_strong ≥ 0.35",
    detail:
      "Khi hai người lệch trình, người yếu nhận tỉ lệ điểm cao hơn — ngăn chặn farm điểm bằng cách ghép mạnh-yếu.",
    color: "text-rose-600 bg-rose-50",
  },
];

export function BeloHowItWorks() {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight mb-1">
        Cách tính điểm BELo
      </h2>
      <p className="text-sm text-muted-foreground mb-5">
        Công thức ELO mở rộng với K-factor và Carry Weight
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {steps.map((step) => (
          <Card
            key={step.title}
            className="group hover:shadow-md transition-shadow border-slate-200"
          >
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${step.color}`}
                >
                  <step.icon className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-sm">{step.title}</h3>
              </div>

              <code className="block text-xs bg-slate-50 rounded-md px-3 py-2 font-mono text-slate-700 border border-slate-100">
                {step.desc}
              </code>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Synergy Bonus callout */}
      <Card className="mt-4 border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0 mt-0.5">
            🤝
          </div>
          <div>
            <h4 className="font-semibold text-sm text-primary">
              Hóa học cặp đôi (Synergy Bonus)
            </h4>
            <p className="text-xs text-primary/80 mt-1 leading-relaxed">
              Đánh cùng nhau nhiều = bonus thêm điểm cho cặp đôi.
              5-9 trận: +5 • 10-19 trận: +10 • 20+ trận: +15 (tối đa).
              Bonus được cộng vào Pair Rating khi tính xác suất thắng.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
