export const defaultSoundOptions = [
  { label: "Ascending Chime", value: "/sounds/focus-start.wav" },
  { label: "Meditation Bowl", value: "/sounds/focus-end.wav" },
  { label: "Soft Pulse", value: "/sounds/timeout-start.wav" },
  { label: "Deep Gong", value: "/sounds/timeout-end.wav" },
  { label: "Simple Bell", value: "/sounds/bell.wav" },
  { label: "Soft Chime", value: "/sounds/soft-chime.wav" },
  { label: "Triple Ding", value: "/sounds/triple-ding.wav" },
  { label: "Zen Bowl", value: "/sounds/zen-bowl.wav" },
  { label: "None", value: "" },
];

export function getSoundOptions(customSounds: Record<string, string>) {
  const customOptions = Object.entries(customSounds).map(([name, value]) => ({
    label: name,
    value,
  }));
  return [...defaultSoundOptions, ...customOptions];
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
