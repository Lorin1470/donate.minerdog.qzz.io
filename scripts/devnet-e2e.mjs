import { spawn } from "child_process";
import fs from "fs";

// 1. Load test wallet info
const walletInfo = JSON.parse(fs.readFileSync("./test-devnet-wallet.json", "utf-8"));
const { address: payerAddress, seed } = walletInfo;

console.log("==================================================");
console.log(" Solana Donate Site — Devnet E2E Test Harness");
console.log("==================================================");
console.log("Test Payer Address:", payerAddress);

// 2. Check balance on Solana Devnet
const rpcUrl = "https://api.devnet.solana.com";
const balanceRes = await fetch(rpcUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "getBalance",
    params: [payerAddress]
  })
});
const balanceJson = await balanceRes.json();
const balanceLamports = balanceJson.result?.value ?? 0;
const balanceSol = balanceLamports / 1e9;
console.log(`Current Balance: ${balanceSol} SOL (${balanceLamports} lamports)`);

if (balanceLamports < 5000000) { // needs at least 0.005 SOL
  console.log("\n❌ Devnet test wallet has insufficient funds.");
  console.log("Please airdrop or transfer at least 0.005 SOL to:");
  console.log(`--> ${payerAddress} <--`);
  console.log("Via: https://faucet.solana.com or send from a devnet wallet\n");
  process.exit(2);
}

// 3. Build & Preview
console.log("\n--> Building production bundle with Devnet configuration...");
const buildProc = spawn("npm", ["run", "build"], {
  env: {
    ...process.env,
    VITE_MERCHANT_WALLET: "DYFuYpBTi6Eng5YwvEFjvT6sTMMezfuJM2aynzMh2LVg", // Devnet recipient
    VITE_SOLANA_NETWORK: "devnet"
  },
  stdio: "inherit"
});

await new Promise((res, rej) => {
  buildProc.on("close", code => code === 0 ? res() : rej(new Error("Build failed")));
});

console.log("--> Starting Vite preview server...");
const preview = spawn("npx", ["vite", "preview", "--port", "5199"], {
  stdio: "pipe"
});

await new Promise(r => setTimeout(r, 2000));

// 4. Launch Chrome
console.log("--> Launching Chrome in headless mode...");
const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  [
    "--headless=new",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "http://localhost:5199/"
  ],
  { stdio: "ignore" }
);

await new Promise(r => setTimeout(r, 2000));

