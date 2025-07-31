const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveOperation: (operation) => ipcRenderer.invoke("save-operation", operation),
  getHistory: () => ipcRenderer.invoke("get-history"),
});
