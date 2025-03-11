(async () => {
  const host = window.location.host;
  let options;
  try {
    options = (await chrome.storage.local.get(["options"])).options ?? {};
  } catch (e) {
    options = {};
  }

  const ignoredHosts = options.ignoredHosts ?? [];
  if (ignoredHosts.includes(host)) {
    return;
  }

  const style = document.createElement("style");
  style.id = "squares-only-epic-92621";
  style.textContent = `* { border-radius: 0 !important; }`;
  document.head.append(style);
})();
