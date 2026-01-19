import StatsPanel from "@/components/statistics/stats-panel";

export const metadata = {
  title: "Statistics",
};

export default function StatisticsPage() {
  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Statistics</h1>
        <p className="text-sm text-white/60">
          Your focus history stays entirely in this browser.
        </p>
      </div>
      <StatsPanel />
    </div>
  );
}
