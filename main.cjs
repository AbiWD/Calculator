// main.cjs
const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = !app.isPackaged; // 🔍 Checks if we're in dev mode

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
    },
  });

  if (isDev) {
    // 🚀 Development: load from Vite server
    win.loadURL("http://localhost:5173");
  } else {
    // 📦 Production: load built index.html
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  }
}

// App lifecycle
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
