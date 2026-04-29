"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Play, RotateCcw, ArrowUp, ArrowDown, Minus } from "lucide-react";

import {
  getTierInfo,
  simulateSingles,
  type SinglesSimResult,
} from "./belo-calc-engine";

type SimResult = SinglesSimResult;

// ─── Component ────────────────────────────────────────────────────────────

export function BeloSimulator() {
  const [eloA, setEloA] = useState(1200);
  const [eloB, setEloB] = useState(1000);
  const [gamesA, setGamesA] = useState(10);
  const [gamesB, setGamesB] = useState(25);
  const [winner, setWinner] = useState<"A" | "B">("A");
  const [result, setResult] = useState<SimResult | null>(null);

  const handleSimulate = useCallback(() => {
    setResult(simulateSingles(eloA, eloB, winner, gamesA, gamesB));
  }, [eloA, eloB, winner, gamesA, gamesB]);

  const handleReset = () => {
    setEloA(1200);
    setEloB(1000);
    setGamesA(10);
    setGamesB(25);
    setWinner("A");
    setResult(null);
  };

  const tierA = getTierInfo(eloA);
  const tierB = getTierInfo(eloB);

  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight mb-1">
        Simulator — Thử tính ELO
      </h2>
      <p className="text-sm text-muted-foreground mb-5">
        Nhập thông tin hai người chơi và xem kết quả thay đổi ELO ngay lập tức
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Input panel */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Thông tin trận đấu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Player A */}
            <div className="space-y-3 p-4 rounded-lg bg-blue-50/50 border border-blue-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-blue-800">
                  Người chơi A
                </span>
                <Badge className={tierA.color}>
                  {tierA.emoji} {tierA.name}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-blue-700">ELO hiện tại</Label>
                  <Input
                    type="number"
                    value={eloA}
                    onChange={(e) => setEloA(Number(e.target.value))}
                    className="mt-1 h-9"
                    min={100}
                    max={3000}
                  />
                </div>
                <div>
                  <Label className="text-xs text-blue-700">Tổng số trận</Label>
                  <Input
                    type="number"
                    value={gamesA}
                    onChange={(e) => setGamesA(Number(e.target.value))}
                    className="mt-1 h-9"
                    min={0}
                    max={999}
                  />
                </div>
              </div>
            </div>

            {/* Player B */}
            <div className="space-y-3 p-4 rounded-lg bg-rose-50/50 border border-rose-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-rose-800">
                  Người chơi B
                </span>
                <Badge className={tierB.color}>
                  {tierB.emoji} {tierB.name}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-rose-700">ELO hiện tại</Label>
                  <Input
                    type="number"
                    value={eloB}
                    onChange={(e) => setEloB(Number(e.target.value))}
                    className="mt-1 h-9"
                    min={100}
                    max={3000}
                  />
                </div>
                <div>
                  <Label className="text-xs text-rose-700">Tổng số trận</Label>
                  <Input
                    type="number"
                    value={gamesB}
                    onChange={(e) => setGamesB(Number(e.target.value))}
                    className="mt-1 h-9"
                    min={0}
                    max={999}
                  />
                </div>
              </div>
            </div>

            {/* Match params — Winner only */}
            <div>
              <Label className="text-xs">Người thắng</Label>
              <Select
                value={winner}
                onValueChange={(v) => { if (v) setWinner(v as "A" | "B"); }}
              >
                <SelectTrigger className="mt-1 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Người chơi A thắng</SelectItem>
                  <SelectItem value="B">Người chơi B thắng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleSimulate}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              >
                <Play className="mr-2 h-4 w-4" />
                Tính ELO
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="cursor-pointer"
              >
                <RotateCcw className="mr-1 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result panel */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Kết quả</CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Play className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-sm">Nhấn &quot;Tính ELO&quot; để xem kết quả</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Player results */}
                <PlayerResultCard
                  label="Người chơi A"
                  eloBefore={eloA}
                  eloAfter={result.newEloA}
                  delta={result.deltaA}
                  expected={result.expectedA}
                  isWinner={winner === "A"}
                  colorScheme="blue"
                />

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-muted-foreground font-medium">VS</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                <PlayerResultCard
                  label="Người chơi B"
                  eloBefore={eloB}
                  eloAfter={result.newEloB}
                  delta={result.deltaB}
                  expected={result.expectedB}
                  isWinner={winner === "B"}
                  colorScheme="rose"
                />

                {/* Calculation details */}
                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Chi tiết tính toán
                  </h4>
                  <DetailRow label="K-Factor" value={result.kFactor.toString()} />
                  <DetailRow
                    label="Xác suất A thắng"
                    value={`${(result.expectedA * 100).toFixed(1)}%`}
                  />
                  <DetailRow
                    label="Xác suất B thắng"
                    value={`${(result.expectedB * 100).toFixed(1)}%`}
                  />
                  <DetailRow
                    label="Tổng delta"
                    value={`${result.deltaA > 0 ? "+" : ""}${result.deltaA} / ${result.deltaB > 0 ? "+" : ""}${result.deltaB}`}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────

function PlayerResultCard({
  label,
  eloBefore,
  eloAfter,
  delta,
  expected,
  isWinner,
  colorScheme,
}: {
  label: string;
  eloBefore: number;
  eloAfter: number;
  delta: number;
  expected: number;
  isWinner: boolean;
  colorScheme: "blue" | "rose";
}) {
  const tierBefore = getTierInfo(eloBefore);
  const tierAfter = getTierInfo(eloAfter);
  const tierChanged = tierBefore.name !== tierAfter.name;

  const bgClass =
    colorScheme === "blue" ? "bg-blue-50/60 border-blue-100" : "bg-rose-50/60 border-rose-100";

  const DeltaIcon = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : Minus;
  const deltaColor =
    delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-500" : "text-slate-400";

  return (
    <div className={`p-4 rounded-lg border ${bgClass}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold">{label}</span>
        {isWinner ? (
          <Badge className="bg-emerald-100 text-emerald-700">Thắng</Badge>
        ) : (
          <Badge className="bg-red-50 text-red-600">Thua</Badge>
        )}
      </div>

      <div className="flex items-end gap-4">
        {/* Before */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Trước</p>
          <p className="text-lg font-bold text-slate-600">{eloBefore}</p>
        </div>

        {/* Arrow + Delta */}
        <div className="flex items-center gap-1 pb-1">
          <span className="text-slate-300">→</span>
          <span className={`flex items-center gap-0.5 text-sm font-bold ${deltaColor}`}>
            <DeltaIcon className="h-3.5 w-3.5" />
            {delta > 0 ? `+${delta}` : delta}
          </span>
          <span className="text-slate-300">→</span>
        </div>

        {/* After */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Sau</p>
          <p className="text-lg font-extrabold">{eloAfter}</p>
        </div>

        <div className="ml-auto text-right">
          <Badge className={tierAfter.color}>
            {tierAfter.emoji} {tierAfter.name}
          </Badge>
          {tierChanged && (
            <p className="text-[10px] text-emerald-600 font-medium mt-1">
              Thay đổi tier!
            </p>
          )}
        </div>
      </div>

      {/* Win probability bar */}
      <div className="mt-3">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Xác suất thắng kỳ vọng</span>
          <span className="font-medium">{(expected * 100).toFixed(1)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${expected * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="font-mono font-medium text-slate-700">{value}</span>
    </div>
  );
}
