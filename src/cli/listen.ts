import type { Program } from "../deps.ts";
import type { CommandArgs } from "../types/plain.ts";

import { dayjs, ensureFile } from "../deps.ts";
import { error, errorWithoutTime, info, log } from "../util/output.ts";
import { getSpace } from "../util/net.ts";
import { archiveSpaceItem } from "../util/archive.ts";

export function useListenCommand(program: Program) {
  return program
    .command({
      name: "listen",
      description: "Listen to a bilibili user",
      fn: (args) => action(program, args),
    })
    .option({
      name: "help",
      alias: "h",
      description: "Prints help information",
    })
    .option({
      name: "interval",
      alias: "i",
      description: "Interval (in seconds) of polling (default: 600)",
    })
    .option({
      name: "output-dir",
      alias: "o",
      description: `Output directory (default: "./output")`,
    })
    .option({
      name: "timezone",
      alias: "t",
      description:
        `Timezone name, such as "Asia/Shanghai" (default: your local timezone)`,
    })
    .argument({
      name: "UID",
      description: "The UID of bilibili user",
    });
}

async function action(program: Program, args: CommandArgs) {
  // get and check options
  const interval = args["interval"] ?? 600;
  if (typeof interval !== "number") {
    errorWithoutTime(`Option "interval" should be a number\n`);
    program.commands["listen"].help();
    return;
  }
  const outputDir = args["output-dir"] ?? "./output";
  if (typeof outputDir !== "string") {
    errorWithoutTime(`Option "output-dir" should be a string\n`);
    program.commands["listen"].help();
    return;
  }
  const timezone = args["timezone"];
  if (typeof timezone !== "undefined" && typeof timezone !== "string") {
    errorWithoutTime(`Option "timezone" should be a string\n`);
    program.commands["listen"].help();
    return;
  }

  // get and check arguments
  if (args._.length != 1) {
    errorWithoutTime(`Too many arguments\n`);
    program.commands["listen"].help();
    return;
  }
  const uid = args._[0];
  if (typeof uid !== "number") {
    errorWithoutTime(`Argument "UID" should be a number\n`);
    program.commands["listen"].help();
    return;
  }

  // set dayjs default timezone
  if (timezone) {
    // @ts-ignore `tz` is the timezone plugin of dayjs
    dayjs.tz.setDefault(timezone);
  }

  // log
  info(`Listening to UID: ${uid}`);

  // default metadata
  const metadata = {
    latestTimestamp: Date.now(),
  };

  // try to recover metadata from `meta.json`
  const metadataFilePath = `${outputDir}/${uid}/meta.json`;
  try {
    await ensureFile(metadataFilePath);
    const metadataStr = await Deno.readTextFile(metadataFilePath);
    if (metadataStr) {
      log(`Read metadata file "${metadataFilePath}"`);
      Object.assign(metadata, JSON.parse(metadataStr));
    }
  } catch (err) {
    error(`Fail to read metadata file "${metadataFilePath}":`, err);
    Deno.exit();
  }

  // start polling
  const pollSpace = async () => {
    // get space data
    const space = await getSpace(uid)
      .catch((err) => {
        error("Fail to get bilibili space data:", err);
      });
    if (!space) {
      return;
    }
    // handle the case of no space item
    const spaceItems = space.items;
    if (spaceItems.length === 0) {
      return;
    }
    // sort space items by timestamp
    spaceItems.sort((a, b) =>
      b.modules.module_author.pub_ts - a.modules.module_author.pub_ts
    );
    // archive space items
    for (const spaceItem of spaceItems) {
      const timestamp = spaceItem.modules.module_author.pub_ts * 1000;
      if (timestamp <= metadata.latestTimestamp) {
        break;
      }
      try {
        await archiveSpaceItem(outputDir, spaceItem);
      } catch (err) {
        error(`Fail to archive bilibili space item ${spaceItem.id_str}:`, err);
      }
    }
    // update metadata
    let metadataUpdated = false;
    const firstItem = spaceItems[0];
    const firstTimestamp = firstItem.modules.module_author.pub_ts * 1000;
    if (firstTimestamp > metadata.latestTimestamp) {
      metadata.latestTimestamp = firstTimestamp;
      metadataUpdated = true;
    }
    // save metadata file
    if (metadataUpdated) {
      try {
        await Deno.writeTextFile(
          metadataFilePath,
          JSON.stringify(metadata, undefined, 2),
        );
      } catch (err) {
        error(`Fail to save metadata file "${metadataFilePath}":`, err);
      }
    }
  };
  pollSpace();
  setInterval(pollSpace, interval * 1000);
}
