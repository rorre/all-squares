export interface Options {
  ignoredHosts: string[];
}

export async function fetchOptions() {
  let options;
  try {
    options = (await chrome.storage.local.get(["options"])).options ?? {};
  } catch (e) {
    options = {};
  }

  if (options.ignoredHosts === undefined) {
    options.ignoredHosts = [];
    await chrome.storage.local.set({ options });
  }

  return options as Options;
}
