const {app, BrowserWindow, ipcMain, screen} = require("electron");
const httpServer = require("http-server")
const DEV = process.env.DEV
app.on("ready", () => {
  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  const window = new BrowserWindow({
    webPreferences: {
      webSecurity: false,
      contextIsolation: false,
      nodeIntegration: true,


    },
    show: false,
    frame: false,
    width: Math.floor(screenSize.width * 0.7),
    height: Math.floor(screenSize.height * 0.7),
    resizable: true,
    minWidth: 750,
    minHeight: 500,
    maximizable: true
  });
  // window.setSize(screenSize.width * 0.7,screenSize.height * 0.7)
  let port = 7755;
  if (!DEV) {
    while (true) {
      try {
        httpServer.createServer().listen(port);
        break
      } catch (e) {
        port++
      }
    }
  }
  console.log("use port " + port)
  window.loadURL("http://127.0.0.1:" + port).then(() => {
    window.show();
    DEV && window.webContents.openDevTools({mode: "detach"})
  });
  ipcMain.on("minimize", event => {
    BrowserWindow.fromWebContents(event.sender).minimize();
  })
  ipcMain.on("maximize", event => {
    const window = BrowserWindow.fromWebContents(event.sender)
    window.isMaximized() ? window.restore() : window.maximize();
  })
})
