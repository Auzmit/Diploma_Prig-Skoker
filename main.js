import { app, BrowserWindow, screen } from 'electron';
// import { ipcMain } from 'electron';
// auto-update window after saving .html, .css file (.js not working):
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const electronReload = require('electron-reload');

electronReload([
  './js',
  './index.html',
  './style.css'
]);

// ipcMain.handle('get-primary-display', () => {
//   return screen.getPrimaryDisplay().workAreaSize;
// });

const createWindow = () => {
  // без taskbar:
  const display = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = display.workAreaSize;
 
  const win = new BrowserWindow({
    center: true,
    width: Math.floor(screenWidth),
    height: Math.floor(screenHeight),
    // useContentSize: true,
  });
  win.loadFile('index.html');
  if (screenHeight < screenWidth) {
    const currentHeight = win.getSize()[1];
    const newWidth = Math.round(currentHeight / 2);
    // const newWidth = screenWidth;
    win.setSize(newWidth, currentHeight);
    win.center();
  }

  // Передаём ширину и высоту окна на renderer
  // (у меня это просто обычные js файлы):
  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(`
      window.screenData = {
        width: ${screen.getPrimaryDisplay().workAreaSize.width},
        height: ${screen.getPrimaryDisplay().workAreaSize.height}
      };
    `);
  });
};

// Open a window if none are open (macOS)
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit the app when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});
