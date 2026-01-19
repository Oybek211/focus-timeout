export const metadata = {
  title: "About",
};

export const revalidate = 120;

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">About</h1>
        <p className="text-sm text-muted-foreground">
          Lock in focus, then earn your timeout.
        </p>
      </div>
      <div className="grid gap-4 rounded-3xl border border-border bg-card/80 p-6">
        <p className="text-sm text-muted-foreground">
          Focus Timeout balances deep work with intentional recovery. Set your
          rhythm, start the timer, and stay in flow with offline-ready audio
          cues.
        </p>
        <p className="text-sm text-muted-foreground">
          Configure a focus duration, choose a timeout percentage, and let the
          timer guide you through a complete session. Every session completion
          updates local statistics so you can track your rhythm over time.
        </p>
        <p className="text-sm text-muted-foreground">
          Built as a progressive web app, Focus Timeout stays fast, installable,
          and fully offline after the first visit.
        </p>
      </div>
    </div>
  );
}
