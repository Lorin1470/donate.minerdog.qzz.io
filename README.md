# donate.minerdog.qzz.io

<div align="center">
  <a href="https://donate.minerdog.qzz.io" target="_blank" rel="noopener noreferrer">
    <img src="./public/logo.jpg" alt="MinerDog Logo" width="96" height="96" style="border-radius: 50%;" />
  </a>
  <h3 align="center">MinerDog 官方 Solana 贊助平台</h3>
  <p align="center">
    基於官方 <a href="https://solana.com/docs/tools/commerce-kit" target="_blank">Solana Commerce Kit</a> 打造的快速、低手續費、鏈上透明去中心化贊助網站。
  </p>
  <p align="center">
    <a href="https://donate.minerdog.qzz.io">🌐 線上贊助站點</a> •
    <a href="https://minerdog.qzz.io">🐕 MinerDog 主站</a> •
    <a href="https://github.com/Lorin1470/donate.minerdog.qzz.io">📦 GitHub 源碼</a>
  </p>
</div>

---

## 🌟 核心功能特色 (Features)

- **⚡ 官方 Solana Commerce Kit 集成**：使用 `@solana-commerce/kit` 原生 `PaymentButton`，內建支援 Wallet Standard 錢包連線及 Solana Pay QR Code 行動掃描支付。
- **💰 多幣種自由贊助 (Tip Mode)**：支援原生 **SOL** 以及主流穩定幣 **USDC**、**USDT**，贊助者可自由輸入金額支持。
- **🔍 即時鏈上查詢 (Solscan)**：交易成功後自動跳出感謝彈窗 (`ThankYouModal`)，並提供直達 [Solscan](https://solscan.io) 鏈上紀錄的交易連結（自動適配主網與測試網）。
- **🧭 測試網路警示徽章 (`NetworkBadge`)**：當系統運行於 `devnet` 時，右上角自動展示動態呼吸燈徽章，防止測試網與主網環境混淆。
- **🛡️ 零私鑰設計與安全提示**：純客戶端僅需讀取收款公開地址（Public Key），不接觸任何私鑰。若未配置錢包地址，頁面將貼心提示配置指引。
- **🎨 現代科技感 UI 與品牌動效**：
  - Tailwind CSS v4 打造 Solana 經典紫綠漸變（`#9945FF` ~ `#14F195`）與暗黑質感網格背景。
  - 頂部連回 MinerDog 主站的專屬霓虹動態文字（Google Font Outfit）與頭像懸停旋轉微互動。
- **📱 完整響應式與 PWA/Favicon 規範**：支援全套設備圖示（`favicon.ico`, `apple-touch-icon`, `svg`）與 Open Graph / Twitter 社群預覽卡片。
- **🧪 完整自動化測試與驗證套件**：內建 Devnet 端到端 (E2E) 支付驗證腳本與生產環境 Headless Chrome 監控測試。

---

## 🛠️ 技術棧 (Tech Stack)

| 領域 | 技術 / 套件 | 說明 |
|---|---|---|
| **前端框架** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | 核心 UI 開發語言與框架 |
| **建置工具** | [Vite 6](https://vitejs.dev/) | 現代化極速前端構建工具 |
| **支付核心** | [@solana-commerce/kit](https://solana.com/docs/tools/commerce-kit) | Solana 官方商業支付組件 |
| **狀態與查詢** | [@tanstack/react-query](https://tanstack.com/query) | 異步狀態管理與請求緩存 |
| **樣式系統** | [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/vite` | 現代效能優化 CSS 引擎與主題定義 |
| **雲端部署** | [Cloudflare Pages](https://pages.cloudflare.com/) | 全球邊緣網路託管與 SPA 路由重定向 |

---

## 📂 專案目錄結構 (Project Structure)

```text
donate.minerdog.qzz.io/
├── public/                     # 靜態資源
│   ├── _redirects              # Cloudflare Pages SPA 路由規則 (/* /index.html 200)
│   ├── donate-solana.svg       # GitHub 官方風格贊助藥丸按鈕 (Pill)
│   ├── pay-with-solana.svg     # Solana Pay 官方標準結算按鈕 (Rounded)
│   ├── donate-solana-banner.svg# GitHub README 橫幅卡片 (Banner)
│   ├── favicon.ico             # 網站圖示
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── favicon.svg
│   └── logo.jpg                # MinerDog 品牌標誌
├── scripts/                    # 自動化測試與驗證工具
│   ├── devnet-e2e.mjs          # Devnet 錢包餘額檢測與端到端支付模擬
│   └── verify-production.mjs   # Headless Chrome 正式環境站點驗證
├── src/
│   ├── components/             # UI 元件
│   │   ├── DonateSection.tsx   # 贊助核心區塊 (含 Commerce Kit PaymentButton 與回調)
│   │   ├── Header.tsx          # 頂部導覽列 (MinerDog 霓虹品牌連動 & 源碼按鈕)
│   │   ├── Footer.tsx          # 頁尾 (Solana 官方 SVG 標誌與相關連結)
│   │   ├── NetworkBadge.tsx    # Devnet 網路環境高亮提示徽章
│   │   └── ThankYouModal.tsx   # 贊助成功反饋彈窗與 Solscan 連結
│   ├── config/
│   │   └── commerce.ts         # Commerce Kit 配置中心、金鑰校驗、Solscan 網址生成
│   ├── styles/
│   │   └── index.css           # Tailwind v4 主題變數、霓虹動畫與漸層定義
│   ├── App.tsx                 # 根元件
│   ├── main.tsx                # 應用程式入口
│   └── vite-env.d.ts           # 環境變數型別定義
├── .env.example                # 環境變數範例檔
├── index.html                  # HTML 模板與 Open Graph SEO 標籤
├── package.json
├── tsconfig.json
└── vite.config.ts              # Vite 與 Tailwind 插件配置
```

---

## 🚀 快速開始 (Quick Start)

### 1. 安裝相依套件

```bash
npm install
```

### 2. 設定環境變數

複製環境變數範本並填入您的收款錢包地址：

```bash
cp .env.example .env
```

編輯 `.env` 檔案：

```env
# [必填] 接收贊助款項的 Solana 錢包公開地址 (Public Key)
VITE_MERCHANT_WALLET=你的Solana收款公鑰地址

# [選填] 網路環境: "mainnet" 或 "devnet" (預設為 mainnet)
VITE_SOLANA_NETWORK=devnet

# [選填] 自訂 RPC 端點 (建議在正式環境使用 Helius / QuickNode / Alchemy 等專屬節點)
VITE_RPC_URL=
```

### 3. 本地啟動開發環境

```bash
npm run dev
```

瀏覽器訪問 `http://localhost:5173` 即可開始測試。

### 4. 專案打包構建

```bash
npm run build
```

可透過以下指令預覽生產打包成品：

```bash
npm run preview
```

---

## ⚙️ 環境變數說明 (Environment Variables)

| 變數名稱 | 必要性 | 預設值 | 說明 |
|---|:---:|:---:|---|
| `VITE_MERCHANT_WALLET` | ✅ **必要** | 無 | 接收贊助款項的 Solana 錢包 **公開地址（Public Key）** |
| `VITE_SOLANA_NETWORK` | ❌ 選填 | `mainnet` | 連接的 Solana 網路，可設定為 `mainnet` 或 `devnet` |
| `VITE_RPC_URL` | ❌ 選填 | Solana 官方公共 RPC | 自訂 RPC 端點 URL。官方節點有速率限制，推薦高流量時配置第三方 RPC |

---

## 🧪 測試與驗證 (Testing & Verification)

專案提供了針對不同環境的自動化測試指令碼：

### 1. Devnet 測試環境流程

1. 在 `.env` 中設定 `VITE_SOLANA_NETWORK=devnet`。
2. 至 [faucet.solana.com](https://faucet.solana.com) 領取 Devnet SOL 測試幣。
3. 將 Phantom 或 Solflare 錢包切換至 **Developer Settings → Change Network → Devnet**。
4. 進行實際小額交易測試流程。

### 2. 執行自動化測試腳本

- **Devnet E2E 端到端測試**：
  ```bash
  node scripts/devnet-e2e.mjs
  ```
  自動檢查測試錢包餘額、構建 Devnet 模式並透過 Headless Chrome 模擬連線與按鈕交互。

- **生產環境站點健康驗證**：
  ```bash
  # 驗證預設站點 (https://donate.minerdog.qzz.io)
  node scripts/verify-production.mjs

  # 或驗證指定 URL
  node scripts/verify-production.mjs https://your-preview-domain.pages.dev
  ```
  該腳本會執行：
  1. HTTP 200 及 SPA `_redirects` 路由回落檢查。
  2. 啟動無頭 Chrome 檢查是否有 Console 報錯。
  3. 驗證 DOM 渲染完整度、贊助按鈕與 Commerce Kit 容器狀態。
  4. 驗證 Favicon 與標誌資源載入。

---

## 🎨 GitHub 嵌入贊助按鈕 (Embed in README)

你可以將本專案提供的官方品牌按鈕直接嵌入到你的任何 GitHub 儲存庫（如 MinerDog 主專案、外掛或開源工具）的 `README.md` 中，點擊後會直接在新視窗跳轉至本贊助收銀台：

### 1. 官方深色藥丸按鈕 (Pill Button)
<p align="left">
  <a href="https://donate.minerdog.qzz.io" target="_blank" rel="noopener noreferrer">
    <img src="https://donate.minerdog.qzz.io/donate-solana.svg" height="42" alt="Donate with Solana" />
  </a>
</p>

```markdown
<a href="https://donate.minerdog.qzz.io" target="_blank" rel="noopener noreferrer">
  <img src="https://donate.minerdog.qzz.io/donate-solana.svg" height="42" alt="Donate with Solana" />
</a>
```

### 2. Solana Pay 官方標準按鈕 (Rounded Button)
<p align="left">
  <a href="https://donate.minerdog.qzz.io" target="_blank" rel="noopener noreferrer">
    <img src="https://donate.minerdog.qzz.io/pay-with-solana.svg" height="42" alt="Pay with Solana" />
  </a>
</p>

```markdown
<a href="https://donate.minerdog.qzz.io" target="_blank" rel="noopener noreferrer">
  <img src="https://donate.minerdog.qzz.io/pay-with-solana.svg" height="42" alt="Pay with Solana" />
</a>
```

### 3. README 橫幅卡片 (Banner Card)
<p align="center">
  <a href="https://donate.minerdog.qzz.io" target="_blank" rel="noopener noreferrer">
    <img src="https://donate.minerdog.qzz.io/donate-solana-banner.svg" width="600" alt="Donate with Solana Banner" />
  </a>
</p>

```markdown
<p align="center">
  <a href="https://donate.minerdog.qzz.io" target="_blank" rel="noopener noreferrer">
    <img src="https://donate.minerdog.qzz.io/donate-solana-banner.svg" width="600" alt="Donate with Solana Banner" />
  </a>
</p>
```

---

## 🚢 部署指引 (Deployment)

本專案針對 **Cloudflare Pages** 進行了最佳化配置：

### 方式 A：透過 Cloudflare Dashboard (推薦)

1. 將本專案推送至 GitHub / GitLab。
2. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
3. 選擇專案儲存庫，填寫構建設定：
   - **Framework Preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. 在 **Environment variables** 中新增：
   - `VITE_MERCHANT_WALLET`: 你的收款錢包公開地址
   - `VITE_SOLANA_NETWORK`: `mainnet`
5. 點擊 **Save and Deploy**。
6. 在 **Custom domains** 綁定自訂網域 `donate.minerdog.qzz.io`。

### 方式 B：透過 Wrangler CLI 部署

```bash
# 1. 構建生產檔案
npm run build

# 2. 透過 Wrangler 部署至 Cloudflare Pages
npx wrangler pages deploy dist --project-name=donate-minerdog
```

> **注意**：`public/_redirects` 已經設定了 `/* /index.html 200`，確保 Cloudflare Pages 能正確處理單頁應用 (SPA) 路由。

---

## 🔒 安全性說明 (Security Best Practices)

- ✅ **純公開金鑰操作**：本站僅使用收款地址的 Base58 公鑰，**程式碼與伺服器完全不持有、亦不請求任何私鑰或助記詞**。
- ✅ **環境變數防護**：`.env` 及相關本機金鑰檔案均已加入 `.gitignore`。
- ✅ **鏈上透明可信**：每一筆贊助皆由贊助者個人錢包直接簽署並廣播至 Solana 區塊鏈，無中介代管風險。
- ⚠️ **切勿提交金鑰**：絕不可將任何私鑰（Private Key）、助記詞（Seed Phrase）或包含私鑰的 JSON 檔推送到 Git 倉庫！

---

## 📄 開源授權 (License)

本專案基於 [MIT License](LICENSE) 條款開源。
