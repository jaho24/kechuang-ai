# 智能决策门户

科创集团统一首页入口，顶栏三导航：

1. **投资决策** → iframe 嵌入 `https://fde-demo.fineres.com:3000/`
2. **督查督办** → 嵌入 `meeting-supervision-demo`
3. **安全生产** → 嵌入 `safety-production-demo`（默认）

## 本地预览

在项目根目录启动静态服务（勿用 `file://` 直接打开，iframe 可能被拦截）：

```bash
npx --yes serve -p 5173 .
```

浏览器打开：http://localhost:5173/portal/
