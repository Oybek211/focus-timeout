import TimerCard from "@/components/timer/timer-card";
import QuickStats from "@/components/timer/quick-stats";

export default function Home() {
  return (
    <div className="grid gap-8">
      <section className="grid gap-6 md:grid-cols-[1.4fr_0.9fr]">
        <TimerCard />
        <QuickStats />
      </section>
    </div>
  );
}
