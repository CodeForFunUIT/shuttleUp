"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trophy, Target, Users, Shuffle } from "lucide-react";
import { SimSinglesPanel } from "./sim-singles-panel";
import { SimDoublesPanel } from "./sim-doubles-panel";
import { BeloTierBadge } from "./belo-tier-badge";

/**
 * Public BELo simulator with tabs for all 3 game modes.
 * Designed for the homepage — no auth required.
 */
export function BeloPublicSimulator() {
  const showcaseTiers = [800, 1100, 1400, 1700, 2000, 2300];

  return (
    <div>
      {/* Section header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm text-primary font-bold mb-4 glow-gold-subtle">
          <Trophy className="h-4 w-4 fill-primary" />
          HỆ THỐNG XẾP HẠNG BELO® ĐỘC QUYỀN
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-white tracking-tight mb-3">
          Trải Nghiệm <span className="text-gradient-gold">Đấu Trường BELo</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
          Thuật toán Elo tối ưu hoá riêng cho môn cầu lông — tính toán điểm thực lực theo chênh lệch trình độ và trọng số gánh team. Thử ngay không cần đăng nhập.
        </p>

        {/* Tier progression ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 pt-4 border-t border-white/5">
          {showcaseTiers.map((elo) => (
            <BeloTierBadge key={elo} elo={elo} showRange size="sm" />
          ))}
        </div>
      </div>

      {/* Tabbed simulator */}
      <Tabs defaultValue="singles" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-[#181F2C] border border-white/10 p-1 rounded-xl">
          <TabsTrigger
            value="singles"
            className="text-slate-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold cursor-pointer gap-1.5 transition-all"
          >
            <Target className="h-4 w-4" /> Đơn
          </TabsTrigger>
          <TabsTrigger
            value="doubles"
            className="text-slate-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold cursor-pointer gap-1.5 transition-all"
          >
            <Users className="h-4 w-4" /> Đôi
          </TabsTrigger>
          <TabsTrigger
            value="mixed"
            className="text-slate-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold cursor-pointer gap-1.5 transition-all"
          >
            <Shuffle className="h-4 w-4" /> Hỗn Hợp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="singles">
          <SimSinglesPanel />
        </TabsContent>

        <TabsContent value="doubles">
          <SimDoublesPanel gameLabel="Đôi thuần" />
        </TabsContent>

        <TabsContent value="mixed">
          <SimDoublesPanel
            gameLabel="Đôi hỗn hợp"
            teamLabelsA={["Nam (A)", "Nữ (A)"]}
            teamLabelsB={["Nam (B)", "Nữ (B)"]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

