import { fetchOptions } from "@src/storage";

(async () => {
  const host = window.location.host;
  const options = await fetchOptions();

  const ignoredHosts = options.ignoredHosts ?? [];
  if (ignoredHosts.includes(host)) {
    return;
  }

  const style = document.createElement("style");
  style.id = "squares-only-epic-92621";
  style.textContent = `* { border-radius: 0 !important; }`;
  document.head.append(style);
})();
