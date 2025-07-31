const { app, BrowserWindow } = require("electron");
const path = require("path");

require("./electron/ipcCalculator.cjs"); // ✅ Include IPC logic

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 620,
    resizable: true,
    maximizable: true,
    minimizable: true,
    fullscreenable: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "electron/preload.js"),
      nodeIntegration: false,
    },
  });
  console.log("Preload path:", path.join(__dirname, "electron/preload.js")); // Debug log

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
