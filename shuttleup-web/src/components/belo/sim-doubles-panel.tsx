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
import { getTierInfo, simulateDoubles, type DoublesSimResult } from "./belo-calc-engine";
import { PlayerResultCard, DetailRow, VsDivider } from "./sim-result-display";

interface Props {
  /** Display label — "Đôi thuần" or "Đôi hỗn hợp" */
  gameLabel: string;
  /** Team member labels — e.g. ["Nam 1", "Nữ 1"] for mixed */
  teamLabelsA?: [string, string];
  teamLabelsB?: [string, string];
}

const DEFAULT_A = ["Người chơi A1", "Người chơi A2"] as [string, string];
const DEFAULT_B = ["Người chơi B1", "Người chơi B2"] as [string, string];

export function SimDoublesPanel({ gameLabel, teamLabelsA = DEFAULT_A, teamLabelsB = DEFAULT_B }: Props) {
  // Team A
  const [eloA1, setEloA1] = useState(1300);
  const [eloA2, setEloA2] = useState(1100);
  const [gamesA1, setGamesA1] = useState(30);
  const [gamesA2, setGamesA2] = useState(15);
  const [togetherA, setTogetherA] = useState(8);
  // Team B
  const [eloB1, setEloB1] = useState(1200);
  const [eloB2, setEloB2] = useState(1200);
  const [gamesB1, setGamesB1] = useState(20);
  const [gamesB2, setGamesB2] = useState(20);
  const [togetherB, setTogetherB] = useState(3);

  const [winner, setWinner] = useState<"A" | "B">("A");
  const [result, setResult] = useState<DoublesSimResult | null>(null);

  const handleSimulate = useCallback(() => {
    setResult(simulateDoubles(eloA1, eloA2, gamesA1, gamesA2, togetherA,
      eloB1, eloB2, gamesB1, gamesB2, togetherB, winner));
  }, [eloA1, eloA2, gamesA1, gamesA2, togetherA, eloB1, eloB2, gamesB1, gamesB2, togetherB, winner]);

  const handleReset = () => {
    setEloA1(1300); setEloA2(1100); setGamesA1(30); setGamesA2(15); setTogetherA(8);
    setEloB1(1200); setEloB2(1200); setGamesB1(20); setGamesB2(20); setTogetherB(3);
    setWinner("A"); setResult(null);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Input panel */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Thông tin trận {gameLabel}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TeamInput label="Đội A" color="blue" labels={teamLabelsA}
            elo1={eloA1} elo2={eloA2} games1={gamesA1} games2={gamesA2} together={togetherA}
            onElo1={setEloA1} onElo2={setEloA2} onGames1={setGamesA1} onGames2={setGamesA2} onTogether={setTogetherA} />
          <TeamInput label="Đội B" color="rose" labels={teamLabelsB}
            elo1={eloB1} elo2={eloB2} games1={gamesB1} games2={gamesB2} together={togetherB}
            onElo1={setEloB1} onElo2={setEloB2} onGames1={setGamesB1} onGames2={setGamesB2} onTogether={setTogetherB} />
          {/* Winner + Actions */}
          <div>
            <Label className="text-xs">Đội thắng</Label>
            <Select value={winner} onValueChange={(v) => setWinner(v as "A" | "B")}>
              <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Đội A thắng</SelectItem>
                <SelectItem value="B">Đội B thắng</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <DoublesResultView result={result} winner={winner}
              eloA1={eloA1} eloA2={eloA2} eloB1={eloB1} eloB2={eloB2}
              labelsA={teamLabelsA} labelsB={teamLabelsB} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Doubles Result View ──────────────────────────────────────────────────

function DoublesResultView({ result, winner, eloA1, eloA2, eloB1, eloB2, labelsA, labelsB }: {
  result: DoublesSimResult; winner: "A" | "B";
  eloA1: number; eloA2: number; eloB1: number; eloB2: number;
  labelsA: [string, string]; labelsB: [string, string];
}) {
  return (
    <div className="space-y-4">
      {/* Team A */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
          <span>Đội A</span>
          {result.synergyBonusA > 0 && <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">🤝 +{result.synergyBonusA}</Badge>}
          <span className="text-muted-foreground font-normal">PR: {result.pairRatingA}</span>
        </div>
        <PlayerResultCard label={labelsA[0]} eloBefore={eloA1} eloAfter={result.playerA1.newElo}
          delta={result.playerA1.delta} expected={result.expectedA} isWinner={winner === "A"} colorScheme="blue" carryWeight={result.playerA1.carryWeight} />
        <PlayerResultCard label={labelsA[1]} eloBefore={eloA2} eloAfter={result.playerA2.newElo}
          delta={result.playerA2.delta} expected={result.expectedA} isWinner={winner === "A"} colorScheme="blue" carryWeight={result.playerA2.carryWeight} />
      </div>
      <VsDivider />
      {/* Team B */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-700">
          <span>Đội B</span>
          {result.synergyBonusB > 0 && <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">🤝 +{result.synergyBonusB}</Badge>}
          <span className="text-muted-foreground font-normal">PR: {result.pairRatingB}</span>
        </div>
        <PlayerResultCard label={labelsB[0]} eloBefore={eloB1} eloAfter={result.playerB1.newElo}
          delta={result.playerB1.delta} expected={result.expectedB} isWinner={winner === "B"} colorScheme="rose" carryWeight={result.playerB1.carryWeight} />
        <PlayerResultCard label={labelsB[1]} eloBefore={eloB2} eloAfter={result.playerB2.newElo}
          delta={result.playerB2.delta} expected={result.expectedB} isWinner={winner === "B"} colorScheme="rose" carryWeight={result.playerB2.carryWeight} />
      </div>
      {/* Details */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
        <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Chi tiết tính toán</h4>
        <DetailRow label="K-Factor" value={result.kFactor.toString()} />
        <DetailRow label="Pair Rating A" value={`${result.pairRatingA} (syn: +${result.synergyBonusA})`} />
        <DetailRow label="Pair Rating B" value={`${result.pairRatingB} (syn: +${result.synergyBonusB})`} />
        <DetailRow label="Xác suất Đội A thắng" value={`${(result.expectedA * 100).toFixed(1)}%`} />
      </div>
    </div>
  );
}

// ─── Team Input ───────────────────────────────────────────────────────────

function TeamInput({ label, color, labels, elo1, elo2, games1, games2, together,
  onElo1, onElo2, onGames1, onGames2, onTogether }: {
  label: string; color: "blue" | "rose"; labels: [string, string];
  elo1: number; elo2: number; games1: number; games2: number; together: number;
  onElo1: (v: number) => void; onElo2: (v: number) => void;
  onGames1: (v: number) => void; onGames2: (v: number) => void; onTogether: (v: number) => void;
}) {
  const bg = color === "blue" ? "bg-blue-50/50 border-blue-100" : "bg-rose-50/50 border-rose-100";
  const lc = color === "blue" ? "text-blue-800" : "text-rose-800";
  const ic = color === "blue" ? "text-blue-700" : "text-rose-700";
  const t1 = getTierInfo(elo1);
  const t2 = getTierInfo(elo2);

  return (
    <div className={`p-4 rounded-lg border ${bg} space-y-3`}>
      <div className="flex items-center justify-between">
        <span className={`font-semibold text-sm ${lc}`}>{label}</span>
      </div>
      {/* Player 1 */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${ic}`}>{labels[0]}</span>
          <Badge className={`${t1.color} text-[10px]`}>{t1.emoji} {t1.name}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className={`text-[10px] ${ic}`}>ELO</Label>
            <Input type="number" value={elo1} onChange={(e) => onElo1(Number(e.target.value))} className="mt-0.5 h-8 text-sm" min={100} max={3000} />
          </div>
          <div>
            <Label className={`text-[10px] ${ic}`}>Số trận</Label>
            <Input type="number" value={games1} onChange={(e) => onGames1(Number(e.target.value))} className="mt-0.5 h-8 text-sm" min={0} max={999} />
          </div>
        </div>
      </div>
      {/* Player 2 */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${ic}`}>{labels[1]}</span>
          <Badge className={`${t2.color} text-[10px]`}>{t2.emoji} {t2.name}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className={`text-[10px] ${ic}`}>ELO</Label>
            <Input type="number" value={elo2} onChange={(e) => onElo2(Number(e.target.value))} className="mt-0.5 h-8 text-sm" min={100} max={3000} />
          </div>
          <div>
            <Label className={`text-[10px] ${ic}`}>Số trận</Label>
            <Input type="number" value={games2} onChange={(e) => onGames2(Number(e.target.value))} className="mt-0.5 h-8 text-sm" min={0} max={999} />
          </div>
        </div>
      </div>
      {/* Games together */}
      <div>
        <Label className={`text-[10px] ${ic}`}>Số trận cùng nhau (Synergy)</Label>
        <Input type="number" value={together} onChange={(e) => onTogether(Number(e.target.value))}
          className="mt-0.5 h-8 text-sm" min={0} max={999} />
      </div>
    </div>
  );
}
