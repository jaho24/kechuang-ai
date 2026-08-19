/* Shared demo state — 会议纪要与督查督办联动 */
(function (global) {
  const STORE_KEY = 'hkg_meeting_demo_v9';
  const TODAY = '2026-08-17';
  const ORG = '郑州航空港科创投资集团';

  const SAMPLE_MATERIALS = [
    { id: 'm-pdf', name: '安委会〔2026〕12号会议纪要.pdf', type: 'PDF', kind: 'pdf', size: '1.1 MB', source: 'OA 已发布', evidence: '解析正文 16 页，定位「议定事项」4 条。' },
    { id: 'm-txt', name: '录音转写_安委会_0812.txt', type: 'TXT', kind: 'transcript', size: '74 KB', source: '语音转写', evidence: '转写 58 分，抽取「文总强调」「责任到项目」「三管三必须」等关键句。' },
    { id: 'm-board', name: '白板拍照_议定事项.jpg', type: 'JPG', kind: 'image', size: '2.8 MB', source: '现场照片', evidence: 'OCR 识别手写：8/25 基坑闭环、8/22 科技园整改、8/20 方案。' },
    { id: 'm-wx', name: '微信群截图_任务确认.png', type: 'PNG', kind: 'image', size: '380 KB', source: '即时通讯', evidence: '识别群聊确认人：陈帅、赵磊、苏云霄已回复「收到」。' },
  ];

  const OA_DOCS = [
    {
      id: 'oa-0812',
      title: '郑州航空港科创投资集团安全生产委员会专题会议纪要',
      meetingNo: '安委会〔2026〕12号',
      date: '2026年8月12日',
      place: '华夏大道180号 金融广场南座 3 号会议室',
      host: '文钊（集团总经理）',
      publishTime: '2026-08-12 17:30',
      oaStatus: '已审批发布',
      initiator: '办公室 张璇',
      ccCount: 64,
      file: '安委会〔2026〕12号会议纪要.pdf',
      size: '1.1 MB',
    },
    {
      id: 'oa-0801',
      title: '重大隐患挂牌督办专题会议纪要',
      meetingNo: '安委会〔2026〕11号',
      date: '2026年8月1日',
      place: '金融广场南座 3 号会议室',
      host: '文钊（集团总经理）',
      publishTime: '2026-08-01 11:20',
      oaStatus: '已审批发布',
      initiator: '办公室 张璇',
      ccCount: 28,
      file: '安委会〔2026〕11号会议纪要.pdf',
      size: '980 KB',
    },
    {
      id: 'oa-0728',
      title: '深基坑重大隐患挂牌督办专题会议纪要',
      meetingNo: '安委会〔2026〕10号',
      date: '2026年7月28日',
      place: '金融广场南座 3 号会议室',
      host: '文钊（集团总经理）',
      publishTime: '2026-07-28 17:10',
      oaStatus: '已审批发布',
      initiator: '办公室 张璇',
      ccCount: 26,
      file: '安委会〔2026〕10号会议纪要.pdf',
      size: '1.0 MB',
    },
    {
      id: 'oa-0805',
      title: '集团党委扩大会议纪要',
      meetingNo: '党委会〔2026〕8号',
      date: '2026年8月5日',
      place: '金融广场南座 1 号会议室',
      host: '党委书记',
      publishTime: '2026-08-05 18:10',
      oaStatus: '已审批发布',
      initiator: '党委办公室',
      ccCount: 48,
      file: '党委会〔2026〕8号会议纪要.pdf',
      size: '720 KB',
    },
  ];

  const SAMPLE_MINUTES = {
    title: '郑州航空港科创投资集团安全生产委员会专题会议纪要',
    meetingNo: '安委会〔2026〕12号',
    date: '2026年8月12日',
    place: '华夏大道180号 金融广场南座 3 号会议室',
    host: '文钊（集团总经理）',
    attendees: '安委办、工程管理部、国际港务公司、数字航空港、科技资本及在建项目负责人等 26 人',
    publisher: '办公室 张璇',
    sections: [
      {
        h: '一、会议议题',
        html: '<ul><li>建设及运营领域风险隐患专项整治进展</li><li>国际陆港、锦荣科技园在建项目危大工程管控</li><li>安全生产「一张图」智慧监管平台对接</li><li>中秋国庆期间园区与在建项目安全稳定工作</li></ul>',
      },
      {
        h: '二、会议要点',
        html: '<p>会议听取了安委办关于复工复产检查、隐患排查治理及安全生产治本攻坚三年行动进展的汇报。工程管理部通报了国际陆港集结中心、锦荣科技园等在建项目基坑与危大工程管控情况。</p><p>文钊总经理强调：要把「人民至上、生命至上」贯穿生产经营全过程，落实「党政同责、一岗双责」和「三管三必须」；对逾期未整改隐患实行挂牌督办；加快推动智慧安监平台建设，提升科技赋能水平。</p>',
      },
      {
        h: '三、议定事项',
        html: '<ul><li>国际港务公司对中欧班列（郑州）集结中心在建基坑支护隐患于 8 月 25 日前完成整改并验收。</li><li>工程管理部牵头，8 月 22 日前完成锦荣科技园危大工程专项检查整改闭环。</li><li>各二级单位于 8 月 20 日前报送中秋国庆期间园区与在建项目安全稳定工作方案。</li><li>安委办建立周报机制，并将安全指标纳入年度经营业绩考核，实行责任事故「一票否决」。</li></ul>',
      },
    ],
  };

  const MINUTES_PARTY = {
    title: '郑州航空港科创投资集团党委扩大会议纪要',
    meetingNo: '党委会〔2026〕8号',
    date: '2026年8月5日（星期二）下午',
    place: '华夏大道180号金融广场南座 1 号会议室',
    host: '党委书记',
    attendees: '党委班子成员；办公室、党委巡察办、法务部、财务部主要负责人；科技资本、国际港务、数字航空港等参控股企业主要负责人共 32 人',
    publisher: '党委办公室',
    recorder: '党委办公室 张璇',
    sections: [
      {
        h: '文头',
        html: '<p><strong>郑州航空港科创投资集团有限公司党委扩大会议纪要</strong><br/>党委会〔2026〕8号　　签发：党委书记　　2026年8月5日</p>',
      },
      {
        h: '一、会议时间、地点及出席',
        html: '<p><strong>时间：</strong>2026年8月5日（星期二）15:00—17:20<br/><strong>地点：</strong>集团总部金融广场南座 1 号会议室<br/><strong>主持人：</strong>党委书记<br/><strong>记录人：</strong>党委办公室 张璇<br/><strong>出席：</strong>党委书记，党委副书记、总经理文钊，党委班子有关成员；办公室、党委巡察办、法务部、财务部主要负责人；科技资本公司、国际港务公司、数字航空港公司主要负责人。<br/><strong>列席：</strong>科技资本公司分管合规、财务管理相关人员。</p>',
      },
      {
        h: '二、会议议题',
        html: '<ol><li>听取 2026 年上半年参控股企业专项巡察整改推进情况汇报</li><li>研究整改台账销号标准、验收程序与逾期问责安排</li><li>通报科技资本公司基金合规及对外投资决策留痕复核进展</li></ol>',
      },
      {
        h: '三、会议内容',
        html: '<p><strong>（一）情况通报。</strong>党委巡察办汇报：本轮专项巡察台账共列问题 28 项，截至 8 月 4 日已销号 19 项、未销号 9 项。未销号事项中，科技资本公司牵头 5 项，主要集中在产业投资基金决策留痕、关联交易披露、投后管理台账三个方面。其余 4 项由国际港务、数字航空港分别认领，目前均已进入验收程序。</p><p><strong>（二）讨论意见。</strong>与会同志认为，科技资本公司作为集团全资子公司（注册资本 20 亿元），承担产业投资引导与基金管理职能，整改材料必须做到「一事一档、审签闭环」，不得以口头说明替代书面依据。</p><p><strong>（三）领导讲话。</strong>党委书记强调：巡察整改是政治任务，必须坚持「整改不到位不销号、验收不通过不销号、群众不满意不销号」；对逾期未闭环事项实行挂牌督办，由总经理办公室按周跟踪通报。总经理文钊要求科技资本公司对照《销号验收清单》逐条补齐基金合规、对外投资决策留痕等材料，法务与财务双审通过后方可提请销号；对仍不到位的，按干部管理权限启动约谈。</p>',
      },
      {
        h: '四、议定事项',
        html: '<ol><li><strong>责任单位：</strong>科技资本公司（牵头），党委巡察办、法务部、财务部协办。<br/><strong>事项：</strong>完成参控股企业专项巡察整改台账闭环销号。<br/><strong>时限：</strong>2026年8月12日前。逾期未销号事项自动升红牌并升级推送总经理。</li><li>党委巡察办会同法务部、财务部于 <strong>8月10日前</strong>完成验收复核，形成《销号验收意见》报党委审定。验收采取「书面审核 + 抽查底稿」方式，抽查比例不低于未销号事项的 50%。</li><li>未销号事项实行周报：每周三 18:00 前向党委扩大会成员书面报送进展，直至全部销号。周报由科技资本公司起草，党委巡察办审核。</li><li>对 8 月 12 日后仍未销号的事项，由党委巡察办提出问责建议，按集团有关规定办理。</li></ol>',
      },
      {
        h: '五、附件及印发',
        html: '<ul><li>附件 1：参控股企业专项巡察整改台账（截至 2026-08-04）</li><li>附件 2：科技资本公司未销号事项清单（5 项）及责任人</li><li>附件 3：《销号验收清单》及双审流程说明</li></ul><p>出席人员已核阅。如有出入，请于收到本纪要 3 个工作日内向党委办公室书面反馈。</p><p style="margin-top:10px">党委办公室　　2026年8月5日<br/>印发：党委班子成员，各部门、各参控股企业主要负责人。共印 40 份。</p>',
      },
    ],
  };

  const MINUTES_HAZARD = {
    title: '郑州航空港科创投资集团重大隐患挂牌督办专题会议纪要',
    meetingNo: '安委会〔2026〕11号',
    date: '2026年8月1日（星期五）上午',
    place: '华夏大道180号金融广场南座 3 号会议室',
    host: '文钊（集团总经理）',
    attendees: '安委办、工程管理部、国际港务公司、项目总包及监理单位负责人等 21 人',
    publisher: '办公室 张璇',
    recorder: '办公室 张璇',
    sections: [
      {
        h: '文头',
        html: '<p><strong>郑州航空港科创投资集团有限公司安全生产委员会专题会议纪要</strong><br/>安委会〔2026〕11号　　签发：文钊　　2026年8月1日</p>',
      },
      {
        h: '一、会议时间、地点及出席',
        html: '<p><strong>时间：</strong>2026年8月1日（星期五）09:30—11:10<br/><strong>地点：</strong>集团总部金融广场南座 3 号会议室<br/><strong>主持人：</strong>集团总经理、安委会主任文钊<br/><strong>记录人：</strong>办公室 张璇<br/><strong>出席：</strong>安委办主任苏云霄，工程管理部陈帅，国际港务公司赵磊；集结中心项目总包项目经理、总监代表；安委办、工程管理部有关人员。<br/><strong>列席：</strong>监理单位安全专监 2 人。</p>',
      },
      {
        h: '二、会议背景',
        html: '<p>7 月 22 日至 24 日，安委办会同工程管理部对中欧班列（郑州）集结中心在建区域开展联合检查。检查发现：临边防护缺失 6 处、洞口临边栏杆未按《建筑施工高处作业安全技术规范》封闭 8 处，存在高处坠落重大隐患。现场已下达《责令限期整改指令书》（港科安令〔2026〕07号）。</p><p>根据国务院安委会安全生产治本攻坚三年行动部署及《集团生产安全事故隐患挂牌督办办法》，安委会决定对该隐患实行挂牌督办。</p>',
      },
      {
        h: '三、会议内容',
        html: '<p><strong>（一）隐患及临时管控。</strong>国际港务公司汇报：已设置警戒区域并安排专人值守，临时围挡完成约 40%；洞口封闭尚未形成闭环。工程管理部通报监理旁站记录 11 份，指出夜间交叉施工期间旁站覆盖不足。</p><p><strong>（二）领导讲话。</strong>文钊总经理强调：重大隐患必须「发现即挂牌、整改即销号、逾期即问责」；整改期间每日巡查不得间断；销号须经安委办现场验收，不得以书面材料替代现场核验。对总包、监理履职不到位的，由国际港务公司按合同约定扣减安全文明施工费并书面报告集团。</p>',
      },
      {
        h: '四、议定事项',
        html: '<ol><li><strong>责任单位：</strong>国际港务公司；<strong>协办：</strong>工程管理部；<strong>验收：</strong>安委办。<br/><strong>事项：</strong>完成集结中心临边防护、洞口封闭整改并申请销号。<br/><strong>时限：</strong>2026年8月10日前。</li><li>整改期间实行「每日巡查、每日报送」：国际港务公司于每日 18:00 前将巡查表、影像资料报送安委办。</li><li>销号当日由安委办组织现场验收，验收组成员不少于 3 人，形成《重大隐患销号验收意见》。</li><li>逾期未销号的，系统自动评定红牌，升级推送总经理，并按集团安全考核「一票否决」口径纳入月度经营业绩通报。</li></ol>',
      },
      {
        h: '五、附件及印发',
        html: '<ul><li>附件 1：重大隐患挂牌督办通知书（港科安督〔2026〕11号）</li><li>附件 2：临边防护 / 洞口封闭整改验收清单（共 14 项）</li><li>附件 3：联合检查照片（7 张）及监理旁站记录摘要</li><li>附件 4：责令限期整改指令书（港科安令〔2026〕07号）</li></ul><p>出席人员已核阅。本纪要已经主持人审定。</p><p style="margin-top:10px">办公室　　2026年8月1日<br/>印发：安委会成员，国际港务公司、工程管理部、安委办，项目总包、监理。共印 28 份。</p>',
      },
    ],
  };

  const MINUTES_PIT = {
    title: '郑州航空港科创投资集团深基坑重大隐患挂牌督办专题会议纪要',
    meetingNo: '安委会〔2026〕10号',
    date: '2026年7月28日（星期一）下午',
    place: '华夏大道180号金融广场南座 3 号会议室',
    host: '文钊（集团总经理）',
    attendees: '安委办、工程管理部、锦荣科技园项目部、支护专项施工及监测单位负责人等 18 人',
    publisher: '办公室 张璇',
    recorder: '办公室 张璇',
    sections: [
      {
        h: '文头',
        html: '<p><strong>郑州航空港科创投资集团有限公司安全生产委员会专题会议纪要</strong><br/>安委会〔2026〕10号　　签发：文钊　　2026年7月28日</p>',
      },
      {
        h: '一、会议时间、地点及出席',
        html: '<p><strong>时间：</strong>2026年7月28日（星期一）14:30—16:40<br/><strong>地点：</strong>集团总部金融广场南座 3 号会议室<br/><strong>主持人：</strong>集团总经理、安委会主任文钊<br/><strong>记录人：</strong>办公室 张璇<br/><strong>出席：</strong>安委办苏云霄，工程管理部陈帅；锦荣科技园项目负责人；支护专项施工单位、第三方监测单位主要人员。<br/><strong>列席：</strong>监理单位总监代表。</p>',
      },
      {
        h: '二、会议背景',
        html: '<p>锦荣科技园位于港区南部高端制造业集聚区，为省级重点建设项目。7 月 21 日第三方监测报告显示：基坑东侧支护桩水平位移连续 3 日超黄色预警值，局部接近橙色阈值；降水井运行记录不完整，存在支护结构失稳风险。</p><p>工程管理部已于 7 月 22 日下达停工令（局部作业面），要求立即加密监测、复核支护设计并完善应急预案。安委会研究决定，对该深基坑隐患实行挂牌督办。</p>',
      },
      {
        h: '三、会议内容',
        html: '<p><strong>（一）现场与监测。</strong>第三方监测单位汇报：东侧 3 个监测点位移速率未收敛；南侧地下水位波动较大。支护单位说明：拟采取增加斜撑、复喷混凝土面层及加密降水观测等措施，预计 10 日内完成主体加固。</p><p><strong>（二）管理问题。</strong>工程管理部指出：专项施工方案专家论证意见中「信息化监测日报」未严格执行；7 月 18 日、19 日两份日报缺失，属于重大管理缺陷。</p><p><strong>（三）领导讲话。</strong>文钊总经理要求：隐患不消除、监测不收敛，不得恢复东侧土方作业；挂牌期间每日向安委办报送监测曲线；销号必须同时满足「监测稳定 + 支护验收 + 方案闭合」三项条件。对监测日报缺失问题，由工程管理部对项目部、监测单位书面通报。</p>',
      },
      {
        h: '四、议定事项',
        html: '<ol><li><strong>责任单位：</strong>工程管理部；<strong>项目实施：</strong>锦荣科技园项目部及支护、监测单位；<strong>验收：</strong>安委办。<br/><strong>事项：</strong>完成深基坑支护加固、监测体系恢复及挂牌销号。<br/><strong>时限：</strong>2026年8月8日前。</li><li>即日起东侧作业面继续局部停工，待连续 3 日监测数据稳定且安委办书面同意后方可复工。</li><li>监测日报于每日 17:00 前报工程管理部、安委办；缺报一次，对责任单位在集团安委会通报。</li><li>逾期未销号的，系统自动评定红牌并升级推送总经理；相关责任纳入月度安全考核。</li></ol>',
      },
      {
        h: '五、附件及印发',
        html: '<ul><li>附件 1：重大隐患挂牌督办通知书（港科安督〔2026〕10号）</li><li>附件 2：锦荣科技园深基坑监测超限报告（2026-07-21）</li><li>附件 3：支护加固方案及专家意见复函</li><li>附件 4：局部停工令及复工条件清单</li></ul><p>出席人员已核阅。本纪要已经主持人审定。</p><p style="margin-top:10px">办公室　　2026年7月28日<br/>印发：安委会成员，工程管理部、安委办、锦荣科技园项目部，支护及监测单位。共印 26 份。</p>',
      },
    ],
  };

  const MINUTES_BY_NO = {
    '安委会〔2026〕12号': SAMPLE_MINUTES,
    '安委会〔2026〕11号': MINUTES_HAZARD,
    '安委会〔2026〕10号': MINUTES_PIT,
    '党委会〔2026〕8号': MINUTES_PARTY,
  };

  const RESOLUTIONS = [
    '坚持「人民至上、生命至上」，落实「三管三必须」，对逾期未整改隐患实行挂牌督办。',
    '压实国际陆港、锦荣科技园等在建项目危大工程安全责任，限期整改闭环。',
    '中秋国庆期间保持园区与在建项目安全稳定，按时报送工作方案。',
  ];

  const TYPE_PRIORITY = {
    '安全隐患': 0,
    '巡察整改': 1,
    '节假日安保': 2,
    '项目推进': 3,
    '机制建设': 4,
  };

  const SAMPLE_TODOS = [
    {
      id: 'T-2026-0812-01',
      title: '国际陆港集结中心基坑支护隐患整改并验收',
      summary: '临期黄牌：支护监测已加密，需在 8/25 前完成整改验收。公开报道显示集结中心建设期间压实施工安全责任。',
      owner: '国际港务公司',
      ownerDept: '工程管理部协办',
      leader: '文钊',
      ownerPerson: '赵磊',
      deadline: '2026-08-25',
      priority: '高',
      status: '进行中',
      progress: 62,
      card: '黄',
      source: '安委会〔2026〕12号',
      batch: '2026年第12次安委会',
      type: '安全隐患',
      timeNodes: '8月13日启动整改 / 8月25日验收闭环',
      weekProgress: '基坑监测频率已加密，支护补强正在施工。',
      nextStep: '8月22日前完成自验并报送验收材料。',
      issues: '需协调夜间吊装窗口',
      updateTime: '2026-08-15 14:10',
      pushedBy: '办公室 张璇',
      pushedAt: '2026-08-12T17:42:00',
      desc: '针对中欧班列（郑州）集结中心在建基坑支护缺陷隐患，完成整改、自验并报送验收材料。逾期未闭环将挂牌督办。',
      meetingNo: '安委会〔2026〕12号',
      clause: '三、议定事项（一）',
      notify: '工程管理部、安委办',
      reportCycle: '每周填报',
      originQuote: '国际港务公司对中欧班列（郑州）集结中心在建基坑支护隐患于 8 月 25 日前完成整改并验收。',
      evidence: ['PDF 纪要 P6 议定事项第 1 条', '白板照片 OCR「8/25 基坑闭环」', '转写 00:38:12 文总点名国际港务'],
      timeline: [
        { when: '2026-08-12 17:40', what: '办公室生成纪要并完成结构化提取' },
        { when: '2026-08-12 17:42', what: '办公室推送至总经理文钊，初评黄牌' },
        { when: '2026-08-13 09:20', what: '国际港务公司已接收并反馈整改计划' },
        { when: '2026-08-15 14:10', what: '支护补强实施中，完成率 62%' },
        { when: '2026-08-17 08:00', what: '临期提醒已自动推送负责人赵磊' },
      ],
    },
    {
      id: 'T-2026-0812-02',
      title: '锦荣科技园危大工程专项检查整改闭环',
      summary: '临期黄牌：专项检查列出 6 项，已销 4 项；8/22 前须完成剩余高处作业与临时用电整改。',
      owner: '工程管理部',
      ownerDept: '工程管理部',
      leader: '文钊',
      ownerPerson: '陈帅',
      deadline: '2026-08-22',
      priority: '高',
      status: '进行中',
      progress: 70,
      card: '黄',
      source: '安委会〔2026〕12号',
      batch: '2026年第12次安委会',
      type: '安全隐患',
      timeNodes: '8月13日下发整改单 / 8月22日销号',
      weekProgress: '6 项隐患已销 4 项，剩余高处作业防护与临时用电。',
      nextStep: '8月20日前完成现场复核并拍照销号。',
      issues: '总包交叉作业面需错峰',
      updateTime: '2026-08-16 10:20',
      pushedBy: '办公室 张璇',
      pushedAt: '2026-08-12T17:42:00',
      desc: '对锦荣科技园在建项目危大工程开展专项检查，限期完成整改闭环。园区位于港区南部高端制造业集聚区，为省级重点建设项目。',
      meetingNo: '安委会〔2026〕12号',
      clause: '三、议定事项（二）',
      notify: '安委办、项目总包',
      reportCycle: '销号前每日填报',
      originQuote: '工程管理部牵头，8 月 22 日前完成锦荣科技园危大工程专项检查整改闭环。',
      evidence: ['PDF 纪要 P6 议定事项第 2 条', '转写 00:46:30 工程管理部表态'],
      timeline: [
        { when: '2026-08-12 17:40', what: '办公室生成纪要并完成结构化提取' },
        { when: '2026-08-12 17:42', what: '办公室推送至总经理文钊，初评黄牌' },
        { when: '2026-08-14 16:00', what: '专项检查整改单已下发项目部' },
        { when: '2026-08-17 08:00', what: '临期提醒已自动推送负责人陈帅' },
      ],
    },
    {
      id: 'T-2026-0812-03',
      title: '中秋国庆园区与在建项目安全稳定方案报送',
      summary: '临期催收：12 家单位已报 7 家，国际港务与科技资本尚未报送；8/20 截止。',
      owner: '各二级单位',
      ownerDept: '安委办汇总',
      leader: '文钊',
      ownerPerson: '苏云霄',
      deadline: '2026-08-20',
      priority: '高',
      status: '进行中',
      progress: 45,
      card: '黄',
      source: '安委会〔2026〕12号',
      batch: '2026年第12次安委会',
      type: '节假日安保',
      timeNodes: '8月14日启动填报 / 8月20日汇总呈报',
      weekProgress: '已收到 7/12 家单位方案。',
      nextStep: '催收未报单位，形成汇总稿呈报总经理。',
      issues: '国际港务、科技资本尚未报送',
      updateTime: '2026-08-16 11:00',
      pushedBy: '办公室 张璇',
      pushedAt: '2026-08-12T17:42:00',
      desc: '各单位报送中秋、国庆期间园区运营与在建项目安全稳定工作方案，安委办汇总后呈报。',
      meetingNo: '安委会〔2026〕12号',
      clause: '三、议定事项（三）',
      notify: '各二级单位办公室',
      reportCycle: '一次性报送，逾期催收',
      originQuote: '各二级单位于 8 月 20 日前报送中秋国庆期间园区与在建项目安全稳定工作方案。',
      evidence: ['PDF 纪要 P7 议定事项第 3 条', '微信截图 苏云霄「周五前收齐」'],
      timeline: [
        { when: '2026-08-12 17:40', what: '办公室生成纪要并完成结构化提取' },
        { when: '2026-08-12 17:42', what: '办公室推送至总经理文钊，初评黄牌' },
        { when: '2026-08-16 11:00', what: '已收到 7/12 家单位方案' },
        { when: '2026-08-17 08:00', what: '临期提醒已自动推送负责人苏云霄' },
      ],
    },
    {
      id: 'T-2026-0812-04',
      title: '安委办周报机制与安全考核一票否决落地',
      summary: '周报模板已发布，安全指标已纳入经营业绩考核口径，首期周报已呈报，事项办结（绿牌）。',
      owner: '安委办',
      ownerDept: '安委办',
      leader: '文钊',
      ownerPerson: '苏云霄',
      deadline: '2026-08-19',
      priority: '中',
      status: '已完成',
      progress: 100,
      card: '绿',
      source: '安委会〔2026〕12号',
      batch: '2026年第12次安委会',
      type: '机制建设',
      timeNodes: '8月13日发布模板 / 8月16日首期报送',
      weekProgress: '首期周报已提交总经理。',
      nextStep: '按周滚动报送（现已由系统自动生成）。',
      issues: '—',
      updateTime: '2026-08-16 09:00',
      pushedBy: '办公室 张璇',
      pushedAt: '2026-08-12T17:42:00',
      desc: '建立督办事项周报模板，并将安全指标纳入年度经营业绩考核，对责任事故实行「一票否决」。',
      meetingNo: '安委会〔2026〕12号',
      clause: '三、议定事项（四）',
      notify: '总经理办公室、人力资源部',
      reportCycle: '每周自动汇总',
      originQuote: '安委办建立周报机制，并将安全指标纳入年度经营业绩考核，实行责任事故「一票否决」。',
      evidence: ['PDF 纪要 P8 议定事项第 4 条', '转写 00:55:18'],
      timeline: [
        { when: '2026-08-12 17:40', what: '办公室生成纪要并完成结构化提取' },
        { when: '2026-08-13 18:00', what: '周报模板发布' },
        { when: '2026-08-16 09:00', what: '首期周报已报送，事项办结，评定绿牌' },
      ],
    },
    {
      id: 'T-2026-0812-05',
      title: '中秋国庆在建项目不停工包保责任落实',
      summary: '临期：需明确国际陆港、锦荣科技园节日不停工点位的领导包保与应急值班表。',
      owner: '工程管理部',
      ownerDept: '安委办协办',
      leader: '文钊',
      ownerPerson: '陈帅',
      deadline: '2026-08-21',
      priority: '高',
      status: '进行中',
      progress: 35,
      card: '黄',
      source: '安委会〔2026〕12号',
      batch: '2026年第12次安委会',
      type: '节假日安保',
      timeNodes: '8月15日梳理不停工点 / 8月21日报备值班表',
      weekProgress: '已梳理 5 个不停工点位，值班表尚未会签。',
      nextStep: '8月19日前完成包保领导会签。',
      issues: '国际陆港夜间施工点需增加巡查频次',
      updateTime: '2026-08-16 17:30',
      pushedBy: '办公室 张璇',
      pushedAt: '2026-08-12T17:42:00',
      desc: '对中秋国庆期间不停工的在建项目落实领导包保、应急值班和巡查频次。',
      meetingNo: '安委会〔2026〕12号',
      clause: '三、议定事项（三）附',
      notify: '国际港务公司、安委办',
      reportCycle: '节日前一次性报备',
      originQuote: '节日期间不停工项目必须明确包保领导、应急队伍和巡查频次。',
      evidence: ['转写 00:49:06 文总补充不停工包保', '白板 OCR「值班表 8/21」'],
      timeline: [
        { when: '2026-08-12 17:42', what: '办公室推送至总经理文钊，初评黄牌' },
        { when: '2026-08-16 17:30', what: '不停工点位清单已形成' },
        { when: '2026-08-17 08:00', what: '临期提醒已自动推送负责人陈帅' },
      ],
    },
    {
      id: 'T-2026-0812-06',
      title: '安全生产「一张图」智慧监管平台一期对接',
      summary: '数字航空港牵头对接工贸危化监测与防汛「四张图」，9/10 前提交联调报告，现场联调尚未启动。',
      owner: '数字航空港公司',
      ownerDept: '数字航空港公司',
      leader: '文钊',
      ownerPerson: '李会超',
      deadline: '2026-09-10',
      priority: '中',
      status: '未开始',
      progress: 0,
      card: '绿',
      source: '安委会〔2026〕12号',
      batch: '2026年第12次安委会',
      type: '项目推进',
      timeNodes: '8月20日启动联调 / 9月10日提交报告',
      weekProgress: '尚未启动与工贸危化企业的接口联调。',
      nextStep: '明确接口清单并通知相关企业对接人。',
      issues: '—',
      updateTime: '2026-08-12 17:42',
      pushedBy: '办公室 张璇',
      pushedAt: '2026-08-12T17:42:00',
      desc: '推进数字航空港融合基础设施提升项目中的安全生产「一张图」智慧监管平台一期对接，完成与工贸危化企业监测互联。',
      meetingNo: '安委会〔2026〕12号',
      clause: '会议要点 · 智慧安监',
      notify: '安委办、新型智慧城市运行中心',
      reportCycle: '节点复核期间每周填报',
      originQuote: '加快推动智慧安监平台建设，安全生产「一张图」一期完成与工贸危化企业对接。',
      evidence: ['转写 00:51:40 文总要求科技赋能', 'OA 附件：智慧应急二阶段招标范围'],
      timeline: [
        { when: '2026-08-12 17:40', what: '办公室生成纪要并完成结构化提取' },
        { when: '2026-08-12 17:42', what: '办公室推送至总经理文钊，初评绿牌' },
      ],
    },
    {
      id: 'T-2026-0728-01',
      title: '锦荣科技园深基坑支护重大隐患挂牌销号',
      summary: 'P0 红牌逾期：东侧支护位移超预警，8/8 销号时限已过；监测日报曾缺报，系统已升级推送总经理。',
      owner: '工程管理部',
      ownerDept: '安委办验收',
      leader: '文钊',
      ownerPerson: '陈帅',
      deadline: '2026-08-08',
      priority: '高',
      status: '进行中',
      progress: 58,
      card: '红',
      source: '安委会〔2026〕10号',
      batch: '2026年深基坑挂牌督办专题会',
      type: '安全隐患',
      timeNodes: '7月28日挂牌 / 8月8日销号（已超期）',
      weekProgress: '斜撑已安装过半，东侧位移速率下降但仍未连续 3 日稳定。',
      nextStep: '加密监测至连续 3 日稳定后申请安委办现场验收销号。',
      issues: '局部停工影响工期；监测日报 7 月 18—19 日曾缺报',
      updateTime: '2026-08-16 16:05',
      pushedBy: '办公室 张璇',
      pushedAt: '2026-07-28T17:15:00',
      desc: '对锦荣科技园深基坑东侧支护位移超限重大隐患实行挂牌督办，完成支护加固、监测恢复并现场验收销号。',
      meetingNo: '安委会〔2026〕10号',
      clause: '四、议定事项（一）',
      notify: '安委办、锦荣科技园项目部、支护及监测单位',
      reportCycle: '销号前每日填报监测日报',
      originQuote: '工程管理部对锦荣科技园深基坑支护重大隐患于 2026 年 8 月 8 日前完成加固并申请销号。',
      evidence: ['PDF 纪要安委会〔2026〕10号', '挂牌督办通知书 港科安督〔2026〕10号', '监测超限报告 2026-07-21'],
      timeline: [
        { when: '2026-07-28 17:10', what: '办公室生成深基坑挂牌督办专题会议纪要' },
        { when: '2026-07-28 17:15', what: '办公室推送至总经理文钊，初评黄牌' },
        { when: '2026-08-03 18:00', what: '斜撑开始安装，东侧继续局部停工' },
        { when: '2026-08-09 08:00', what: '逾期未销号，系统自动升红牌并升级推送总经理文钊' },
        { when: '2026-08-16 16:05', what: '位移速率下降，尚未连续 3 日稳定，完成率 58%' },
      ],
    },
    {
      id: 'T-2026-0808-01',
      title: '国际陆港集结中心临边防护重大隐患挂牌销号',
      summary: 'P0 红牌逾期：临边防护与洞口封闭未按规范完成，8/10 销号时限已过，系统已升级推送总经理。',
      owner: '国际港务公司',
      ownerDept: '工程管理部协办',
      leader: '文钊',
      ownerPerson: '赵磊',
      deadline: '2026-08-10',
      priority: '高',
      status: '进行中',
      progress: 48,
      card: '红',
      source: '安委会〔2026〕11号',
      batch: '2026年重大隐患挂牌督办专题会',
      type: '安全隐患',
      timeNodes: '8月1日挂牌 / 8月10日销号（已超期）',
      weekProgress: '临时围挡已补设，洞口临边栏杆仍有 3 处未封闭验收。',
      nextStep: '48 小时内完成剩余封闭并申请安委办现场验收销号。',
      issues: '夜间施工交叉，监理旁站力量不足',
      updateTime: '2026-08-16 15:40',
      pushedBy: '办公室 张璇',
      pushedAt: '2026-08-01T11:30:00',
      desc: '对中欧班列（郑州）集结中心在建区域临边防护缺失、洞口临边栏杆未封闭等重大隐患实行挂牌督办，限期整改销号。',
      meetingNo: '安委会〔2026〕11号',
      clause: '四、议定事项（一）',
      notify: '工程管理部、安委办、项目总包、监理',
      reportCycle: '销号前每日填报',
      originQuote: '国际港务公司对集结中心临边防护重大隐患于 2026 年 8 月 10 日前完成整改并申请销号。',
      evidence: ['PDF 纪要安委会〔2026〕11号 P4', '挂牌督办通知书 港科安督〔2026〕11号', '现场检查照片 7 张'],
      timeline: [
        { when: '2026-08-01 11:20', what: '办公室生成挂牌督办专题会议纪要' },
        { when: '2026-08-01 11:30', what: '办公室推送至总经理文钊，初评黄牌' },
        { when: '2026-08-05 18:00', what: '国际港务反馈：临时围挡完成，洞口封闭进行中' },
        { when: '2026-08-11 08:00', what: '逾期未销号，系统自动升红牌并升级推送总经理文钊' },
        { when: '2026-08-16 15:40', what: '仍有 3 处洞口未封闭验收，完成率 48%' },
      ],
    },
    {
      id: 'T-2026-0805-01',
      title: '参控股企业专项巡察整改台账销号',
      summary: '红牌逾期：科技资本牵头整改措施已定，仍有 3 项未验收；系统已升级推送总经理。',
      owner: '科技资本公司',
      ownerDept: '党委巡察办协办',
      leader: '文钊',
      ownerPerson: '连冠',
      deadline: '2026-08-12',
      priority: '高',
      status: '进行中',
      progress: 55,
      card: '红',
      source: '党委会〔2026〕8号',
      batch: '2026年第8次党委会',
      type: '巡察整改',
      timeNodes: '8月6日启动 / 8月12日闭环（已超期）',
      weekProgress: '整改措施已制定，3 项未完成验收。',
      nextStep: '本周完成剩余验收并销号。',
      issues: '涉及基金合规材料需法务复核',
      updateTime: '2026-08-16 16:20',
      pushedBy: '办公室 张璇',
      pushedAt: '2026-08-05T18:20:00',
      desc: '按党委扩大会议要求，完成参控股企业专项巡察整改台账闭环。科技资本公司为集团全资子公司，注册资本 20 亿元。',
      meetingNo: '党委会〔2026〕8号',
      clause: '四、议定事项（一）',
      notify: '党委巡察办、法务部、财务部、总经理办公室',
      reportCycle: '每周三书面填报',
      originQuote: '科技资本公司牵头，参控股企业专项巡察整改台账须于 2026 年 8 月 12 日前闭环销号；逾期自动升红牌并升级推送总经理。',
      evidence: ['PDF 纪要党委会〔2026〕8号', '巡察整改台账（截至 8月4日）', '未销号事项清单 5 项'],
      timeline: [
        { when: '2026-08-05 18:10', what: '党委办公室印发党委会〔2026〕8号纪要' },
        { when: '2026-08-05 18:20', what: '办公室推送至总经理文钊，纳入督办台账' },
        { when: '2026-08-10 17:30', what: '巡察办、法务、财务完成部分验收，仍余 3 项未过双审' },
        { when: '2026-08-13 08:00', what: '逾期未销号，系统自动升红牌并升级推送总经理文钊' },
        { when: '2026-08-16 16:20', what: '基金合规材料仍在法务复核，完成率 55%' },
      ],
    },
  ];

  const CC_ALL = [
    '集团领导班子（9人）',
    '安委办全体（8人）',
    '工程管理部全体（12人）',
    '国际港务公司主要负责人（6人）',
    '数字航空港 / 科技资本（7人）',
    '办公室/党委办传阅（10人）',
  ];

  const MATCHED_RECIPIENTS = [
    { name: '文钊', role: '集团总经理 · 主持人', reason: '本场主持；全部事项阅知；逾期升级对象' },
    { name: '赵磊', role: '国际港务公司工程负责人', reason: '议定事项（一）责任单位负责人' },
    { name: '陈帅', role: '工程管理部', reason: '议定事项（二）牵头责任人' },
    { name: '苏云霄', role: '安委办', reason: '议定事项（三）（四）汇总与周报责任人' },
  ];

  const TRANSFER_FIELDS = [
    { from: '工作任务', to: '事项名称', note: '督办标题，来自议定事项条款' },
    { from: '任务分类', to: '督办类型', note: '安全隐患 / 项目推进 / 节假日安保 / 机制建设' },
    { from: '时间节点', to: '任务分解', note: '启动、验收、报送等节点' },
    { from: '近期进展（材料交叉对齐）', to: '本周进展', note: '转入后由责任单位按周填报；提取时写入最近进展' },
    { from: '完成时限', to: '办结时限', note: '纪要明确日期，逾期自动监测' },
    { from: '责任领导', to: '分管领导', note: '升级与阅知对象' },
    { from: '责任单位 / 负责人', to: '责任单位', note: '承办主体；负责人用于临期提醒' },
    { from: '初评牌态', to: '红黄绿牌状态', note: '按距办结时限初评，转入后持续重算' },
    { from: '纪要文号 / 条款', to: '纪要来源', note: '可回溯到哪次会、哪一条' },
  ];

  const LEADER_PACKS = [
    {
      leader: '文钊',
      role: '集团总经理 · 安委会主持',
      taskIds: ['T-2026-0812-01', 'T-2026-0812-02', 'T-2026-0812-03', 'T-2026-0812-04', 'T-2026-0812-05'],
      hint: '本场会议全部督办事项',
    },
    {
      leader: '赵磊',
      role: '国际港务公司',
      taskIds: ['T-2026-0812-01'],
      hint: '国际陆港基坑支护隐患整改并验收',
    },
    {
      leader: '陈帅',
      role: '工程管理部',
      taskIds: ['T-2026-0812-02', 'T-2026-0812-05'],
      hint: '锦荣科技园危大工程 · 节日包保',
    },
    {
      leader: '苏云霄',
      role: '安委办',
      taskIds: ['T-2026-0812-03', 'T-2026-0812-04'],
      hint: '节假日安保方案汇总 · 周报机制',
    },
  ];

  const MESSAGES = [
    {
      id: 'm1',
      level: '黄',
      title: '临期提醒',
      time: '2026-08-17 08:00',
      to: '负责人 赵磊',
      body: '「国际陆港集结中心基坑支护隐患整改并验收」距办结时限 8 天，请按节点完成自验。',
    },
    {
      id: 'm2',
      level: '黄',
      title: '临期提醒',
      time: '2026-08-17 08:00',
      to: '负责人 陈帅',
      body: '「锦荣科技园危大工程专项检查整改闭环」将于 8 月 22 日到期，仍有 2 项未销号。',
    },
    {
      id: 'm3',
      level: '黄',
      title: '临期提醒',
      time: '2026-08-17 08:00',
      to: '负责人 苏云霄',
      body: '「中秋国庆园区与在建项目安全稳定方案报送」将于 8 月 20 日到期，尚有 5 家单位未报。',
    },
    {
      id: 'm4',
      level: '红',
      title: '逾期升级',
      time: '2026-08-09 08:00',
      to: '总经理 文钊',
      body: '「锦荣科技园深基坑支护重大隐患挂牌销号」已逾期，系统已评定红牌（P0），请关注工程管理部销号进度。',
    },
    {
      id: 'm5',
      level: '红',
      title: '逾期升级',
      time: '2026-08-11 08:00',
      to: '总经理 文钊',
      body: '「国际陆港集结中心临边防护重大隐患挂牌销号」已逾期，系统已评定红牌（P0），请关注国际港务公司销号进度。',
    },
    {
      id: 'm6',
      level: '红',
      title: '逾期升级',
      time: '2026-08-13 08:00',
      to: '总经理 文钊',
      body: '「参控股企业专项巡察整改台账销号」已逾期，系统已评定红牌，请关注科技资本公司推进情况。',
    },
  ];

  const WEEKLY_HISTORY = [
    {
      id: 'w32',
      week: 32,
      weekLabel: '2026年第32周',
      title: '科创集团督查督办周报（2026年第32周）',
      period: '2026-08-04 至 2026-08-10',
      generatedAt: '2026-08-10 09:00',
      pushedTo: ['总经理 文钊', '党委办公室', '安委会成员'],
      pushed: true,
      auto: true,
      summary: '系统自动汇总在办事项 3 项：红牌 1、黄牌 2。本周新从党委会〔2026〕8号转入巡察整改 1 项；深基坑挂牌事项于 8 月 8 日逾期升红。',
      stats: { total: 3, red: 1, yellow: 2, green: 0, doing: 3, todo: 0, done: 0 },
      highlights: [
        '红牌：锦荣科技园深基坑支护挂牌销号（安委会〔2026〕10号）已于 8 月 8 日逾期，系统已升级推送总经理。',
        '临期：国际陆港临边防护挂牌销号（安委会〔2026〕11号）办结时限为 8 月 10 日，临时围挡已补设，洞口封闭未完。',
        '新转入：参控股企业专项巡察整改台账销号（党委会〔2026〕8号），时限 8 月 12 日，科技资本公司牵头。',
      ],
      items: [
        { title: '锦荣科技园深基坑支护重大隐患挂牌销号', owner: '工程管理部', type: '安全隐患', card: '红', status: '进行中', deadline: '2026-08-08', progress: 42, weekProgress: '斜撑开始安装，东侧继续局部停工。', source: '安委会〔2026〕10号' },
        { title: '国际陆港集结中心临边防护重大隐患挂牌销号', owner: '国际港务公司', type: '安全隐患', card: '黄', status: '进行中', deadline: '2026-08-10', progress: 40, weekProgress: '临时围挡施工中，洞口封闭尚未闭环。', source: '安委会〔2026〕11号' },
        { title: '参控股企业专项巡察整改台账销号', owner: '科技资本公司', type: '巡察整改', card: '黄', status: '进行中', deadline: '2026-08-12', progress: 35, weekProgress: '整改措施已制定，双审材料收集中。', source: '党委会〔2026〕8号' },
      ],
    },
    {
      id: 'w31',
      week: 31,
      weekLabel: '2026年第31周',
      title: '科创集团督查督办周报（2026年第31周）',
      period: '2026-07-28 至 2026-08-03',
      generatedAt: '2026-08-03 09:00',
      pushedTo: ['总经理 文钊', '安委会成员'],
      pushed: true,
      auto: true,
      summary: '系统自动汇总在办事项 2 项：黄牌 2。本周新从安委会〔2026〕10号、11号挂牌督办专题会转入重大隐患 2 项，尚无红牌。',
      stats: { total: 2, red: 0, yellow: 2, green: 0, doing: 2, todo: 0, done: 0 },
      highlights: [
        '新转入：锦荣科技园深基坑支护重大隐患挂牌（安委会〔2026〕10号），时限 8 月 8 日，东侧作业面已局部停工。',
        '新转入：国际陆港集结中心临边防护挂牌（安委会〔2026〕11号），时限 8 月 10 日，已设置警戒并安排值守。',
        '本周无办结、无红牌。系统已按办结时限启动临期监测。',
      ],
      items: [
        { title: '锦荣科技园深基坑支护重大隐患挂牌销号', owner: '工程管理部', type: '安全隐患', card: '黄', status: '进行中', deadline: '2026-08-08', progress: 18, weekProgress: '已下达局部停工令，加密监测，支护加固方案评审中。', source: '安委会〔2026〕10号' },
        { title: '国际陆港集结中心临边防护重大隐患挂牌销号', owner: '国际港务公司', type: '安全隐患', card: '黄', status: '进行中', deadline: '2026-08-10', progress: 15, weekProgress: '挂牌督办通知已下达，临时围挡开始施工。', source: '安委会〔2026〕11号' },
      ],
    },
  ];

  function countBy(list, key) {
    const map = {};
    list.forEach(function (t) {
      const k = t[key] || '其他';
      map[k] = (map[k] || 0) + 1;
    });
    return Object.keys(map).map(function (k) { return { name: k, n: map[k] }; });
  }

  function buildWeeklyReport(todos, meta) {
    const list = (todos && todos.length) ? todos : SAMPLE_TODOS;
    const red = list.filter(function (t) { return t.card === '红'; });
    const yellow = list.filter(function (t) { return t.card === '黄'; });
    const green = list.filter(function (t) { return t.card === '绿'; });
    const doing = list.filter(function (t) { return t.status === '进行中'; });
    const todo = list.filter(function (t) { return t.status === '未开始'; });
    const done = list.filter(function (t) { return t.status === '已完成'; });
    const highlights = [];
    if (red.length) {
      highlights.push('红牌 ' + red.length + ' 项：' + red.map(function (t) { return '「' + t.title + '」（' + t.source + '，' + t.owner + '）'; }).join('；') + '。已自动升级推送总经理。');
    }
    if (yellow.length) {
      highlights.push('黄牌临期 ' + yellow.length + ' 项：' + yellow.map(function (t) { return t.title; }).join('、') + '。已向负责人推送提醒。');
    }
    if (done.length) {
      highlights.push('本周办结 ' + done.length + ' 项：' + done.map(function (t) { return t.title; }).join('、') + '。');
    }
    if (todo.length) {
      highlights.push('尚未启动 ' + todo.length + ' 项：' + todo.map(function (t) { return t.title; }).join('、') + '。');
    }
    const summary = '系统自动汇总在办督办事项 ' + list.length + ' 项：绿牌 ' + green.length + '、黄牌 ' + yellow.length + '、红牌 ' + red.length +
      '；进行中 ' + doing.length + '、未开始 ' + todo.length + '、已完成 ' + done.length + '。本周数据来自会议纪要转入及督办台账，无需人工逐项收集。';
    return {
      id: meta.id || 'w33',
      week: meta.week || 33,
      weekLabel: meta.weekLabel || '2026年第33周',
      title: '科创集团督查督办周报（' + (meta.weekLabel || '2026年第33周') + '）',
      period: meta.period || '2026-08-11 至 2026-08-17',
      generatedAt: meta.generatedAt || '2026-08-17 09:00',
      pushedTo: ['总经理 文钊', '党委办公室', '安委会成员'],
      pushed: true,
      auto: true,
      summary: summary,
      stats: {
        total: list.length,
        red: red.length,
        yellow: yellow.length,
        green: green.length,
        doing: doing.length,
        todo: todo.length,
        done: done.length,
      },
      byType: countBy(list, 'type'),
      byOwner: countBy(list, 'owner'),
      highlights: highlights,
      items: list.map(function (t) {
        return {
          title: t.title,
          owner: t.owner,
          type: t.type,
          card: t.card,
          status: t.status,
          deadline: t.deadline,
          progress: t.progress || 0,
          weekProgress: t.weekProgress || t.summary || '',
          source: t.source || t.meetingNo || '',
        };
      }),
    };
  }

  const WEEKLY_CURRENT_META = {
    id: 'w33',
    week: 33,
    weekLabel: '2026年第33周',
    period: '2026-08-11 至 2026-08-17',
    generatedAt: '2026-08-17 09:00',
  };

  const QA_PRESETS = [
    { q: '安委会第12次会议部署了哪些任务？' },
    { q: '本月哪些督办事项超期了？' },
    { q: '国际陆港基坑整改最新进展如何？' },
  ];

  function stripHtml(html) {
    return String(html || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|li|h\d|div|tr|ul|ol)>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function buildQaKnowledge(state) {
    const todos = (state && state.todos && state.todos.length) ? state.todos : SAMPLE_TODOS;
    const lines = [];
    lines.push('组织：' + ORG);
    lines.push('资料基准日：' + TODAY + '。「本月」「超期」均相对此日期判断。');
    lines.push('');
    lines.push('## 督办台账（' + todos.length + ' 项）');
    todos.forEach(function (t) {
      const tl = (t.timeline || []).map(function (x) { return (x.when || '') + ' ' + (x.what || ''); }).join('；');
      lines.push([
        '- ' + (t.id || '') + '｜' + (t.title || ''),
        '  类型：' + (t.type || '—') + '；牌态：' + (t.card || '—') + '；状态：' + (t.status || '—') + '；进度：' + (t.progress != null ? t.progress + '%' : '—'),
        '  责任单位：' + (t.owner || '—') + '；负责人：' + (t.ownerPerson || '—') + '；分管领导：' + (t.leader || '—'),
        '  办结时限：' + (t.deadline || '—') + '；来源：' + (t.source || t.meetingNo || '—') + '；条款：' + (t.clause || '—'),
        '  事项说明：' + (t.desc || t.summary || ''),
        t.originQuote ? '  纪要原文：' + t.originQuote : '',
        '  本周进展：' + (t.weekProgress || '—') + '；下一步：' + (t.nextStep || '—') + '；问题：' + (t.issues || '—'),
        tl ? '  时间线：' + tl : '',
      ].filter(Boolean).join('\n'));
    });
    lines.push('');
    lines.push('## 会议纪要');
    Object.keys(MINUTES_BY_NO).forEach(function (no) {
      const m = MINUTES_BY_NO[no];
      lines.push('### ' + no + ' ' + (m.title || ''));
      lines.push('时间：' + (m.date || '') + '；主持：' + (m.host || '') + '；地点：' + (m.place || '') + '；出席：' + (m.attendees || ''));
      (m.sections || []).forEach(function (s) {
        lines.push((s.h || '') + '\n' + stripHtml(s.html));
      });
      lines.push('');
    });
    if (OA_DOCS && OA_DOCS.length) {
      lines.push('## OA 已发布纪要目录');
      OA_DOCS.forEach(function (d) {
        lines.push('- ' + (d.meetingNo || '') + '｜' + (d.title || '') + '｜' + (d.date || '') + '｜' + (d.host || '') + '｜' + (d.oaStatus || ''));
      });
      lines.push('');
    }
    lines.push('## 周报档案');
    const reports = (WEEKLY_HISTORY || []).slice();
    if (state && state.thisWeekReport) reports.unshift(state.thisWeekReport);
    reports.forEach(function (r) {
      if (!r) return;
      lines.push((r.weekLabel || r.title || '') + '｜周期 ' + (r.period || '') + '｜' + (r.summary || ''));
      (r.highlights || []).forEach(function (h) { lines.push('  - ' + h); });
    });
    return lines.join('\n');
  }

  function defaultState() {
    return {
      files: [],
      extracted: false,
      pushed: false,
      todos: [],
      lastPushAt: null,
      lastPushLeaders: [],
      reportGenerated: false,
      thisWeekReport: null,
      activeReportId: 'w32',
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) {
      return defaultState();
    }
  }

  function save(state) {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  function reset() {
    localStorage.removeItem(STORE_KEY);
    return defaultState();
  }

  function toast(message, type) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    const el = document.createElement('div');
    el.className = 'toast ' + (type || 'info');
    el.innerHTML = '<span>' + message + '</span>';
    wrap.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(function () { el.remove(); }, 300);
    }, 3200);
  }

  function statusTag(s) {
    if (s === '已完成') return '<span class="tag tag-green">已完成</span>';
    if (s === '进行中') return '<span class="tag tag-blue">进行中</span>';
    if (s === '逾期') return '<span class="tag tag-red">逾期</span>';
    return '<span class="tag tag-gray">未开始</span>';
  }

  function cardTag(c) {
    if (c === '红') return '<span class="card-flag red">红牌</span>';
    if (c === '黄') return '<span class="card-flag yellow">黄牌</span>';
    return '<span class="card-flag green">绿牌</span>';
  }

  function sleep(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  global.DemoStore = {
    STORE_KEY: STORE_KEY,
    TODAY: TODAY,
    ORG: ORG,
    SAMPLE_MATERIALS: SAMPLE_MATERIALS,
    OA_DOCS: OA_DOCS,
    SAMPLE_MINUTES: SAMPLE_MINUTES,
    MINUTES_BY_NO: MINUTES_BY_NO,
    RESOLUTIONS: RESOLUTIONS,
    SAMPLE_TODOS: SAMPLE_TODOS,
    TYPE_PRIORITY: TYPE_PRIORITY,
    CC_ALL: CC_ALL,
    MATCHED_RECIPIENTS: MATCHED_RECIPIENTS,
    TRANSFER_FIELDS: TRANSFER_FIELDS,
    LEADER_PACKS: LEADER_PACKS,
    MESSAGES: MESSAGES,
    WEEKLY_HISTORY: WEEKLY_HISTORY,
    WEEKLY_CURRENT_META: WEEKLY_CURRENT_META,
    buildWeeklyReport: buildWeeklyReport,
    buildQaKnowledge: buildQaKnowledge,
    QA_PRESETS: QA_PRESETS,
    load: load,
    save: save,
    reset: reset,
    toast: toast,
    statusTag: statusTag,
    cardTag: cardTag,
    sleep: sleep,
  };
})(window);
