(function () {
  const VALID = new Set(["investment", "supervision", "safety"]);
  const DEFAULT_MODULE = "safety";

  const tabs = Array.from(document.querySelectorAll(".nav-tab"));
  const roleSwitch = document.querySelector("[data-role-switch]");
  const roleBtns = Array.from(document.querySelectorAll(".role-btn"));
  const panes = {
    investment: document.querySelector('[data-pane="investment"]'),
    supervision: document.querySelector('[data-pane="supervision"]'),
    safety: document.querySelector('[data-pane="safety"]'),
  };
  let supervisionRole = "office";

  function currentHash() {
    const raw = (location.hash || "").replace(/^#/, "").trim();
    return VALID.has(raw) ? raw : DEFAULT_MODULE;
  }

  function setActiveTab(module) {
    tabs.forEach((tab) => {
      const on = tab.dataset.module === module;
      tab.classList.toggle("is-active", on);
      if (on) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    });
  }

  function setRoleSwitch(role) {
    supervisionRole = role === "leader" ? "leader" : "office";
    roleBtns.forEach((btn) => {
      btn.classList.toggle("is-on", btn.dataset.role === supervisionRole);
    });
  }

  function applySupervisionRole(role) {
    setRoleSwitch(role);
    const pane = panes.supervision;
    const iframe = pane && pane.querySelector("iframe");
    if (!iframe) return;

    const nextHash = "#" + supervisionRole;
    if (pane.dataset.bootstrapped === "1") {
      try {
        const loc = iframe.contentWindow.location;
        if (loc.hash !== nextHash) loc.hash = supervisionRole;
      } catch (err) {
        iframe.src = "../meeting-supervision-demo/index.html?embed=1" + nextHash;
      }
      return;
    }
    iframe.dataset.src = "../meeting-supervision-demo/index.html?embed=1" + nextHash;
  }

  function ensureIframe(pane) {
    if (!pane || pane.dataset.bootstrapped === "1") return;
    const iframe = pane.querySelector("iframe");
    let src = iframe && iframe.dataset.src;
    if (!iframe || !src) return;

    if (pane.dataset.pane === "supervision") {
      src = "../meeting-supervision-demo/index.html?embed=1#" + supervisionRole;
      iframe.dataset.src = src;
    }

    pane.dataset.bootstrapped = "1";
    iframe.addEventListener(
      "load",
      () => {
        pane.classList.add("is-loaded");
      },
      { once: true }
    );
    iframe.src = src;
  }

  function showPane(module) {
    Object.entries(panes).forEach(([key, pane]) => {
      if (!pane) return;
      const on = key === module;
      pane.classList.toggle("is-on", on);
      pane.hidden = !on;
      if (on) ensureIframe(pane);
    });
  }

  function activate(module, { pushHash = true } = {}) {
    setActiveTab(module);
    showPane(module);
    if (roleSwitch) roleSwitch.hidden = module !== "supervision";
    if (pushHash && location.hash.replace(/^#/, "") !== module) {
      location.hash = module;
    }
  }

  roleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      applySupervisionRole(btn.dataset.role);
    });
  });

  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.type !== "supervision-role") return;
    if (data.role === "office" || data.role === "leader") setRoleSwitch(data.role);
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const module = tab.dataset.module;
      if (!VALID.has(module)) return;
      activate(module);
    });
  });

  window.addEventListener("hashchange", () => {
    activate(currentHash(), { pushHash: false });
  });

  activate(currentHash(), { pushHash: !location.hash });
})();
