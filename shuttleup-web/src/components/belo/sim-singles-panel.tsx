"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Play, RotateCcw, Swords, Activity } from "lucide-react";
import { simulateSingles, type SinglesSimResult } from "./belo-calc-engine";
import { PlayerResultCard, DetailRow, VsDivider } from "./sim-result-display";
import { BeloTierBadge } from "./belo-tier-badge";

export function SimSinglesPanel() {
  const [eloA, setEloA] = useState(1550);
  const [eloB, setEloB] = useState(1320);
  const [gamesA, setGamesA] = useState(14);
  const [gamesB, setGamesB] = useState(30);
  const [winner, setWinner] = useState<"A" | "B">("A");
  const [result, setResult] = useState<SinglesSimResult | null>(null);

  const handleSimulate = useCallback(() => {
    setResult(simulateSingles(eloA, eloB, winner, gamesA, gamesB));
  }, [eloA, eloB, winner, gamesA, gamesB]);

  const handleReset = () => {
    setEloA(1550); setEloB(1320); setGamesA(14); setGamesB(30);
    setWinner("A"); setResult(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input panel */}
      <Card className="border border-white/10 bg-[#131822] shadow-xl">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="font-display text-xl font-bold uppercase tracking-tight flex items-center gap-2 text-white">
            <Swords className="h-5 w-5 text-primary" />
            Thiết Lập Kèo Solo Đơn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {/* Player A */}
          <PlayerInput label="Người chơi A (Bạn)" color="blue"
            elo={eloA} onEloChange={setEloA} games={gamesA} onGamesChange={setGamesA} />
          
          <VsDivider />

          {/* Player B */}
          <PlayerInput label="Người chơi B (Đối thủ)" color="rose"
            elo={eloB} onEloChange={setEloB} games={gamesB} onGamesChange={setGamesB} />
          
          {/* Winner */}
          <div className="pt-2">
            <Label className="text-xs font-semibold text-slate-300">Kết quả trận đấu</Label>
            <Select value={winner} onValueChange={(v) => setWinner(v as "A" | "B")}>
              <SelectTrigger className="mt-1.5 h-11 border-white/15 bg-white/5 text-white font-medium cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#181F2C] border-white/10 text-white">
                <SelectItem value="A" className="cursor-pointer font-medium">🏆 Người chơi A thắng</SelectItem>
                <SelectItem value="B" className="cursor-pointer font-medium">🏆 Người chơi B thắng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <Button
              onClick={handleSimulate}
              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg glow-gold cursor-pointer transition-transform active:scale-95"
            >
              <Play className="mr-2 h-4 w-4 fill-primary-foreground" /> Tính Điểm ELO Ngay
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-12 border-white/15 bg-white/5 hover:bg-white/10 text-white cursor-pointer"
            >
              <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result panel */}
      <Card className="border border-white/10 bg-[#131822] shadow-xl flex flex-col justify-between">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="font-display text-xl font-bold uppercase tracking-tight flex items-center gap-2 text-white">
            <Activity className="h-5 w-5 text-emerald-400" />
            Biến Động Điểm BELo Sau Trận
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 flex-1 flex flex-col justify-center">
          {!result ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-primary">
                <Play className="h-7 w-7 fill-primary" />
              </div>
              <h4 className="font-display text-lg font-bold text-white mb-1">Sẵn Sàng Tính Toán</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Điều chỉnh điểm Elo và chọn người thắng, sau đó nhấn &quot;Tính Điểm ELO Ngay&quot;.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <PlayerResultCard label="Người chơi A" eloBefore={eloA} eloAfter={result.newEloA}
                delta={result.deltaA} expected={result.expectedA} isWinner={winner === "A"} colorScheme="blue" />
              
              <PlayerResultCard label="Người chơi B" eloBefore={eloB} eloAfter={result.newEloB}
                delta={result.deltaB} expected={result.expectedB} isWinner={winner === "B"} colorScheme="rose" />
              
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2">Thông Số Thuật Toán ELO</h4>
                <DetailRow label="K-Factor linh hoạt" value={result.kFactor.toString()} />
                <DetailRow label="Kỳ vọng Người A" value={`${(result.expectedA * 100).toFixed(1)}%`} />
                <DetailRow label="Kỳ vọng Người B" value={`${(result.expectedB * 100).toFixed(1)}%`} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Player Input Sub-component ───────────────────────────────────────────

function PlayerInput({ label, color, elo, onEloChange, games, onGamesChange }: {
  label: string; color: "blue" | "rose";
  elo: number; onEloChange: (v: number) => void;
  games: number; onGamesChange: (v: number) => void;
}) {
  const borderClass = color === "blue" ? "border-sky-500/20 bg-sky-500/5" : "border-rose-500/20 bg-rose-500/5";

  return (
    <div className={`p-4 rounded-xl border ${borderClass} space-y-3`}>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-sm text-white tracking-wide">{label}</span>
        <BeloTierBadge elo={elo} size="sm" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[11px] text-slate-400">Điểm BELo</Label>
          <Input
            type="number"
            value={elo}
            onChange={(e) => onEloChange(Number(e.target.value))}
            className="mt-1 h-10 border-white/15 bg-white/5 text-white font-mono font-bold"
            min={100}
            max={3000}
          />
        </div>
        <div>
          <Label className="text-[11px] text-slate-400">Số trận đã đấu</Label>
          <Input
            type="number"
            value={games}
            onChange={(e) => onGamesChange(Number(e.target.value))}
            className="mt-1 h-10 border-white/15 bg-white/5 text-white font-mono font-bold"
            min={0}
            max={999}
          />
        </div>
      </div>
    </div>
  );
}

