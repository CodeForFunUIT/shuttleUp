"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Users, Zap } from "lucide-react";

export function BeloHeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-8 md:p-10 text-white">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-400/20 blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">BELo</h1>
              <p className="text-emerald-100 text-sm font-medium">
                Badminton ELO Ranking System
              </p>
            </div>
          </div>

          <p className="text-emerald-50 text-base leading-relaxed max-w-lg">
            Hệ thống xếp hạng ELO thông minh dành cho cầu lông phong trào.
            Mọi trận đấu pick-up đều được tính điểm — không cần giải đấu chính thức.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Đơn 1v1
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Đôi 2v2
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Đôi hỗn hợp
            </Badge>
          </div>
        </div>

        {/* Stat highlights */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          {[
            { icon: TrendingUp, label: "Cập nhật tức thì", desc: "Sau mỗi trận" },
            { icon: Users, label: "Synergy Bonus", desc: "Đôi ăn ý" },
            { icon: Zap, label: "3 bảng xếp hạng", desc: "Độc lập" },
            { icon: Trophy, label: "6 tier", desc: "Nhập môn → Kim Cương" },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm border-white/20 shadow-none"
            >
              <CardContent className="p-3 flex flex-col items-start gap-1">
                <stat.icon className="h-4 w-4 text-emerald-200" />
                <span className="text-xs font-semibold text-white">
                  {stat.label}
                </span>
                <span className="text-[11px] text-emerald-200">{stat.desc}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
