"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Play, RotateCcw } from "lucide-react";
import { getTierInfo, simulateSingles, type SinglesSimResult } from "./belo-calc-engine";
import { PlayerResultCard, DetailRow, VsDivider } from "./sim-result-display";

export function SimSinglesPanel() {
  const [eloA, setEloA] = useState(1200);
  const [eloB, setEloB] = useState(1000);
  const [gamesA, setGamesA] = useState(10);
  const [gamesB, setGamesB] = useState(25);
  const [winner, setWinner] = useState<"A" | "B">("A");
  const [result, setResult] = useState<SinglesSimResult | null>(null);

  const handleSimulate = useCallback(() => {
    setResult(simulateSingles(eloA, eloB, winner, gamesA, gamesB));
  }, [eloA, eloB, winner, gamesA, gamesB]);

  const handleReset = () => {
    setEloA(1200); setEloB(1000); setGamesA(10); setGamesB(25);
    setWinner("A"); setResult(null);
  };

  const tierA = getTierInfo(eloA);
  const tierB = getTierInfo(eloB);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Input panel */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Thông tin trận đấu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Player A */}
          <PlayerInput label="Người chơi A" color="blue" tier={tierA}
            elo={eloA} onEloChange={setEloA} games={gamesA} onGamesChange={setGamesA} />
          {/* Player B */}
          <PlayerInput label="Người chơi B" color="rose" tier={tierB}
            elo={eloB} onEloChange={setEloB} games={gamesB} onGamesChange={setGamesB} />
          {/* Winner */}
          <div>
            <Label className="text-xs">Người thắng</Label>
            <Select value={winner} onValueChange={(v) => setWinner(v as "A" | "B")}>
              <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Người chơi A thắng</SelectItem>
                <SelectItem value="B">Người chơi B thắng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button onClick={handleSimulate} className="flex-1 bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
              <Play className="mr-2 h-4 w-4" /> Tính ELO
            </Button>
            <Button variant="outline" onClick={handleReset} className="cursor-pointer">
              <RotateCcw className="mr-1 h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result panel */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4"><CardTitle className="text-base">Kết quả</CardTitle></CardHeader>
        <CardContent>
          {!result ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Play className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm">Nhấn &quot;Tính ELO&quot; để xem kết quả</p>
            </div>
          ) : (
            <div className="space-y-5">
              <PlayerResultCard label="Người chơi A" eloBefore={eloA} eloAfter={result.newEloA}
                delta={result.deltaA} expected={result.expectedA} isWinner={winner === "A"} colorScheme="blue" />
              <VsDivider />
              <PlayerResultCard label="Người chơi B" eloBefore={eloB} eloAfter={result.newEloB}
                delta={result.deltaB} expected={result.expectedB} isWinner={winner === "B"} colorScheme="rose" />
              <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Chi tiết tính toán</h4>
                <DetailRow label="K-Factor" value={result.kFactor.toString()} />
                <DetailRow label="Xác suất A thắng" value={`${(result.expectedA * 100).toFixed(1)}%`} />
                <DetailRow label="Xác suất B thắng" value={`${(result.expectedB * 100).toFixed(1)}%`} />
                <DetailRow label="Tổng delta" value={`${result.deltaA > 0 ? "+" : ""}${result.deltaA} / ${result.deltaB > 0 ? "+" : ""}${result.deltaB}`} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Player Input Sub-component ───────────────────────────────────────────

function PlayerInput({ label, color, tier, elo, onEloChange, games, onGamesChange }: {
  label: string; color: "blue" | "rose";
  tier: { name: string; emoji: string; color: string };
  elo: number; onEloChange: (v: number) => void;
  games: number; onGamesChange: (v: number) => void;
}) {
  const bgClass = color === "blue" ? "bg-blue-50/50 border-blue-100" : "bg-rose-50/50 border-rose-100";
  const labelColor = color === "blue" ? "text-blue-800" : "text-rose-800";
  const inputLabel = color === "blue" ? "text-blue-700" : "text-rose-700";

  return (
    <div className={`space-y-3 p-4 rounded-lg ${bgClass} border`}>
      <div className="flex items-center justify-between">
        <span className={`font-semibold text-sm ${labelColor}`}>{label}</span>
        <Badge className={tier.color}>{tier.emoji} {tier.name}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className={`text-xs ${inputLabel}`}>ELO hiện tại</Label>
          <Input type="number" value={elo} onChange={(e) => onEloChange(Number(e.target.value))}
            className="mt-1 h-9" min={100} max={3000} />
        </div>
        <div>
          <Label className={`text-xs ${inputLabel}`}>Tổng số trận</Label>
          <Input type="number" value={games} onChange={(e) => onGamesChange(Number(e.target.value))}
            className="mt-1 h-9" min={0} max={999} />
        </div>
      </div>
    </div>
  );
}
