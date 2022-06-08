import type { Program } from "../deps.ts";
import type { Args } from "./types.ts";

import { dayjs } from "../deps.ts";
import { error, info } from "../util/output.ts";
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

function action(program: Program, args: Args) {
  // get and check options
  const interval = args["interval"] ?? 600;
  if (typeof interval !== "number") {
    error(`Option "interval" should be a number\n`, false);
    program.commands["listen"].help();
    return;
  }
  const outputDir = args["output-dir"] ?? "./output";
  if (typeof outputDir !== "string") {
    error(`Option "output-dir" should be a string\n`, false);
    program.commands["listen"].help();
    return;
  }
  const timezone = args["timezone"];
  if (typeof timezone !== "undefined" && typeof timezone !== "string") {
    error(`Option "timezone" should be a string\n`, false);
    program.commands["listen"].help();
    return;
  }

  // get and check arguments
  if (args._.length != 1) {
    error(`Too many arguments\n`, false);
    program.commands["listen"].help();
    return;
  }
  const uid = args._[0];
  if (typeof uid !== "number") {
    error(`Argument "UID" should be a number\n`, false);
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

  // start polling
  let latestSpaceItemId = "";
  const pollSpace = async () => {
    const space = await getSpace(uid);
    const spaceItems = space.items;
    if (spaceItems.length === 0) {
      return;
    }
    spaceItems.sort((a, b) =>
      b.modules.module_author.pub_ts - a.modules.module_author.pub_ts
    );
    for (const spaceItem of spaceItems) {
      if (spaceItem.id_str === latestSpaceItemId) {
        break;
      }
      archiveSpaceItem(outputDir, spaceItem);
    }
    latestSpaceItemId = space.items[0].id_str;
  };
  pollSpace();
  setInterval(pollSpace, interval * 1000);
}
