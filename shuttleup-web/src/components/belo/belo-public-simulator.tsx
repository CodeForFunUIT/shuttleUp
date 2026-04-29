"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trophy, Target, Users, Shuffle } from "lucide-react";
import { SimSinglesPanel } from "./sim-singles-panel";
import { SimDoublesPanel } from "./sim-doubles-panel";

/**
 * Public BELo simulator with tabs for all 3 game modes.
 * Designed for the homepage — no auth required.
 */
export function BeloPublicSimulator() {
  return (
    <div>
      {/* Section header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400 font-medium mb-4">
          <Trophy className="h-3.5 w-3.5" />
          BELo Ranking System
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
          Trải nghiệm BELo Ranking
        </h2>
        <p className="text-white/60 max-w-xl mx-auto">
          Giả lập tính điểm ELO cho cầu lông — chọn chế độ chơi và thử ngay.
          Không cần đăng nhập.
        </p>
      </div>

      {/* Tabbed simulator */}
      <Tabs defaultValue="singles" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6 bg-white/10 backdrop-blur-sm">
          <TabsTrigger value="singles" className="text-white/70 data-[state=active]:bg-white data-[state=active]:text-slate-900 cursor-pointer gap-1.5">
            <Target className="h-3.5 w-3.5" /> Đơn
          </TabsTrigger>
          <TabsTrigger value="doubles" className="text-white/70 data-[state=active]:bg-white data-[state=active]:text-slate-900 cursor-pointer gap-1.5">
            <Users className="h-3.5 w-3.5" /> Đôi
          </TabsTrigger>
          <TabsTrigger value="mixed" className="text-white/70 data-[state=active]:bg-white data-[state=active]:text-slate-900 cursor-pointer gap-1.5">
            <Shuffle className="h-3.5 w-3.5" /> Hỗn hợp
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
