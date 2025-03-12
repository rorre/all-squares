import { fetchOptions } from "@src/storage";
import { useEffect, useState } from "react";

async function currentTabHost() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs[0].url) return "";
  return new URL(tabs[0].url).host;
}

export default function Popup() {
  const [initialValue, setInitialValue] = useState<boolean | null>(null);
  const [isIgnored, setIsIgnored] = useState(false);

  async function onStorageChange(
    changes: { [key: string]: chrome.storage.StorageChange },
    namespace: string
  ) {
    if (namespace === "local" && changes.options) {
      const options = changes.options.newValue;
      const ignoredHosts = options.ignoredHosts ?? [];
      const currentHost = await currentTabHost();

      setIsIgnored(ignoredHosts.includes(currentHost));
    }
  }

  useEffect(() => {
    chrome.storage.onChanged.addListener(onStorageChange);

    async function init() {
      const options = await fetchOptions();
      const ignoredHosts = options.ignoredHosts;
      const currentHost = await currentTabHost();

      const isIgnored = ignoredHosts.includes(currentHost);
      setIsIgnored(isIgnored);
      setInitialValue(isIgnored);
    }

    init();
    return () => chrome.storage.onChanged.removeListener(onStorageChange);
  }, []);

  async function toggleIgnore() {
    const currentHost = await currentTabHost();
    const options = await fetchOptions();

    const ignoredHosts: string[] = options.ignoredHosts ?? [];
    const newIgnoredHosts = ignoredHosts.includes(currentHost)
      ? ignoredHosts.filter((host) => host !== currentHost)
      : [...ignoredHosts, currentHost];

    chrome.storage.local.set({
      options: {
        ...options,
        ignoredHosts: newIgnoredHosts,
      },
    });
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 p-3 bg-gray-800">
      <header className="flex flex-col justify-center text-white gap-4">
        <h1 className="text-xl font-bold">All Squares ⬛ ⬜</h1>
        <p>Running: {isIgnored ? "❌" : "✔"}</p>

        <button
          className="px-1.5 py-1 bg-blue-500 text-white rounded hover:cursor-pointer"
          onClick={toggleIgnore}
        >
          {isIgnored ? "Enable" : "Disable"} for this site
        </button>

        {initialValue !== null && isIgnored !== initialValue && (
          <>
            <hr />
            <p className="text-sm text-gray-400">
              Reload the page to see changes.
            </p>
            <button
              className="-mt-2 px-1.5 py-1 bg-blue-500 text-white rounded hover:cursor-pointer"
              onClick={() => chrome.tabs.reload()}
            >
              Reload page
            </button>
          </>
        )}
      </header>
    </div>
  );
}
