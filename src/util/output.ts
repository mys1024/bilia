import { colors } from "../deps.ts";
import { toISOString } from "./plain.ts";

export function info(message: string, time = true) {
  if (time) {
    console.info(
      colors.gray(toISOString()),
      colors.white(colors.bgBlue(" INFO ")),
      message,
    );
  } else {
    console.info(
      colors.white(colors.bgBlue(" INFO ")),
      message,
    );
  }
}

export function warn(message: string, time = true) {
  if (time) {
    console.warn(
      colors.gray(toISOString()),
      colors.black(colors.bgYellow(" WARN ")),
      message,
    );
  } else {
    console.warn(
      colors.black(colors.bgYellow(" WARN ")),
      message,
    );
  }
}

export function error(message: string, time = true) {
  if (time) {
    console.error(
      colors.gray(toISOString()),
      colors.white(colors.bgRed(" ERR  ")),
      message,
    );
  } else {
    console.error(
      colors.white(colors.bgRed(" ERR  ")),
      message,
    );
  }
}

export function log(message: string, time = true) {
  if (time) {
    console.log(
      colors.gray(toISOString()),
      colors.black(colors.bgWhite(" LOG  ")),
      message,
    );
  } else {
    console.log(
      colors.black(colors.bgWhite(" LOG  ")),
      message,
    );
  }
}
