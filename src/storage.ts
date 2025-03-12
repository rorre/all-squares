import { storage } from "webextension-polyfill";

export interface Options {
  ignoredHosts: string[];
  radius: number;
}

export async function fetchOptions() {
  let options: Partial<Options>;
  try {
    options = (await storage.local.get(["options"])).options ?? {};
  } catch (e) {
    options = {};
  }

  if (options.ignoredHosts === undefined) {
    options.ignoredHosts = [];
    await storage.local.set({ options });
  }

  if (options.radius === undefined) {
    options.radius = 0;
    await storage.local.set({ options });
  }

  return options as Options;
}
