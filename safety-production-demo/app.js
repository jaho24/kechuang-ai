/* 安全生产看板 · ECharts 科技蓝 + 下钻 / 月报 / 问答 */
(function () {
  const PALETTE = ["#2f7de1", "#f08a24", "#e23d3d", "#1aa6b8", "#2ba471"];
  const PIE = [
    { name: "防尘", key: "dust", value: 28 },
    { name: "高温", key: "heat", value: 22 },
    { name: "消防", key: "fire", value: 18 },
    { name: "防汛", key: "flood", value: 17 },
    { name: "复工复产", key: "resume", value: 15 },
  ];
  const PROJECTS = [
    { id: "A", name: "项目A", full: "港区仓储一期", rate: 98.2, total: 218, monthNew: 12, status: "normal", color: "#2f7de1", value: [113.84, 34.53] },
    { id: "B", name: "项目B", full: "物流枢纽扩建", rate: 96.5, total: 252, monthNew: 18, status: "general", color: "#1aa6b8", value: [113.96, 34.62] },
    { id: "C", name: "项目C", full: "智能制造厂房", rate: 93.1, total: 268, monthNew: 22, status: "overdue", color: "#f08a24", value: [114.08, 34.48] },
    { id: "D", name: "项目D", full: "配套市政工程", rate: 89.4, total: 274, monthNew: 15, status: "major", color: "#e23d3d", value: [113.72, 34.40] },
    { id: "E", name: "项目E", full: "综合办公楼", rate: 86.3, total: 274, monthNew: 19, status: "overdue", color: "#f08a24", value: [113.88, 34.70] },
  ];
  const STATUS_MAP = { normal: "正常", general: "一般隐患", overdue: "逾期隐患", major: "重大隐患" };
  const SEED_HAZARDS = [
    { id: "YH-2026-0801", project: "D", type: "防汛", level: "重大", status: "待整改", owner: "赵强", safety: "刘安全", leader: "王建国", due: "2026-08-20", loc: "基坑降水井 #3", desc: "基坑降水系统备用泵未就位，汛期存在淹槽风险。", timeline: [
      { when: "2026-08-12 09:20", what: "巡检发现并填报，判定重大隐患，即时预警已推送集团分管领导" },
      { when: "2026-08-12 09:22", what: "升级：王建国（集团分管领导）已签收" },
    ]},
    { id: "YH-2026-0806", project: "D", type: "消防", level: "重大", status: "临期", owner: "陈涛", safety: "刘安全", leader: "王建国", due: "2026-08-21", loc: "临建区配电房", desc: "临时用电未做等电位联结，消防验收资料缺失。", timeline: [
      { when: "2026-08-08 14:00", what: "填报入库，设定整改时限 8 月 21 日" },
      { when: "2026-08-18 08:00", what: "到期前 3 天，已提醒整改责任人陈涛" },
    ]},
    { id: "YH-2026-0744", project: "E", type: "消防", level: "一般", status: "逾期", owner: "李工", safety: "周安", leader: "王建国", due: "2026-08-10", loc: "地下车库消防通道", desc: "消防通道被材料占用，应急车辆无法通过。", timeline: [
      { when: "2026-07-28 10:10", what: "填报，责任人李工，时限 8 月 10 日" },
      { when: "2026-08-07 09:00", what: "临期提醒已推送整改责任人" },
      { when: "2026-08-10 18:00", what: "逾期，升级项目安全负责人周安" },
      { when: "2026-08-13 09:00", what: "仍未闭环，升级集团分管领导王建国" },
    ]},
    { id: "YH-2026-0752", project: "E", type: "高温", level: "一般", status: "逾期", owner: "吴磊", safety: "周安", leader: "王建国", due: "2026-08-09", loc: "屋面钢构作业面", desc: "高温时段未落实轮换休息与防暑药品。", timeline: [
      { when: "2026-08-09 18:00", what: "逾期，已升级项目安全负责人" },
    ]},
    { id: "YH-2026-0811", project: "C", type: "防尘", level: "一般", status: "临期", owner: "孙敏", safety: "马安", leader: "王建国", due: "2026-08-21", loc: "土方运输便道", desc: "出门冲洗装置故障，扬尘超标。", timeline: [
      { when: "2026-08-18 08:00", what: "到期前提醒已推送孙敏" },
    ]},
    { id: "YH-2026-0815", project: "C", type: "防汛", level: "一般", status: "逾期", owner: "钱峰", safety: "马安", leader: "王建国", due: "2026-08-12", loc: "场地排水沟", desc: "排水沟淤堵，暴雨后积水倒灌临建。", timeline: [
      { when: "2026-08-12 18:00", what: "逾期升级项目安全负责人马安" },
    ]},
    { id: "YH-2026-0820", project: "B", type: "复工复产", level: "一般", status: "待整改", owner: "郑洁", safety: "黄安", leader: "王建国", due: "2026-08-25", loc: "2# 仓库", desc: "停工后特种设备未复检即准备复工。", timeline: [
      { when: "2026-08-16 11:00", what: "填报入库，跟踪中" },
    ]},
    { id: "YH-2026-0702", project: "A", type: "防尘", level: "一般", status: "已闭环", owner: "周平", safety: "吴安", leader: "王建国", due: "2026-08-05", loc: "砂石堆场", desc: "裸土未覆盖，已完成密目网全覆盖并验收。", timeline: [
      { when: "2026-08-04 16:40", what: "整改完成，录入闭环" },
    ]},
    { id: "YH-2026-0818", project: "D", type: "防汛", level: "重大", status: "待整改", owner: "赵强", safety: "刘安全", leader: "王建国", due: "2026-08-22", loc: "边坡监测点", desc: "边坡位移预警值接近阈值，监测频次不足。", timeline: [
      { when: "2026-08-17 07:50", what: "重大隐患即时预警已推送" },
    ]},
  ];
  const PROJECT_BASE = PROJECTS.map(function (p) {
    return { id: p.id, total: p.total, monthNew: p.monthNew, rate: p.rate, closed: Math.round(p.total * p.rate / 100) };
  });
  const BASE_KPI = { total: 1286, closed: 1217, overdue: 18, major: 3, monthNew: 86 };
  const PIE_COUNTS = { 防尘: 360, 高温: 283, 消防: 231, 防汛: 219, 复工复产: 193 };
  const PENDING_BASE = { 防尘: 42, 高温: 35, 消防: 28, 防汛: 31, 复工复产: 22 };
  let PENDING_LIVE = [];
  let HAZARDS = [];
  let STATS = { total: 1286, rate: 94.6, overdue: 18, major: 3, monthNew: 86 };
  let PIE_LIVE = PIE.slice();

  function applyLive() {
    const s = (window.PMSafetyStore && PMSafetyStore.load()) || { extras: [], closedIds: [] };
    HAZARDS = JSON.parse(JSON.stringify(s.extras || [])).concat(JSON.parse(JSON.stringify(SEED_HAZARDS)));
    HAZARDS.forEach(function (h) {
      if (s.closedIds.indexOf(h.id) >= 0) h.status = "已闭环";
    });
    PROJECTS.forEach(function (p) {
      const b = PROJECT_BASE.find(function (x) { return x.id === p.id; });
      p.total = b.total;
      p.monthNew = b.monthNew;
      p.closed = b.closed;
    });
    (s.extras || []).forEach(function (e) {
      const p = projectById(e.project);
      if (!p) return;
      p.total += 1;
      p.monthNew += 1;
      const closed = e.status === "已闭环" || s.closedIds.indexOf(e.id) >= 0;
      if (closed) p.closed += 1;
    });
    PROJECTS.forEach(function (p) {
      p.rate = +(p.closed / p.total * 100).toFixed(1);
    });
    const extraN = (s.extras || []).length;
    const extraClosed = (s.extras || []).filter(function (e) {
      return e.status === "已闭环" || s.closedIds.indexOf(e.id) >= 0;
    }).length;
    const seedClosedExtra = SEED_HAZARDS.filter(function (h) {
      return h.status !== "已闭环" && s.closedIds.indexOf(h.id) >= 0;
    }).length;
    const extraOpenMajor = HAZARDS.filter(function (h) {
      return h.fromReport && h.level === "重大" && h.status !== "已闭环";
    }).length;
    const extraOverdue = (s.extras || []).filter(function (e) {
      const st = s.closedIds.indexOf(e.id) >= 0 ? "已闭环" : e.status;
      return st === "逾期";
    }).length;
    const seedOverdueClosed = SEED_HAZARDS.filter(function (h) {
      return h.status === "逾期" && s.closedIds.indexOf(h.id) >= 0;
    }).length;
    STATS.total = BASE_KPI.total + extraN;
    STATS.monthNew = BASE_KPI.monthNew + extraN;
    STATS.closed = BASE_KPI.closed + extraClosed + seedClosedExtra;
    STATS.overdue = BASE_KPI.overdue + extraOverdue - seedOverdueClosed;
    STATS.major = BASE_KPI.major + extraOpenMajor - SEED_HAZARDS.filter(function (h) {
      return h.level === "重大" && h.status !== "已闭环" && s.closedIds.indexOf(h.id) >= 0;
    }).length;
    STATS.rate = +(STATS.closed / STATS.total * 100).toFixed(1);

    const counts = Object.assign({}, PIE_COUNTS);
    (s.extras || []).forEach(function (e) {
      if (counts[e.type] != null) counts[e.type] += 1;
    });
    PIE_LIVE = PIE.map(function (d) {
      return { name: d.name, key: d.key, value: +(counts[d.name] / STATS.total * 100).toFixed(1) };
    });

    const pend = Object.assign({}, PENDING_BASE);
    (HAZARDS || []).forEach(function (h) {
      if (h.status === "已闭环") return;
      if (pend[h.type] != null) pend[h.type] = (pend[h.type] || 0) + 1;
    });
    PENDING_LIVE = PIE.map(function (d) {
      return { name: d.name, value: pend[d.name] || 0 };
    });
  }

  function paintKpis() {
    if ($("kpi-total")) $("kpi-total").textContent = STATS.total.toLocaleString("en-US");
    if ($("kpi-total-note")) $("kpi-total-note").textContent = "本月新增 " + STATS.monthNew;
    if ($("kpi-rate")) $("kpi-rate").textContent = STATS.rate + "%";
    if ($("kpi-over")) $("kpi-over").textContent = String(STATS.overdue);
    if ($("kpi-over-note")) $("kpi-over-note").textContent = "超期率 " + (STATS.total ? (STATS.overdue / STATS.total * 100).toFixed(1) : "0") + "%";
    if ($("kpi-major")) $("kpi-major").textContent = String(STATS.major);
    if ($("kpi-major-note")) {
      $("kpi-major-note").textContent = STATS.major ? "即时预警已推送" : "无在办重大隐患";
    }
  }

  function paintBanner() {
    const bar = $("ingest-bar");
    if (!bar || !window.PMSafetyStore) return;
    const latest = PMSafetyStore.latestExtra();
    if (!latest) {
      bar.hidden = true;
      return;
    }
    bar.hidden = false;
    bar.innerHTML = "<span>统一库已更新：刚入库 <b>" + latest.id + "</b> · " +
      (projectById(latest.project) ? projectById(latest.project).name : "") + " · " +
      latest.level + " / " + latest.type + "，看板数字已重算。</span>" +
      '<button type="button" id="btn-see-new">查看该条</button>';
    const btn = $("btn-see-new");
    if (btn) btn.addEventListener("click", function () {
      const h = HAZARDS.find(function (x) { return x.id === latest.id; });
      if (h) openHazard(h);
    });
  }

  const QA = [
    { q: "本月项目C新增隐患多少条", a: "项目C（智能制造厂房）本月新增 <b>22</b> 条。集团本月合计新增 86 条。可从看板点项目C下钻查看条目。" },
    { q: "哪些项目整改完成率最低", a: "完成率最低为 <b>项目E 综合办公楼 86.3%</b>，其次为 <b>项目D 配套市政工程 89.4%</b>。点排名条可下钻到具体隐患。" },
    { q: "消防类隐患占比多少", a: "消防类占集团隐患总量的 <b>18%</b>（约 231 条）。右上专项标签或环形图可高亮消防分布。" },
  ];

  const charts = [];
  let pieChart = null;
  let rankChart = null;
  let mapChart = null;
  let reportCharts = [];

  function $(id) { return document.getElementById(id); }
  function projectById(id) { return PROJECTS.find(function (p) { return p.id === id; }); }
  function projectByName(name) { return PROJECTS.find(function (p) { return p.name === name; }); }
  function hazardsOf(pid) { return HAZARDS.filter(function (h) { return h.project === pid; }); }
  function tagClass(status, level) {
    if (level === "重大" || status === "逾期") return "danger";
    if (status === "临期") return "warn";
    if (status === "已闭环") return "ok";
    return "blue";
  }

  function tickClock() {
    const el = $("clock");
    if (!el) return;
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    el.textContent =
      d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) +
      " " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  }

  function initChart(el, option, track) {
    const existing = echarts.getInstanceByDom(el);
    if (existing) existing.dispose();
    const chart = echarts.init(el, null, { renderer: "canvas" });
    chart.setOption(option);
    if (track !== false) charts.push(chart);
    return chart;
  }

  function commonText() {
    return { fontFamily: "Noto Sans SC, Microsoft YaHei, sans-serif", color: "#4a6a86" };
  }

  function renderTrend() {
    const el = $("chart-trend");
    if (!el) return;
    initChart(el, {
      color: PALETTE,
      textStyle: commonText(),
      tooltip: { trigger: "axis", confine: true },
      legend: { data: ["隐患总量", "逾期数"], right: 0, top: 0, itemWidth: 12, textStyle: { color: "#7a97ae", fontSize: 11 } },
      grid: { left: 36, right: 12, top: 28, bottom: 24 },
      xAxis: { type: "category", data: ["05-15", "05-22", "05-29", "06-01", "06-05", "06-08", "06-12"], boundaryGap: false, axisLine: { lineStyle: { color: "#c5dff0" } }, axisLabel: { color: "#7a97ae", fontSize: 10 } },
      yAxis: { type: "value", splitLine: { lineStyle: { color: "#e8f1f8", type: "dashed" } }, axisLabel: { color: "#7a97ae", fontSize: 10 } },
      series: [
        { name: "隐患总量", type: "line", smooth: true, symbol: "circle", symbolSize: 6, areaStyle: { color: "rgba(47,125,225,0.12)" }, data: [1348, 1332, 1318, 1306, 1298, 1290, STATS.total] },
        { name: "逾期数", type: "line", smooth: true, symbol: "circle", symbolSize: 6, lineStyle: { type: "dashed" }, data: [46, 41, 36, 30, 24, 20, STATS.overdue] },
      ],
    });
  }

  function renderPie() {
    const el = $("chart-pie");
    if (!el) return;
    pieChart = initChart(el, {
      color: PALETTE,
      textStyle: commonText(),
      tooltip: { trigger: "item", confine: true, formatter: "{b} {c}%" },
      legend: { show: false },
      series: [{
        type: "pie",
        radius: ["48%", "72%"],
        center: ["32%", "52%"],
        itemStyle: { borderColor: "#f8fcff", borderWidth: 2 },
        label: { show: false },
        data: PIE_LIVE.map((d, i) => ({ name: d.name, value: d.value, key: d.key, itemStyle: { color: PALETTE[i] } })),
      }],
      graphic: PIE_LIVE.map((d, i) => ({
        type: "text", right: 12, top: 18 + i * 22,
        style: { text: d.name + "  " + d.value + "%", fill: "#4a6a86", font: "12px Noto Sans SC, Microsoft YaHei, sans-serif" },
      })),
    });
    pieChart.off("click");
    pieChart.on("click", function (p) {
      openHazardList({ type: p.name, title: p.name + "类隐患" });
    });
  }

  function renderRank() {
    const el = $("chart-rank");
    if (!el) return;
    rankChart = initChart(el, {
      color: ["#2f7de1"],
      textStyle: commonText(),
      tooltip: { trigger: "axis", confine: true, axisPointer: { type: "shadow" }, valueFormatter: (v) => v + "%" },
      grid: { left: 72, right: 44, top: 8, bottom: 8 },
      xAxis: { type: "value", max: 100, splitLine: { show: false }, axisLabel: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
      yAxis: { type: "category", inverse: true, data: PROJECTS.map((p) => p.name), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: "#4a6a86", fontSize: 12 } },
      series: [{
        type: "bar",
        barWidth: 8,
        data: PROJECTS.map((p, i) => ({ value: p.rate, id: p.id, itemStyle: { color: i === 4 ? "#f08a24" : "#2f7de1" } })),
        label: { show: true, position: "right", formatter: "{c}%", color: "#2f7de1", fontFamily: "Rajdhani, sans-serif", fontSize: 12 },
      }],
    });
    rankChart.off("click");
    rankChart.on("click", function (p) {
      const proj = PROJECTS[p.dataIndex];
      if (proj) openProject(proj.id);
    });
  }

  function renderPending() {
    const el = $("chart-pending");
    if (!el) return;
    const data = PENDING_LIVE.slice().sort((a, b) => b.value - a.value);
    const max = Math.max(1, ...data.map((d) => d.value));
    const colors = ["#2f7de1", "#1aa6b8", "#f08a24", "#e23d3d", "#2ba471"];
    initChart(el, {
      textStyle: commonText(),
      tooltip: { trigger: "axis", confine: true, axisPointer: { type: "shadow" }, valueFormatter: (v) => v + " 条" },
      grid: { left: 64, right: 48, top: 8, bottom: 8 },
      xAxis: { type: "value", max: Math.ceil(max * 1.2), splitLine: { show: false }, axisLabel: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
      yAxis: { type: "category", inverse: true, data: data.map((d) => d.name), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: "#4a6a86", fontSize: 12 } },
      series: [{
        type: "bar",
        barWidth: 8,
        data: data.map((d, i) => ({ value: d.value, name: d.name, itemStyle: { color: colors[i % colors.length] } })),
        label: { show: true, position: "right", formatter: "{c}", color: "#16324f", fontFamily: "Rajdhani, sans-serif", fontSize: 12 },
      }],
    }).on("click", function (p) {
      const item = data[p.dataIndex];
      if (item) openHazardList({ type: item.name, title: item.name + "类待整改隐患" });
    });
  }

  function mapOption() {
    return {
      tooltip: {
        trigger: "item",
        confine: true,
        formatter: function (p) {
          if (!p.data) return p.name;
          return p.data.name + " · " + p.data.full + "<br/>状态：" + STATUS_MAP[p.data.status] + "<br/>点击下钻";
        },
      },
      geo: {
        map: "china", roam: false, zoom: 1.15, layoutCenter: ["50%", "55%"], layoutSize: "118%",
        itemStyle: { areaColor: "#d4eaf8", borderColor: "#7eb6dc", borderWidth: 1 },
        emphasis: { itemStyle: { areaColor: "#c3e0f4" }, label: { show: false } },
      },
      series: [{
        type: "effectScatter",
        coordinateSystem: "geo",
        rippleEffect: { scale: 3.2, brushType: "stroke" },
        symbolSize: function (val, p) { return p.data.status === "major" ? 16 : 11; },
        itemStyle: { color: function (p) { return p.data.color; } },
        data: PROJECTS.map(function (p) {
          return { id: p.id, name: p.name, full: p.full, status: p.status, color: p.color, value: p.value };
        }),
      }],
    };
  }

  function bindMapClick(chart) {
    mapChart = chart;
    chart.off("click");
    chart.on("click", function (p) {
      if (p.data && p.data.id) openProject(p.data.id);
    });
  }

  function renderMapFallback() {
    const el = $("chart-map");
    if (!el) return;
    bindMapClick(initChart(el, {
      title: { text: "地图加载失败 · 点击右侧项目点下钻", left: "center", top: 8, textStyle: { fontSize: 12, color: "#7a97ae", fontWeight: 400 } },
      xAxis: { show: false },
      yAxis: { show: false },
      series: [{
        type: "scatter",
        symbolSize: 16,
        data: PROJECTS.map((p, i) => ({ value: [20 + i * 18, 50], id: p.id, name: p.name, itemStyle: { color: p.color } })),
        label: { show: true, formatter: "{b}", position: "bottom", color: "#4a6a86", fontSize: 11 },
      }],
    }));
  }

  function renderMap(geo) {
    const el = $("chart-map");
    if (!el) return;
    echarts.registerMap("china", geo);
    bindMapClick(initChart(el, mapOption()));
  }

  function loadChinaMap() {
    const urls = [
      "https://geo.datav.aliyun.com/areas_v3/bound/100000.json",
      "https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/china.json",
    ];
    function tryUrl(i) {
      if (i >= urls.length) { renderMapFallback(); return; }
      fetch(urls[i]).then(function (res) {
        if (!res.ok) throw new Error("bad");
        return res.json();
      }).then(renderMap).catch(function () { tryUrl(i + 1); });
    }
    tryUrl(0);
  }

  function bindChips() {
    const root = $("chips");
    if (!root || !pieChart) return;
    root.addEventListener("click", function (e) {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      const on = btn.classList.contains("is-on");
      root.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-on"); });
      const idx = PIE.findIndex(function (d) { return d.key === btn.dataset.key; });
      pieChart.dispatchAction({ type: "downplay", seriesIndex: 0 });
      if (!on && idx >= 0) {
        btn.classList.add("is-on");
        pieChart.dispatchAction({ type: "highlight", seriesIndex: 0, dataIndex: idx });
        openHazardList({ type: PIE[idx].name, title: PIE[idx].name + "类隐患" });
      }
    });
  }

  /* ——— overlay ——— */
  const mask = $("mask");
  const drawer = $("drawer");
  const modalReport = $("modal-report");
  const modalQa = $("modal-qa");

  function closeAll() {
    [drawer, modalReport, modalQa].forEach(function (el) {
      if (!el) return;
      el.classList.remove("is-open");
      el.setAttribute("aria-hidden", "true");
    });
    mask.classList.remove("is-open");
    document.body.classList.remove("lock");
    reportCharts.forEach(function (c) { c.dispose(); });
    reportCharts = [];
  }

  function openMask() {
    mask.classList.add("is-open");
    document.body.classList.add("lock");
  }

  function openDrawer() {
    closeAll();
    openMask();
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
  }

  function crumb(parts) {
    return parts.map(function (p, i) {
      if (p.fn) return '<button type="button" data-crumb="' + i + '">' + p.label + "</button>";
      return "<span>" + p.label + "</span>";
    }).join(" / ");
  }

  function bindCrumbs(parts) {
    $("crumbs").querySelectorAll("[data-crumb]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const fn = parts[Number(btn.dataset.crumb)].fn;
        if (fn) fn();
      });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]; });
  }

  function renderHazardRows(list) {
    if (!list.length) return '<p class="hint-bar">该筛选下暂无演示条目（全量 1,286 条为汇总，下钻展示典型样本）。</p>';
    return '<ul class="hz-list">' + list.map(function (h) {
      const p = projectById(h.project);
      return '<li><button type="button" class="hz-item" data-hid="' + h.id + '">' +
        '<div class="hz-top"><span class="hz-id">' + h.id + '</span>' +
        '<span class="tag ' + tagClass(h.status, h.level) + '">' + h.level + " · " + h.status + "</span>" +
        '<span class="tag blue">' + h.type + "</span></div>" +
        '<div class="hz-meta">' + (p ? p.name + " · " : "") + escapeHtml(h.loc) + " · 责任人 " + h.owner + " · 时限 " + h.due + "</div>" +
        "</button></li>";
    }).join("") + "</ul>";
  }

  function openProjectList() {
    openDrawer();
    $("drawer-title").textContent = "选择项目";
    const parts = [{ label: "集团总览" }];
    $("crumbs").innerHTML = crumb(parts);
    $("drawer-body").innerHTML =
      '<p class="hint-bar">集团 → 项目 → 隐患条目。下列为 5 个施工项目（示意样本）。</p>' +
      PROJECTS.map(function (p) {
        return '<button type="button" class="proj-item" data-pid="' + p.id + '"><div class="proj-main">' +
          "<strong>" + p.name + "</strong> " + p.full +
          '</div><span class="tag ' + (p.rate < 90 ? "warn" : "ok") + '">完成率 ' + p.rate + "%</span></button>";
      }).join("");
    $("drawer-body").querySelectorAll("[data-pid]").forEach(function (btn) {
      btn.addEventListener("click", function () { openProject(btn.dataset.pid); });
    });
  }

  function openProject(pid) {
    const p = projectById(pid);
    if (!p) return;
    openDrawer();
    $("drawer-title").textContent = p.name + " · " + p.full;
    const parts = [
      { label: "集团总览", fn: openProjectList },
      { label: p.name },
    ];
    $("crumbs").innerHTML = crumb(parts);
    bindCrumbs(parts);
    const list = hazardsOf(pid);
    $("drawer-body").innerHTML =
      '<p class="hint-bar">完成率 ' + p.rate + "% · 台账 " + p.total + " 条 · 本月新增 " + p.monthNew + " 条。下列为可演示的典型条目。</p>" +
      renderHazardRows(list);
    bindHazardClicks(list, function () { openProject(pid); });
  }

  function openHazardList(filter) {
    openDrawer();
    const title = filter.title || "隐患列表";
    $("drawer-title").textContent = title;
    const parts = [
      { label: "集团总览", fn: openProjectList },
      { label: title },
    ];
    $("crumbs").innerHTML = crumb(parts);
    bindCrumbs(parts);
    let list = HAZARDS.slice();
    if (filter.type) list = list.filter(function (h) { return h.type === filter.type; });
    if (filter.status) list = list.filter(function (h) { return h.status === filter.status || (filter.status === "重大" && h.level === "重大"); });
    if (filter.level) list = list.filter(function (h) { return h.level === filter.level; });
    $("drawer-body").innerHTML = '<p class="hint-bar">集团汇总下钻到条目（演示样本，非正式全量库）。</p>' + renderHazardRows(list);
    bindHazardClicks(list, function () { openHazardList(filter); });
  }

  function bindHazardClicks(list, back) {
    $("drawer-body").querySelectorAll("[data-hid]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const h = list.find(function (x) { return x.id === btn.dataset.hid; }) || HAZARDS.find(function (x) { return x.id === btn.dataset.hid; });
        if (h) openHazard(h, back);
      });
    });
  }

  function openHazard(h, back) {
    const p = projectById(h.project);
    openDrawer();
    $("drawer-title").textContent = h.id;
    const parts = [
      { label: "集团总览", fn: openProjectList },
      { label: p ? p.name : "项目", fn: function () { openProject(h.project); } },
      { label: h.id },
    ];
    $("crumbs").innerHTML = crumb(parts);
    bindCrumbs(parts);
    $("drawer-body").innerHTML =
      '<div class="hz-top"><span class="tag ' + tagClass(h.status, h.level) + '">' + h.level + " · " + h.status + "</span>" +
      '<span class="tag blue">' + h.type + "</span></div>" +
      "<p style='margin:12px 0;font-size:14px'>" + escapeHtml(h.desc) + "</p>" +
      '<div class="detail-grid">' +
      "<div><div class='k'>项目</div><div class='v'>" + (p ? p.name + " · " + p.full : "") + "</div></div>" +
      "<div><div class='k'>位置</div><div class='v'>" + escapeHtml(h.loc) + "</div></div>" +
      "<div><div class='k'>整改责任人</div><div class='v'>" + h.owner + "</div></div>" +
      "<div><div class='k'>项目安全负责人</div><div class='v'>" + h.safety + "</div></div>" +
      "<div><div class='k'>集团分管领导</div><div class='v'>" + h.leader + "</div></div>" +
      "<div><div class='k'>整改时限</div><div class='v'>" + h.due + "</div></div>" +
      "</div>" +
      "<div class='report-sec'><h4>跟踪与升级</h4><ul class='timeline'>" +
      h.timeline.map(function (t) { return "<li><div class='when'>" + t.when + "</div>" + escapeHtml(t.what) + "</li>"; }).join("") +
      "</ul></div>" +
      (h.status === "已闭环"
        ? "<p class='hint-bar'>该条已闭环，看板完成率已计入。</p>"
        : '<button class="btn btn-primary" type="button" id="btn-close-hz">整改完成，录入闭环</button>');
    const closeBtn = $("btn-close-hz");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        if (window.PMSafetyStore) PMSafetyStore.closeHazard(h.id);
        refreshDashboard();
        const updated = HAZARDS.find(function (x) { return x.id === h.id; });
        if (updated) openHazard(updated);
      });
    }
  }

  /* ——— report ——— */
  function openReport() {
    closeAll();
    openMask();
    modalReport.classList.add("is-open");
    modalReport.setAttribute("aria-hidden", "false");
    $("report-body").innerHTML = '<p class="hint-bar">正在按统一库汇总趋势、完成率、高发问题与项目排名…</p>';
    setTimeout(fillReport, 500);
  }

  function fillReport() {
    $("report-body").innerHTML =
      '<p class="hint-bar">已自动生成并模拟推送集团分管领导（原人工约 3 天）。</p>' +
      '<div class="report-sec"><h4>隐患数量趋势</h4><p>近一月隐患总量由 1,348 降至当前 <b>' + STATS.total.toLocaleString("en-US") + '</b>，逾期 <b>' + STATS.overdue + '</b> 条。</p></div>' +
      '<div class="report-charts"><div class="chart-mount" id="rpt-trend"></div><div class="chart-mount" id="rpt-rank"></div></div>' +
      '<div class="report-sec"><h4>整改完成率</h4><p>集团完成率 <b>' + STATS.rate + '%</b>。项目E、项目D仍低于 90%，需重点盯办。</p></div>' +
      '<div class="report-sec"><h4>高发问题分析</h4><p>专项中防尘占 28%、高温 22%、<b>消防 18%</b>。消防通道占用、临时用电不规范在项目D/E 重复出现。</p></div>' +
      '<div class="report-sec"><h4>各项目排名</h4><p>' + PROJECTS.map(function (p, i) {
        return (i + 1) + " " + p.name + " " + p.rate + "%";
      }).join(" · ") + "。点击看板排名条可下钻条目。</p></div>";
    const t = $("rpt-trend");
    const r = $("rpt-rank");
    if (t) {
      reportCharts.push(initChart(t, {
        grid: { left: 28, right: 8, top: 24, bottom: 22 },
        tooltip: { trigger: "axis", confine: true },
        xAxis: { type: "category", data: ["05-15", "06-01", "06-12"], axisLabel: { fontSize: 10 } },
        yAxis: { splitLine: { lineStyle: { type: "dashed", color: "#e8f1f8" } } },
        series: [{ type: "line", smooth: true, data: [1348, 1306, STATS.total], areaStyle: { color: "rgba(47,125,225,.12)" }, itemStyle: { color: "#2f7de1" } }],
      }, false));
    }
    if (r) {
      reportCharts.push(initChart(r, {
        grid: { left: 56, right: 36, top: 8, bottom: 8 },
        xAxis: { type: "value", max: 100, show: false },
        yAxis: { type: "category", inverse: true, data: PROJECTS.map((p) => p.name), axisTick: { show: false }, axisLine: { show: false } },
        series: [{ type: "bar", barWidth: 8, data: PROJECTS.map((p) => p.rate), itemStyle: { color: "#2f7de1" }, label: { show: true, position: "right", formatter: "{c}%" } }],
      }, false));
    }
  }

  /* ——— QA ——— */
  function openQa() {
    closeAll();
    openMask();
    modalQa.classList.add("is-open");
    modalQa.setAttribute("aria-hidden", "false");
  }

  function ask(q) {
    const hit = QA.find(function (x) { return q.replace(/\s/g, "").indexOf(x.q.replace(/\s/g, "").slice(0, 8)) >= 0 || x.q.indexOf(q.replace(/\s/g, "").slice(0, 6)) >= 0 || q.indexOf("消防") >= 0 && x.q.indexOf("消防") >= 0 || q.indexOf("完成率") >= 0 && x.q.indexOf("完成率") >= 0 || (q.indexOf("新增") >= 0 && x.q.indexOf("新增") >= 0); });
    const a = hit ? hit.a : "Demo 预置了 3 个问题：本月某项目新增多少条、完成率最低的项目、消防类占比。正式环境将按统一库检索。";
    const log = $("qa-log");
    log.innerHTML += '<div class="qa-turn user"><div class="who">您</div><div class="bubble">' + escapeHtml(q) + "</div></div>";
    log.innerHTML += '<div class="qa-turn bot"><div class="who">智能问答</div><div class="bubble">' + a + "</div></div>";
    log.scrollTop = log.scrollHeight;
  }

  function observeResize() {
    const ro = new ResizeObserver(function () { charts.forEach(function (c) { try { c.resize(); } catch (e) {} }); });
    ["chart-map", "chart-trend", "chart-pie", "chart-pending", "chart-rank"].forEach(function (id) {
      const el = $(id);
      if (el) ro.observe(el);
    });
  }

  function refreshDashboard() {
    applyLive();
    paintKpis();
    paintBanner();
    renderTrend();
    renderPie();
    renderPending();
    renderRank();
  }

  tickClock();
  setInterval(tickClock, 1000);

  window.addEventListener("load", function () {
    applyLive();
    paintKpis();
    renderTrend();
    renderPie();
    renderPending();
    renderRank();
    loadChinaMap();
    bindChips();
    observeResize();
    paintBanner();

    $("qa-chips").innerHTML = QA.map(function (x) {
      return '<button type="button" class="qa-chip">' + x.q + "</button>";
    }).join("");
    $("qa-chips").addEventListener("click", function (e) {
      const b = e.target.closest(".qa-chip");
      if (b) ask(b.textContent);
    });
    $("qa-ask").addEventListener("click", function () {
      const q = $("qa-input").value.trim();
      if (!q) return;
      ask(q);
      $("qa-input").value = "";
    });
    $("qa-input").addEventListener("keydown", function (e) {
      if (e.key === "Enter") $("qa-ask").click();
    });

    $("btn-qa").addEventListener("click", openQa);
    $("btn-month").addEventListener("click", openReport);
    $("btn-month-2").addEventListener("click", openReport);

    document.querySelectorAll(".kpi").forEach(function (el) {
      el.addEventListener("click", function () {
        const f = el.dataset.filter;
        if (f === "all" || f === "rate") openProjectList();
        else if (f === "重大") openHazardList({ level: "重大", status: "重大", title: "重大隐患" });
        else openHazardList({ status: f, title: f + "隐患" });
      });
    });
    document.querySelectorAll(".alert").forEach(function (el) {
      el.addEventListener("click", function () {
        const f = el.dataset.filter;
        if (f === "重大") openHazardList({ level: "重大", title: "重大隐患即时预警" });
        else openHazardList({ status: f, title: f + "跟踪" });
      });
    });

    $("drawer-close").addEventListener("click", closeAll);
    document.querySelectorAll("[data-close]").forEach(function (b) {
      b.addEventListener("click", closeAll);
    });
    mask.addEventListener("click", closeAll);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

    function showBoard() {
      document.body.classList.remove("show-report");
      refreshDashboard();
    }
    function showReportForm() {
      closeAll();
      document.body.classList.add("show-report");
      var due = document.querySelector("#form [name=due]");
      if (due && !due.value) {
        var t = new Date();
        t.setDate(t.getDate() + 7);
        due.value = t.toISOString().slice(0, 10);
      }
    }
    $("btn-go-report").addEventListener("click", showReportForm);
    $("btn-back-board").addEventListener("click", showBoard);
    $("btn-cancel-report").addEventListener("click", showBoard);
    $("submit").addEventListener("click", function () {
      if (!window.PMSafetyStore) return;
      var row = PMSafetyStore.addFromForm($("form"));
      var toast = $("toast");
      toast.textContent = "已入库 " + row.id + " · 看板已更新";
      toast.classList.add("on");
      setTimeout(function () { toast.classList.remove("on"); }, 2200);
      showBoard();
      setTimeout(function () {
        var h = HAZARDS.find(function (x) { return x.id === row.id; });
        if (h) openHazard(h);
      }, 200);
    });
  });
})();
