export async function delay(duration: number) {
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

export function timeString(date: Date = new Date()) {
  return date.toISOString();
}
