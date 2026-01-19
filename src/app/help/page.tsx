export const metadata = {
  title: "Help",
};

export const revalidate = 120;

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Help</h1>
        <p className="text-sm text-muted-foreground">
          Quick answers for getting the most out of Focus Timeout.
        </p>
      </div>
      <div className="grid gap-4 rounded-3xl border border-border bg-card/80 p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            How do I use Focus Timeout?
          </h2>
          <p className="text-sm text-muted-foreground">
            Set your focus duration and timeout length using the quick settings,
            then press Start. The timer will guide you through a focus phase
            followed by a timeout phase. Audio cues play at each transition.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            What are the repeat options?
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose &quot;Once&quot; for a single session, &quot;Loop&quot; for continuous cycles,
            or &quot;Custom&quot; to set a specific number of sessions.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Why does the timer stay accurate in the background?
          </h2>
          <p className="text-sm text-muted-foreground">
            The countdown is driven by timestamps, not tab-active intervals, so
            elapsed time stays precise when the browser goes idle.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Is my data synced anywhere?
          </h2>
          <p className="text-sm text-muted-foreground">
            No. All settings and statistics live only in your browser via
            localStorage.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            How do I install the app?
          </h2>
          <p className="text-sm text-muted-foreground">
            Open the browser menu and choose &quot;Install Focus Timeout&quot;. Once
            installed, it works fully offline.
          </p>
        </div>
      </div>
    </div>
  );
}
