import { ensureDir } from "../deps.ts";

export async function downloadImage(url: string, destinationDir: string) {
  const names = url.split("/");
  const fileName = names[names.length - 1];
  const res = await fetch(url);
  await ensureDir(destinationDir);
  Deno.writeFile(
    `${destinationDir}/${fileName}`,
    new Uint8Array(await res.arrayBuffer()),
  );
}
