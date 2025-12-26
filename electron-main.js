const { app, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: "Smart HR Global Platform",
    backgroundColor: '#0f172a', // Matches the dark theme background
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true // Keep true for debugging, set to false for production release if desired
    },
    // icon: path.join(__dirname, 'public/favicon.ico') // Ensure you have an icon file here
  });

  win.setMenuBarVisibility(false); // Hide default menu

  // Check if we are running in development mode
  const isDev = !app.isPackaged;

  if (isDev) {
    // Load from Vite dev server
    win.loadURL('http://localhost:5173');
    // Open DevTools automatically in dev mode
    // win.webContents.openDevTools();
  } else {
    // Load the built index.html
    win.loadURL(`file://${path.join(__dirname, 'dist/index.html')}`);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});