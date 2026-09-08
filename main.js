const {app, BrowserWindow, shell} = require('electron');
const path = require('path');

let win = null;

function createWindow(){
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 940,
    minHeight: 600,
    backgroundColor: '#0d1117',
    autoHideMenuBar: true,
    title: 'Soundboard Live',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  // Open external links in the default browser instead of a new Electron window
  win.webContents.setWindowOpenHandler(({url}) => {
    shell.openExternal(url);
    return {action: 'deny'};
  });

  win.on('closed', () => { win = null; });
}

app.whenReady().then(() => {
  // macOS: use our logo as the dock icon during development (packaged apps
  // get the icon automatically from build/icon.png via electron-builder)
  if (process.platform === 'darwin' && app.dock) {
    app.dock.setIcon(path.join(__dirname, 'build', 'icon.png'));
  }
  createWindow();
  app.on('activate', () => {
    // macOS: re-create window when dock icon is clicked with no windows open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // macOS convention: keep app running until Cmd+Q
  if (process.platform !== 'darwin') app.quit();
});