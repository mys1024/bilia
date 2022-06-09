import { colors } from "../deps.ts";
import { toISOString } from "./plain.ts";

export function info(...data: unknown[]) {
  console.info(
    colors.gray(toISOString()),
    colors.white(colors.bgBlue(" INFO ")),
    ...data,
  );
}

export function warn(...data: unknown[]) {
  console.warn(
    colors.gray(toISOString()),
    colors.black(colors.bgYellow(" WARN ")),
    ...data,
  );
}

export function error(...data: unknown[]) {
  console.error(
    colors.gray(toISOString()),
    colors.white(colors.bgRed(" ERR  ")),
    ...data,
  );
}

export function log(...data: unknown[]) {
  console.log(
    colors.gray(toISOString()),
    colors.black(colors.bgWhite(" LOG  ")),
    ...data,
  );
}

export function infoWithoutTime(...data: unknown[]) {
  console.info(
    colors.white(colors.bgBlue(" INFO ")),
    ...data,
  );
}

export function warnWithoutTime(...data: unknown[]) {
  console.warn(
    colors.black(colors.bgYellow(" WARN ")),
    ...data,
  );
}

export function errorWithoutTime(...data: unknown[]) {
  console.error(
    colors.white(colors.bgRed(" ERR  ")),
    ...data,
  );
}

export function logWithoutTime(...data: unknown[]) {
  console.log(
    colors.black(colors.bgWhite(" LOG  ")),
    ...data,
  );
}
