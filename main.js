const {app, BrowserWindow, ipcMain, screen, nativeTheme} = require("electron");
const httpServer = require("http-server")
const axios = require("axios");
const path = require("path");
const open = require("open");
const DEV = process.env.DEV
app.on("ready", () => {
  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  let loadingWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false,
      contextIsolation: false,
      nodeIntegration: true,
    },
    show: false,
    frame: false,
    width: 600,
    height: 400,
    resizable: false,
    closable: false,
  });
  loadingWindow.loadFile(path.join(process.cwd(), DEV ? "loading.html" : './resources/loading.html')).then(() => {
    setTimeout(() => loadingWindow.center(), 500)
    loadingWindow.setPosition(-599, -399)
    loadingWindow.show();
    // DEV && loadingWindow.webContents.openDevTools({mode: "detach"});
  })

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
    minWidth: 500,
    minHeight: 600,
    maximizable: true,
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#121212" : "#fff"
  });
  // window.setSize(screenSize.width * 0.7,screenSize.height * 0.7)
  let port = 7755;
  if (!DEV) {
    while (true) {
      try {
        httpServer.createServer({root: "./resources/webDist/"}).listen(port);
        break
      } catch (e) {
        port++
      }
    }
  }
  console.log("use port " + port);
  window.loadURL("http://127.0.0.1:" + port + "/startup").then(() => {
    loadingWindow.setClosable(true);

    window.setPosition(-window.getSize()[0] + 1, -window.getSize()[1] + 1);
    window.show();
    setTimeout(() => {
      window.center();
      loadingWindow.setPosition(-999, -999)
      loadingWindow.close()
    }, 500)


    DEV &&
    window.webContents.openDevTools({mode: "detach"})
  });
  window.webContents.on("will-navigate", ((event, url) => {
    if (!url.includes("127.0.0.1:" + port)) {
      open(url);
      event.preventDefault();
      window.webContents.send("will-open-url")
    }
  }))
  ipcMain.on("minimize", event => {
    BrowserWindow.fromWebContents(event.sender).minimize();
  })
  ipcMain.on("maximize", event => {
    const window = BrowserWindow.fromWebContents(event.sender)
    window.isMaximized() ? window.restore() : window.maximize();
  })
  ipcMain.on('function-views', async (event, args) => {
    let count = 0;
    let running = 0;
    let timeout = 250;

    function run() {
      running++;
      axios.get(`https://api.codemao.cn/web/forums/posts/${args.target}/details`, {timeout}).then(() => {
        running--;
        count++;


      }).catch(() => {
        running--
        if (timeout <= 3e3) {
          timeout += 1;
          console.log("Change timeout:", timeout)
        }

      });
    }

    ipcMain.once("function-views" + args.id + "cancel", () => {
      count = args.times;
      console.log("canceled");
      clearInterval(clock);
    })
    const updateProcess =()=>{
      event.sender.send("function-views" + args.id, {process: Math.floor((count / args.times) * 100)})
    }
    const clock = setInterval(updateProcess,5e2)
    while (count < args.times) {
      if (running < args.maxRunning) {
        run()
      }
      await new Promise(r => setTimeout(r, 1))
    }
    updateProcess();
    clearInterval(clock);
  })
})
