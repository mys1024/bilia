import { Program } from "../deps.ts";
import { useListenCommand } from "./listen.ts";

export const program = new Program({
  name: "bilia",
  description: "A bilibili archiver",
  version: "0.9.6",
});

useListenCommand(program);
