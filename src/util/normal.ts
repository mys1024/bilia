import { fs } from "../deps.ts";

export async function delay(duration: number) {
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

export function timeString(date: Date = new Date()) {
  return date.toISOString();
}

export async function saveImg(url: string, destinationDir: string) {
  const names = url.split("/");
  const fileName = names[names.length - 1];
  const res = await fetch(url);
  await fs.ensureDir(destinationDir);
  Deno.writeFile(
    `${destinationDir}/${fileName}`,
    new Uint8Array(await res.arrayBuffer()),
  );
}
