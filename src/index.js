const { app, BrowserWindow, ipcMain } = require("electron");
const express = require("express");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const path = require("path");
const server = express();
const PORT = 3000;

// Configuración del puerto serie
const port = new SerialPort({ path: "COM9", baudRate: 19200 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// Crear ventana de Electron
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(path.join(__dirname, "./index.html"));

  // Configuración para enviar y recibir datos del puerto serie
  setInterval(() => {
    port.write(" ", (err) => {
      if (err) {
        console.log("Error al enviar un espacio:", err.message);
      } else {
        console.log("Espacio enviado al puerto serie.");
      }
    });

    parser.on("data", (data) => {
      console.log("Datos recibidos:", data);
      win.webContents.send("serialData", data);
    });
  }, 20000);
}

// Configuración del servidor Express
server.get("/", (req, res) => {
  res.send("¡Hola desde Express y Electron!");
});

server.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});

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
