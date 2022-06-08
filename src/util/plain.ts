import { dayjs } from "../deps.ts";

export async function delay(duration: number) {
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

/**
 * Convert `Date` object to datetime `string` in ISO8601 format, with UTC offset.
 */
export function toISOString(date?: Date) {
  // @ts-ignore `tz` is the timezone plugin of dayjs
  return dayjs(date).tz().format();
}

/**
 * Convert `Date` object to date `string` (without time).
 */
export function toDateString(date?: Date) {
  // @ts-ignore `tz` is the timezone plugin of dayjs
  return dayjs(date).tz().format("YYYY-MM-DD");
}
