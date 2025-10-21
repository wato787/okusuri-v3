import { useMemo, useState, useTransition } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Check,
  Clock,
  Droplet,
  Info,
  PauseCircle,
  Pill,
} from "lucide-react";

import type { MedicationSummary as SharedMedicationSummary } from '@okusuri/shared';

type MedicationSummary = {
  currentStreak: number;
  consecutiveBleedingDays: number;
  isRestPeriod: boolean;
  restDaysLeft: number;
};

const defaultSummary: MedicationSummary = {
  currentStreak: 12,
  consecutiveBleedingDays: 0,
  isRestPeriod: false,
  restDaysLeft: 0,
};

const REST_PERIOD_TOTAL_DAYS = 4;

export function Home() {
  const [summary, setSummary] = useState<MedicationSummary>(defaultSummary);
  const [isPending, startTransition] = useTransition();
  const [activeButton, setActiveButton] = useState<"bleeding" | "normal" | null>(
    null
  );

  const formattedToday = useMemo(
    () => format(new Date(), "yyyy年MM月dd日 (eee)", { locale: ja }),
    []
  );

  const restProgress = useMemo(() => {
    if (!summary.isRestPeriod) return 0;
    const elapsed = REST_PERIOD_TOTAL_DAYS - summary.restDaysLeft;
    return (elapsed / REST_PERIOD_TOTAL_DAYS) * 100;
  }, [summary]);

  const handler = (hasBleeding: boolean) => {
    if (isPending) return;

    setActiveButton(hasBleeding ? "bleeding" : "normal");

    startTransition(() => {
      setTimeout(() => {
        toast.success("ダミーの記録完了");
        setSummary((prev) => ({
          ...prev,
          consecutiveBleedingDays: hasBleeding ? prev.consecutiveBleedingDays + 1 : 0,
          currentStreak: hasBleeding ? prev.currentStreak : prev.currentStreak + 1,
        }));
        setActiveButton(null);
      }, 800);
    });
  };

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <Header />
      <Toaster position="top-center" />

      <main className="container mx-auto max-w-md space-y-6 px-4 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden border-0 rounded-xl shadow-lg">
            <div
              className={cn(
                "py-4 px-5 text-white font-medium",
                summary.isRestPeriod
                  ? "bg-gradient-to-r from-amber-500 to-amber-400"
                  : "bg-gradient-to-r from-teal-600 to-teal-500"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {summary.isRestPeriod ? (
                    <span className="text-lg flex items-center">
                      <PauseCircle className="mr-2 h-5 w-5" />
                      休薬期間中
                    </span>
                  ) : (
                    <span className="text-lg flex items-center">
                      <Pill className="mr-2 h-5 w-5" />
                      服用継続中
                    </span>
                  )}
                </div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {summary.isRestPeriod
                    ? `残り${summary.restDaysLeft}日`
                    : `${summary.currentStreak}日目`}
                </div>
              </div>
            </div>

            <CardContent className="p-5 space-y-5">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="mb-1 flex items-center text-sm text-muted-foreground">
                  <Pill className="mr-2 h-4 w-4" />
                  <span>服用日数</span>
                </div>
                <div className="text-2xl font-bold">
                  {summary.isRestPeriod ? "休薬中" : `${summary.currentStreak}日目`}
                </div>
              </div>

              {summary.isRestPeriod && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">休薬期間の進捗</div>
                    <div className="text-sm font-medium">
                      {REST_PERIOD_TOTAL_DAYS - summary.restDaysLeft}/
                      {REST_PERIOD_TOTAL_DAYS}日
                    </div>
                  </div>
                  <Progress value={restProgress} className="h-2" />
                  <div className="mt-1 text-center text-xs text-muted-foreground">
                    休薬期間終了後、服用日数は1日目からリセットされます
                  </div>
                </div>
              )}

              {summary.consecutiveBleedingDays > 0 && !summary.isRestPeriod && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-start rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-900/20"
                >
                  <Info className="mr-2 h-5 w-5 flex-shrink-0 text-amber-500" />
                  <div>
                    <p className="font-medium">
                      連続{summary.consecutiveBleedingDays}日間出血があります
                    </p>
                    {summary.consecutiveBleedingDays >= 3 && (
                      <p className="mt-1 text-xs">
                        3日連続で出血がある場合は、4日間の休薬期間に入ってください。
                        休薬後は服用日数が1日目からリセットされます。
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="flex items-center rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <Clock className="mr-3 h-5 w-5 flex-shrink-0 text-blue-500" />
                <span className="font-medium">
                  {summary.isRestPeriod
                    ? `あと${summary.restDaysLeft}日の休薬期間を続けてください`
                    : summary.consecutiveBleedingDays >= 3
                    ? "休薬期間に入ることをお勧めします"
                    : "毎日服用を続けてください"}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 py-3 px-4 text-lg font-medium shadow-sm dark:bg-gray-800/50">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span>{formattedToday}</span>
          </div>

          <Card className="overflow-hidden border-0 rounded-xl shadow-lg">
            <CardContent className="space-y-6 px-5 py-5">
              <div className="flex items-center gap-2 text-lg">
                {summary.isRestPeriod ? (
                  <Info className="h-5 w-5 text-amber-500" />
                ) : (
                  <Droplet className="h-5 w-5 text-red-500" />
                )}
                <span>
                  {summary.isRestPeriod ? "休薬期間中の出血状況" : "今日の出血状況"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant={activeButton === "bleeding" ? "default" : "outline"}
                    className={cn(
                      "relative h-20 w-full rounded-xl text-lg shadow-sm",
                      activeButton === "bleeding"
                        ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                        : "border-2 border-red-200 hover:border-red-300 dark:border-red-800/50 dark:hover:border-red-700"
                    )}
                    disabled={isPending}
                    onClick={() => handler(true)}
                  >
                    {isPending && activeButton === "bleeding" ? (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent" />
                        </div>
                        <span className="opacity-0">出血あり</span>
                      </>
                    ) : (
                      <>
                        <Droplet className="mr-2 h-6 w-6" />
                        <span>出血あり</span>
                      </>
                    )}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant={activeButton === "normal" ? "default" : "outline"}
                    className={cn(
                      "relative h-20 w-full rounded-xl text-lg shadow-sm",
                      activeButton === "normal"
                        ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                        : "border-2 border-green-200 hover:border-green-300 dark:border-green-800/50 dark:hover:border-green-700"
                    )}
                    disabled={isPending}
                    onClick={() => handler(false)}
                  >
                    {isPending && activeButton === "normal" ? (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent" />
                        </div>
                        <span className="opacity-0">出血なし</span>
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-6 w-6" />
                        <span>出血なし</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>

              <AnimatePresence>
                {isPending && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-lg bg-gray-50 py-2 px-3 text-center text-sm text-muted-foreground dark:bg-gray-800/50"
                  >
                    記録を保存しています...
                  </motion.div>
                )}
              </AnimatePresence>

              {summary.isRestPeriod && (
                <div className="rounded-lg bg-gray-50 p-3 text-sm text-muted-foreground dark:bg-gray-800/50">
                  休薬期間中も出血状況を記録してください。休薬期間が終了すると、連続服用日数は1日目からリセットされます。
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <BottomNavigation />
    </div>
  );
}


