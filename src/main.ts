import { Program } from "./deps.ts";
import { error, info } from "./util/output.ts";
import { getSpace } from "./api.ts";
import { archiveSpaceItem } from "./archiver.ts";

const program = new Program({
  name: "bilia",
  description: "A bilibili archiver",
  version: "0.9.2",
});

program
  .command({
    name: "listen",
    description: "Listen to a bilibili user",
    fn: (args) => {
      // get and check options
      const interval = args["interval"] ?? 600;
      if (typeof interval !== "number") {
        error(`Option 'interval' should be a number\n`, false);
        program.commands["listen"].help();
        return;
      }
      const outputDir = args["output-dir"] ?? "./output";
      if (typeof outputDir !== "string") {
        error(`Option 'output-dir' should be a string\n`, false);
        program.commands["listen"].help();
        return;
      }
      if (args._.length != 1) {
        error(`Too many arguments\n`, false);
        program.commands["listen"].help();
        return;
      }
      // get and check arguments
      const uid = args._[0];
      if (typeof uid !== "number") {
        error(`Argument 'UID' should be a number\n`, false);
        program.commands["listen"].help();
        return;
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
          archiveSpaceItem(String(outputDir), spaceItem);
        }
        latestSpaceItemId = space.items[0].id_str;
      };
      pollSpace();
      setInterval(pollSpace, interval * 1000);
    },
  })
  .option({
    name: "help",
    alias: "h",
    description: "Prints help information",
  })
  .option({
    name: "interval",
    alias: "i",
    description: "The interval (in seconds) of polling",
  })
  .option({
    name: "output-dir",
    alias: "o",
    description: "The output directory",
  })
  .argument({
    name: "UID",
    description: "The UID of bilibili user",
  });

program.parse(Deno.args);
