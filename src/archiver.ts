import type { BiliSpaceItem } from "./types.ts";

import { datetime, fs } from "./deps.ts";
import { saveImg } from "./util/normal.ts";

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

  // only archive "DYNAMIC_TYPE_DRAW"
  switch (spaceItem.type) {
    case "DYNAMIC_TYPE_DRAW": {
      // save raw json
      await fs.ensureDir(dynamicDirPath);
      await Deno.writeTextFile(
        `${dynamicDirPath}/raw.json`,
        JSON.stringify(spaceItem, undefined, 2),
      );
      // save dynamic's desc
      const text = spaceItem.modules.module_dynamic.desc?.text;
      if (text) {
        await Deno.writeTextFile(`${dynamicDirPath}/desc.txt`, text);
      }
      // save dynamic's major
      const majorDraw = spaceItem.modules.module_dynamic.major?.draw;
      if (!majorDraw) {
        break;
      }
      for (const item of majorDraw.items) {
        saveImg(item.src, `${dynamicDirPath}/majorDraw`);
      }
      break;
    }
  }
}
