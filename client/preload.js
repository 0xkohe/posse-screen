const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setroomId: (roomId) => ipcRenderer.send("roomId", roomId),
});
