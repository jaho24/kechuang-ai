/* 安全生产 Demo · 本地统一库（模拟入库，非真实数据库） */
(function (global) {
  const KEY = "pm_safety_demo_v1";
  const SAFETY = { A: "吴安", B: "黄安", C: "马安", D: "刘安全", E: "周安" };

  function empty() {
    return { extras: [], closedIds: [] };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return empty();
      const s = JSON.parse(raw);
      if (!s || !Array.isArray(s.extras)) return empty();
      return { extras: s.extras, closedIds: Array.isArray(s.closedIds) ? s.closedIds : [] };
    } catch (e) {
      return empty();
    }
  }

  function save(s) {
    localStorage.setItem(KEY, JSON.stringify(s));
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function nowStr() {
    const d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
      " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  function nextId() {
    const d = new Date();
    return "YH-" + d.getFullYear() + "-" + pad(d.getMonth() + 1) + pad(d.getDate()) +
      pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()).slice(-2);
  }

  function dueStatus(due, level) {
    if (!due) return "待整改";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(due + "T00:00:00");
    const days = Math.round((end - today) / 86400000);
    if (days < 0) return "逾期";
    if (days <= 3) return "临期";
    return "待整改";
  }

  function addFromForm(form) {
    const project = form.project.value;
    const type = form.type.value;
    const level = form.level.value === "重大隐患" ? "重大" : "一般";
    const owner = (form.owner.value || "张安全").trim();
    const due = form.due.value;
    const loc = (form.loc.value || "现场待补充").trim();
    const desc = (form.desc.value || "（未填写描述）").trim();
    const status = dueStatus(due, level);
    const id = nextId();
    const when = nowStr();
    const timeline = [{ when: when, what: "手工填报入库（Demo 本地库），项目信息表锚定 " + project }];
    if (level === "重大") {
      timeline.push({ when: when, what: "重大隐患即时预警已模拟推送集团分管领导王建国" });
    } else if (status === "临期") {
      timeline.push({ when: when, what: "距整改时限不足 3 天，已模拟提醒整改责任人" + owner });
    } else if (status === "逾期") {
      timeline.push({ when: when, what: "已逾期，模拟升级项目安全负责人" + (SAFETY[project] || "") });
    }
    const row = {
      id: id,
      project: project,
      type: type,
      level: level,
      status: status,
      owner: owner,
      safety: SAFETY[project] || "项目安全负责人",
      leader: "王建国",
      due: due || "未设",
      loc: loc,
      desc: desc,
      fromReport: true,
      timeline: timeline,
    };
    const s = load();
    s.extras.unshift(row);
    save(s);
    return row;
  }

  function closeHazard(id) {
    const s = load();
    if (s.closedIds.indexOf(id) < 0) s.closedIds.push(id);
    s.extras.forEach(function (e) {
      if (e.id === id) {
        e.status = "已闭环";
        e.timeline = (e.timeline || []).concat([{ when: nowStr(), what: "整改完成，录入闭环" }]);
      }
    });
    save(s);
  }

  function latestExtra() {
    const s = load();
    return s.extras[0] || null;
  }

  global.PMSafetyStore = {
    load: load,
    addFromForm: addFromForm,
    closeHazard: closeHazard,
    latestExtra: latestExtra,
    SAFETY: SAFETY,
  };
})(window);
