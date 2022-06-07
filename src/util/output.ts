import { colors } from "../deps.ts";
import { timeString } from "./normal.ts";

export const info = (message: string) => {
  console.info(
    colors.gray(timeString()),
    colors.white(colors.bgBlue(" INFO ")),
    message,
  );
};

export const warn = (message: string) => {
  console.warn(
    colors.gray(timeString()),
    colors.black(colors.bgYellow(" WARN ")),
    message,
  );
};

export const error = (message: string) => {
  console.error(
    colors.gray(timeString()),
    colors.white(colors.bgRed(" ERR  ")),
    message,
  );
};

export const log = (message: string) => {
  console.log(
    colors.gray(timeString()),
    colors.black(colors.bgWhite(" LOG  ")),
    message,
  );
};

const output = {
  info,
  warn,
  error,
  log,
};

export default output;
