const { app, BrowserWindow } = require("electron");
const express = require("express");
const server = express();
const PORT = 3000;

// Configuración del servidor Express
server.get("/", (req, res) => {
  res.send("¡Hola desde Express y Electron!");
});

server.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});

// Crear ventana de Electron
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
