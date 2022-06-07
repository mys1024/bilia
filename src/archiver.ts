import type { BiliSpaceItem } from "./types.ts";

import { datetime, fs } from "./deps.ts";

export async function archiveSpaceItem(
  outputDirPath: string,
  spaceItem: BiliSpaceItem,
) {
  const dynamicId = spaceItem.id_str;
  const uid = spaceItem.modules.module_author.mid;
  const date = new Date(spaceItem.modules.module_author.pub_ts * 1000);
  const dateStr = datetime.format(date, "yyyy-MM-dd");
  const dynamicDirPath =
    `${outputDirPath}/${uid}/dynamic/${dateStr} ${dynamicId}`;
  // write
  await fs.ensureDir(dynamicDirPath);
  await Deno.writeTextFile(
    `${dynamicDirPath}/raw.json`,
    JSON.stringify(spaceItem, undefined, 2),
  );
}
