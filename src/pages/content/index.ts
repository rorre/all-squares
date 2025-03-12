import { fetchOptions, Options } from "@src/storage";
import { storage } from "webextension-polyfill";

let styleElem: HTMLStyleElement | null = null;

function writeOrUpdateStyle(radius: number) {
  if (styleElem == null) {
    styleElem = document.createElement("style");
    document.head.append(styleElem);
  }
  styleElem.id = "squares-only-epic-92621";
  styleElem.textContent = `* { border-radius: ${radius}px !important; }`;
}

(async () => {
  const host = window.location.host;
  const options = await fetchOptions();

  const ignoredHosts = options.ignoredHosts ?? [];
  if (ignoredHosts.includes(host)) {
    return;
  }

  writeOrUpdateStyle(options.radius);
})();

storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === "local" && changes.options) {
    const options = changes.options.newValue as Options;
    const ignoredHosts = options.ignoredHosts ?? [];
    const host = window.location.host;

    if (ignoredHosts.includes(host)) {
      styleElem?.remove();
      styleElem = null;
    } else {
      writeOrUpdateStyle(options.radius);
    }
  }
});
