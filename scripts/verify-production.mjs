import { spawn } from "child_process";

const TARGET_URL = process.argv[2] || "https://donate.minerdog.qzz.io";
const DEBUG_PORT = 9330 + Math.floor(Math.random() * 50);

console.log("==================================================");
console.log(" Solana Donate — Production Verification Harness");
console.log("==================================================");
console.log(`Target: ${TARGET_URL}\n`);

// 1. Check HTTP reachability
console.log("[1/6] Checking HTTP & SPA _redirects status...");
try {
  const rootRes = await fetch(TARGET_URL);
  console.log(`  Root status: ${rootRes.status} ${rootRes.statusText}`);
  if (rootRes.status !== 200) {
    console.warn(`  ⚠️ Warning: Root URL returned non-200 status (${rootRes.status})`);
  } else {
    console.log("  ✅ Root URL accessible (HTTP 200)");
  }

  // Test SPA fallback
  const spaRes = await fetch(`${TARGET_URL}/test-spa-fallback-${Date.now()}`);
  console.log(`  SPA fallback test status: ${spaRes.status}`);
  if (spaRes.status === 200) {
    console.log("  ✅ _redirects SPA fallback working properly (HTTP 200)");
  } else {
    console.warn(`  ⚠️ SPA fallback returned status ${spaRes.status}`);
  }
} catch (err) {
  console.error(`  ❌ Failed to reach ${TARGET_URL}: ${err.message}`);
}

// 2. Launch Chrome Headless
console.log("\n[2/6] Launching Headless Chrome for DOM & Console validation...");
const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${DEBUG_PORT}`,
    "--no-first-run",
    "--no-default-browser-check",
    TARGET_URL
  ],
  { stdio: "ignore" }
);

await new Promise(r => setTimeout(r, 2500));

try {
  const tabsRes = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`);
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === "page");
  if (!pageTab) throw new Error("No Chrome page tab available");

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let reqId = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = reqId++;
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

  const consoleErrors = [];
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
      consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(" "));
    }
    if (msg.method === "Runtime.exceptionThrown") {
      consoleErrors.push(msg.params.exceptionDetails.text);
    }
  });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("DOM.enable");
  await send("Page.navigate", { url: TARGET_URL });

  // Wait for initial render (up to 8s)
  for (let i = 0; i < 16; i++) {
    const check = await send("Runtime.evaluate", {
      expression: "document.querySelectorAll('button').length > 0",
      returnByValue: true
    });
    if (check.result && check.result.value) break;
    await new Promise(r => setTimeout(r, 500));
  }

  // 3. Evaluate page state
  console.log("\n[3/6] Inspecting Mainnet status & UI elements...");
  const pageState = await send("Runtime.evaluate", {
    expression: `(() => {
      const bodyText = document.body.innerText;
      const isDevnetBadge = bodyText.includes("Devnet") || document.querySelector(".bg-amber-500") !== null;
      const title = document.title;
      const buttons = Array.from(document.querySelectorAll("button")).map(b => b.innerText.trim());
      const hasCommerceKitButton = buttons.some(b => b.toLowerCase().includes("tip")) ||
                                  document.querySelector("iframe") !== null ||
                                  document.querySelector("[data-commerce-kit]") !== null;
      const walletMissingCard = bodyText.includes("Wallet Not Configured");
      return {
        title,
        isDevnetBadge,
        buttons,
        hasCommerceKitButton,
        walletMissingCard,
        url: window.location.href
      };
    })()`,
    returnByValue: true
  });

  console.log("  Page title:", pageState.result.value.title);
  console.log("  Buttons found:", pageState.result.value.buttons);
  console.log("  Devnet badge active:", pageState.result.value.isDevnetBadge ? "YES (Devnet)" : "NO (Mainnet)");
  console.log("  Wallet missing warning:", pageState.result.value.walletMissingCard ? "YES (Need VITE_MERCHANT_WALLET)" : "NO (Configured)");
  console.log("  Commerce Kit button rendered:", pageState.result.value.hasCommerceKitButton ? "YES ✅" : "NO ❌");

  // 4. Responsive Viewport Checks
  console.log("\n[4/6] Checking Desktop & Mobile Responsive layout...");
  // Desktop
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 500));
  const desktopOverflow = await send("Runtime.evaluate", {
    expression: "document.documentElement.scrollWidth <= window.innerWidth",
    returnByValue: true
  });
  console.log(`  Desktop layout (1280x800) overflow-free: ${desktopOverflow.result.value ? "✅ PASS" : "⚠️ Overflow detected"}`);

  // Mobile
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));
  const mobileOverflow = await send("Runtime.evaluate", {
    expression: "document.documentElement.scrollWidth <= window.innerWidth",
    returnByValue: true
  });
  console.log(`  Mobile layout (390x844) overflow-free: ${mobileOverflow.result.value ? "✅ PASS" : "⚠️ Overflow detected"}`);

  // 5. Check Console Errors
  console.log("\n[5/6] Checking Console Runtime Errors...");
  if (consoleErrors.length === 0) {
    console.log("  ✅ Zero runtime errors in console!");
  } else {
    console.warn("  ⚠️ Console errors detected:");
    consoleErrors.forEach(err => console.warn(`     - ${err}`));
  }

  // 6. Test PaymentButton Click (Modal opens)
  console.log("\n[6/6] Testing PaymentButton interaction (click)...");
  const clickResult = await send("Runtime.evaluate", {
    expression: `(() => {
      const tipBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.trim().toLowerCase() === "tip");
      if (tipBtn) {
        tipBtn.click();
        return "Clicked Tip button";
      }
      return "Tip button not found";
    })()`,
    returnByValue: true
  });
  console.log("  Interaction result:", clickResult.result.value);

  await new Promise(r => setTimeout(r, 2000));

  const modalState = await send("Runtime.evaluate", {
    expression: `(() => {
      const iframes = Array.from(document.querySelectorAll("iframe")).map(i => i.src);
      const modals = document.querySelectorAll("[role='dialog'], [data-state='open']");
      return {
        iframesCount: iframes.length,
        hasDrawerOrDialog: modals.length > 0 || iframes.length > 0
      };
    })()`,
    returnByValue: true
  });
  console.log(`  Official Payment Drawer/Iframe mounted: ${modalState.result.value.hasDrawerOrDialog ? "✅ PASS" : "⚠️ Not opened"}`);

  console.log("\n==================================================");
  console.log(" Production Verification Complete!");
  console.log("==================================================");

  ws.close();
} finally {
  chrome.kill();
}
