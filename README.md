# 科创集团 · 智能决策 Demo

统一门户 + 三个业务模块演示包。

## 目录

```
portal/                      # 统一首页（顶栏三导航）
meeting-supervision-demo/    # 督查督办
safety-production-demo/      # 安全生产
docs/plans/                  # 设计说明
```

## 本地打开门户

在项目根目录启动静态服务（不要用 `file://`）：

```bash
npx --yes serve -p 5173 .
```

浏览器打开：http://localhost:5173/portal/

| 导航 | 内容 |
|------|------|
| 投资决策 | iframe 嵌入 `https://fde-demo.fineres.com:3000/` |
| 督查督办 | 嵌入督查督办 demo（可切办公室端 / 领导端） |
| 安全生产 | 嵌入安全生产看板（默认页） |

## 上传到 GitHub

目标仓库：https://github.com/jaho24/kechuang-ai

**不要上传** `meeting-supervision-demo/.env`（已在 `.gitignore` 中排除）。密钥请只留在本地，模板见 `meeting-supervision-demo/.env.example`。

在项目根目录执行：

```bash
git init -b main
git add -A
git status
# 确认没有 .env 后再提交
git commit -m "Initial commit: 科创集团智能决策门户 Demo"
git remote add origin https://github.com/jaho24/kechuang-ai.git
git push -u origin main
```

若远程已有内容，可先 `git pull origin main --rebase` 再 push；或按你们团队约定强制覆盖（需确认）。

## 子模块说明

- 督查督办：见 `meeting-supervision-demo/README.md`
- 安全生产：见 `safety-production-demo/README.md`
- 门户：见 `portal/README.md`