try {
  const tabsRes = await fetch("http://127.0.0.1:9222/json");
  const tabs = await tabsRes.json();
  const mainTab = tabs.find(t => t.url.includes("5199"));
  if (!mainTab) throw new Error("Could not find Chrome tab");

  const wsMain = new WebSocket(mainTab.webSocketDebuggerUrl);
  await new Promise(r => wsMain.onopen = r);

  const sendWs = (ws, method, params = {}) => new Promise((resolve) => {
    const id = Math.floor(Math.random() * 10000);
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener("message", handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  wsMain.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.consoleAPICalled") {
      console.log(`[MAIN BROWSER]:`, msg.params.args.map(a => a.value || a.description).join(" "));
    }
  });

  await sendWs(wsMain, "Runtime.enable");
  await sendWs(wsMain, "Page.enable");
  await sendWs(wsMain, "DOM.enable");

  // Inject Wallet Standard with real Ed25519 signing using test keypair
  console.log("--> Registering Standard Wallet with real keypair in browser...");
  await sendWs(wsMain, "Runtime.evaluate", {
    expression: `
      (async () => {
        const seedBytes = new Uint8Array(${JSON.stringify(seed)});
        const payerAddr = "${payerAddress}";
        
        // Import Ed25519 private key
        const pkcs8 = new Uint8Array([48, 46, 2, 1, 0, 48, 5, 6, 3, 43, 101, 112, 4, 34, 4, 32, ...seedBytes]);
        const privateKey = await crypto.subtle.importKey("pkcs8", pkcs8, { name: "Ed25519" }, true, ["sign"]);

        const mockWallet = {
          version: "1.0.0",
          name: "Devnet Test Wallet",
          icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%2314F195'/></svg>",
          chains: ["solana:devnet", "solana:mainnet"],
          features: {
            "standard:connect": {
              version: "1.0.0",
              connect: async () => ({
                accounts: [{
                  address: payerAddr,
                  publicKey: seedBytes.slice(0, 32),
                  chains: ["solana:devnet", "solana:mainnet"],
                  features: ["solana:signTransaction"]
                }]
              })
            },
            "standard:disconnect": {
              version: "1.0.0",
              disconnect: async () => {}
            },
            "standard:events": {
              version: "1.0.0",
              on: (event, listener) => () => {}
            },
            "solana:signTransaction": {
              version: "1.0.0",
              supportedTransactionVersions: ["legacy", 0],
              signTransaction: async ({ account, transaction }) => {
                console.log("[MockWallet] Received transaction for signing!");
                // Extract messageBytes: offset 1 + 64 * signaturesCount
                const signaturesCount = transaction[0];
                const messageOffset = 1 + signaturesCount * 64;
                const messageBytes = transaction.slice(messageOffset);
                const signature = new Uint8Array(await crypto.subtle.sign({ name: "Ed25519" }, privateKey, messageBytes));
                
                const signed = new Uint8Array(transaction.length);
                signed.set(transaction);
                signed.set(signature, 1); // place in first signature slot
                console.log("[MockWallet] Signed transaction successfully!");
                return [{ signedTransaction: signed }];
              }
            }
          }
        };

        window.addEventListener("wallet-standard:app-ready", ({ detail: api }) => api.register(mockWallet));
        window.dispatchEvent(new CustomEvent("wallet-standard:register-wallet", {
          detail: (api) => api.register(mockWallet)
        }));
      })();
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  // Click Tip Button on main page
  console.log("--> Clicking Tip Button on main page...");
  await sendWs(wsMain, "Runtime.evaluate", {
    expression: `document.querySelector('button')?.click();`
  });

  await new Promise(r => setTimeout(r, 2000));

  // Find the iframe target
  console.log("--> Locating Commerce Kit iframe...");
  const currentTabs = await (await fetch("http://127.0.0.1:9222/json")).json();
  const iframeTab = currentTabs.find(t => t.type === "iframe" || t.url.includes("about:srcdoc"));
  if (!iframeTab) {
    throw new Error("Commerce Kit modal iframe not found!");
  }

  const wsIframe = new WebSocket(iframeTab.webSocketDebuggerUrl);
  await new Promise(r => wsIframe.onopen = r);
  await sendWs(wsIframe, "Runtime.enable");

  wsIframe.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.consoleAPICalled") {
      console.log(`[IFRAME]:`, msg.params.args.map(a => a.value || a.description).join(" "));
    }
  });

  // Step 1: In iframe, click Wallet payment method
  console.log("--> In iframe: Selecting 'Wallet' payment method...");
  await sendWs(wsIframe, "Runtime.evaluate", {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const walletRadio = btns.find(b => b.innerText && b.innerText.includes("Wallet"));
        if (walletRadio) walletRadio.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 500));

  // Step 2: In iframe, click Pay action button
  console.log("--> In iframe: Clicking Pay action button...");
  await sendWs(wsIframe, "Runtime.evaluate", {
    expression: `
      (() => {
        const payBtn = document.querySelector(".ck-action-button");
        if (payBtn) payBtn.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  // Step 3: In iframe, select and connect the Devnet Test Wallet
  console.log("--> In iframe: Selecting Devnet Test Wallet to connect and sign...");
  await sendWs(wsIframe, "Runtime.evaluate", {
    expression: `
      (() => {
        const btn = document.querySelector(".ck-wallet-connect-button") ||
          Array.from(document.querySelectorAll("button")).find(b => b.innerText && b.innerText.includes("Connect"));
        if (btn) btn.click();
      })()
    `
  });

  // Poll for ThankYouModal on main page
  console.log("--> Waiting for on-chain confirmation & ThankYouModal...");
  let realSignature = null;

  for (let i = 0; i < 45; i++) {
    const modalCheck = await sendWs(wsMain, "Runtime.evaluate", {
      expression: `
        (() => {
          const modal = document.querySelector('.fixed.inset-0');
          if (!modal) return null;
          const link = modal.querySelector('a');
          return {
            hasModal: true,
            href: link ? link.getAttribute('href') : null
          };
        })()
      `,
      returnByValue: true
    });

    const result = modalCheck?.result?.value;
    if (result && result.href && result.href.includes("/tx/")) {
      const match = result.href.match(/tx\/([^?]+)/);
      realSignature = match ? match[1] : null;
      console.log("--> Found ThankYouModal with Solscan URL:", result.href);
      console.log("--> Captured REAL Signature:", realSignature);
      break;
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  if (!realSignature) {
    throw new Error("Timeout waiting for ThankYouModal or on-chain transaction confirmation");
  }

  // Verify on-chain via Devnet RPC
  console.log("--> Verifying transaction status on Solana Devnet RPC...");
  let isConfirmed = false;
  for (let attempt = 0; attempt < 10; attempt++) {
    const txStatusRes = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "getSignatureStatuses",
        params: [[realSignature]]
      })
    });
    const txStatusJson = await txStatusRes.json();
    const txStatus = txStatusJson.result?.value?.[0];
    console.log(`Devnet RPC Status (attempt ${attempt + 1}):`, txStatus);

    if (txStatus && (txStatus.confirmationStatus === "confirmed" || txStatus.confirmationStatus === "finalized")) {
      isConfirmed = true;
      break;
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  if (!isConfirmed) {
    throw new Error("Transaction signature not confirmed on Devnet!");
  }

  // Verify Done button closes the modal
  console.log("--> Clicking 'Done' button to test modal dismissal...");
  await sendWs(wsMain, "Runtime.evaluate", {
    expression: `
      (() => {
        const doneBtn = Array.from(document.querySelectorAll('.fixed.inset-0 button')).find(b => b.innerText.includes('Done'));
        if (doneBtn) doneBtn.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  const modalClosedCheck = await sendWs(wsMain, "Runtime.evaluate", {
    expression: `document.querySelector('.fixed.inset-0') === null`,
    returnByValue: true
  });
  const isModalClosed = modalClosedCheck?.result?.value;
  console.log("Modal closed successfully:", isModalClosed);

  if (!isModalClosed) {
    throw new Error("ThankYouModal was not closed after clicking Done!");
  }

  console.log("\n==================================================");
  console.log("✅ All Devnet E2E Payment Criteria Satisfied!");
  console.log("==================================================");
  console.log("[x] 真實 Wallet 連線");
  console.log("[x] 真實 Wallet 簽名 (Ed25519 subtle.sign)");
  console.log("[x] 真實 Devnet transaction 送出");
  console.log("[x] Transaction confirmed/finalized 於 Devnet RPC 查驗");
  console.log("[x] 真實 signature:", realSignature);
  console.log("[x] paymentSuccess 流程捕獲");
  console.log("[x] ThankYouModal 成功顯示");
  console.log(`[x] 真實 Solscan Devnet URL: https://solscan.io/tx/${realSignature}?cluster=devnet`);
  console.log("[x] Done 按鈕正常關閉 Modal");

} finally {
  chrome.kill();
  preview.kill();
}
