import { colors } from "../deps.ts";
import { toISOString } from "./plain.ts";

export const info = (message: string) => {
  console.info(
    colors.gray(toISOString()),
    colors.white(colors.bgBlue(" INFO ")),
    message,
  );
};

export const warn = (message: string) => {
  console.warn(
    colors.gray(toISOString()),
    colors.black(colors.bgYellow(" WARN ")),
    message,
  );
};

export const error = (message: string) => {
  console.error(
    colors.gray(toISOString()),
    colors.white(colors.bgRed(" ERR  ")),
    message,
  );
};

export const log = (message: string) => {
  console.log(
    colors.gray(toISOString()),
    colors.black(colors.bgWhite(" LOG  ")),
    message,
  );
};
