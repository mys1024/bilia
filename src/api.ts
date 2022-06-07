import type { BiliJsonApiBody, BiliSpace } from "./types.ts";

export async function getSpace(uid: number, offset = "") {
  const host = "api.bilibili.com";
  const path = "/x/polymer/web-dynamic/v1/feed/space";
  const timezoneOffset = -480;
  const url =
    `https://${host}${path}?offset=${offset}&host_mid=${uid}&timezone_offset=${timezoneOffset}`;
  const res = await fetch(url);
  const body = await res.json() as BiliJsonApiBody;
  const space = body.data as BiliSpace;
  return space;
}
