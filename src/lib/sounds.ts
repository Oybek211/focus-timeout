export const defaultSoundOptions = [
  { label: "Soft Signal", value: "/sounds/focus-start.wav" },
  { label: "Bright Chime", value: "/sounds/focus-end.wav" },
  { label: "Calm Pulse", value: "/sounds/timeout-start.wav" },
  { label: "Deep Tap", value: "/sounds/timeout-end.wav" },
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
