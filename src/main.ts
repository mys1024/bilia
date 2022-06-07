import type { CliOArgs, CliOptions } from "./types.ts";

import { datetime, flags } from "./deps.ts";
import output from "./util/output.ts";
import { getSpace } from "./api.ts";
import { archiveSpaceItem } from "./archiver.ts";

const parsedArgs = flags.parse(Deno.args);
if (parsedArgs._.length === 0) {
  actionHelp({}, []);
  Deno.exit();
}

const command = parsedArgs._[0];
const args = parsedArgs._.slice(1);

const options: CliOptions = {};
Object.assign(options, parsedArgs);
(options as Record<string, unknown>)["_"] = undefined;

if (command === "listen") {
  actionListen(options, args);
} else if (command === "help") {
  actionHelp(options, args);
} else {
  actionHelp(options, args);
}

function actionHelp(options: CliOptions, args: CliOArgs) {
  switch (args[0]) {
    case "help":
      actionHelpHelp(options, args);
      break;
    case "listen":
      actionHelpListen(options, args);
      break;
    default:
      console.log(`
bilia 0.9.0

A bilibili archiver.

Usage:
  bilia <command> [options] [arguments]
  bilia help <command>

Commands:
    help
    listen
        `);
  }
}

function actionHelpHelp(options: CliOptions, args: CliOArgs) {
  console.log(`
The helper of bilia.

Usage:
  bilia help [command]
  `);
}

function actionHelpListen(options: CliOptions, args: CliOArgs) {
  console.log(`
Listen to a bilibili user.

Usage:
  bilia listen <UID>

Options:
  -i, --interval      The interval (in seconds) of polling. (default: 600)
  -o, --output-dir    The output directory. (default: ./output)
  `);
}

function actionListen(options: CliOptions, args: CliOArgs) {
  // get and check options, args
  if (args.length != 1) {
    actionHelpListen(options, args);
    return;
  }
  const uid = args[0];
  if (typeof uid !== "number") {
    actionHelpListen(options, args);
    return;
  }
  const interval = options["interval"] ?? options["i"] ?? 600;
  if (typeof interval !== "number") {
    actionHelpListen(options, args);
    return;
  }
  const outputDir = options["output-dir"] ?? options["o"] ??
    "./output";
  if (typeof outputDir === "boolean") {
    actionHelpListen(options, args);
    return;
  }

  // log
  output.info(`Listening to UID: ${uid}`);

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
      const date = new Date(spaceItem.modules.module_author.pub_ts * 1000);
      const dateStr = datetime.format(date, "yyyy-MM-dd");
      output.log(`Archiving ${spaceItem.id_str} (${dateStr})`);
      archiveSpaceItem(String(outputDir), spaceItem);
    }
    latestSpaceItemId = space.items[0].id_str;
  };
  pollSpace();
  setInterval(pollSpace, interval * 1000);
}
