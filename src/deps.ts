export * as colors from "https://deno.land/std@0.142.0/fmt/colors.ts";

export { ensureDir, ensureFile } from "https://deno.land/std@0.142.0/fs/mod.ts";

export { Program } from "https://deno.land/x/program@0.1.6/mod.ts";

import _dayjs from "https://esm.sh/dayjs@1.11.3";
import utc from "https://esm.sh/dayjs@1.11.3/plugin/utc.js";
import timezone from "https://esm.sh/dayjs@1.11.3/plugin/timezone.js";
_dayjs.extend(utc);
_dayjs.extend(timezone);
export const dayjs = _dayjs;
