import SettingsForm from "@/components/settings/settings-form";

export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-white/60">
          Tune your focus duration, timeout ratio, and audio cues.
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}
