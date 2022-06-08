import type { BiliSpaceItem } from "../types/bili.ts";

import { ensureDir } from "../deps.ts";
import { downloadImage } from "./net.ts";
import { toDateString } from "./plain.ts";
import { log } from "./output.ts";

export async function archiveSpaceItem(
  outputDirPath: string,
  spaceItem: BiliSpaceItem,
) {
  const dynamicId = spaceItem.id_str;
  const dynamicType = spaceItem.type;
  const uid = spaceItem.modules.module_author.mid;
  const date = new Date(spaceItem.modules.module_author.pub_ts * 1000);
  const dynamicDirPath = `${outputDirPath}/${uid}/dynamic/${
    toDateString(date)
  } ${dynamicId} ${dynamicType}`;

  // log
  log(
    `Archiving ${spaceItem.id_str}, type: ${spaceItem.type}`,
  );

  // archive raw json
  await ensureDir(dynamicDirPath);
  await Deno.writeTextFile(
    `${dynamicDirPath}/raw.json`,
    JSON.stringify(spaceItem, undefined, 2),
  );

  // special archiving
  switch (spaceItem.type) {
    case "DYNAMIC_TYPE_DRAW": {
      // archive dynamic's desc
      const text = spaceItem.modules.module_dynamic.desc?.text;
      if (text) {
        await Deno.writeTextFile(`${dynamicDirPath}/desc.txt`, text);
      }
      // archive dynamic's major
      const majorDraw = spaceItem.modules.module_dynamic.major?.draw;
      if (!majorDraw) {
        break;
      }
      for (const item of majorDraw.items) {
        downloadImage(item.src, `${dynamicDirPath}/major/draw`);
      }
      break;
    }
    case "DYNAMIC_TYPE_FORWARD": {
      // archive dynamic's desc
      const text = spaceItem.modules.module_dynamic.desc?.text;
      if (text) {
        await Deno.writeTextFile(`${dynamicDirPath}/desc.txt`, text);
      }
    }
  }
}
