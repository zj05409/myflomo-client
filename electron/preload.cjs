const { contextBridge, ipcRenderer } = require('electron');

// 在这里可以暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electron', {
    // 示例：添加一个安全的 API
    sendMessage: (message) => ipcRenderer.send('message', message),
    onMessage: (callback) => ipcRenderer.on('message', callback)
}); 