import { app, BrowserWindow } from 'electron';
// auto-update window after saving .html, .css file (.js not working):
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const electronReload = require('electron-reload');
// const 'или import' { dialog } = require('electron');
import { screen } from 'electron';


// electronReload(__dirname);

electronReload([
  './js',
  './index.html',
  './style.css'
]);

const createWindow = (scale) => {
  // const width = Math.round(486 / scale);
  // const height = Math.round((width / 9) * 20); // сначала высчитываем пропорцию
  // const win = new BrowserWindow({
  //   width: width,
  //   height: Math.round(height / scale), // учитываем DPI масштабирование
  //   useContentSize: true
  // });

  const display = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = display.workAreaSize; // без taskbar
  // console.log(screenWidth, screenHeight);
  let scaleFactor = display.scaleFactor;
  scaleFactor = 1;
  const win = new BrowserWindow({
    center: true,
    width: Math.round(screenWidth / scaleFactor),
    height: Math.round(screenHeight / scaleFactor),
    // useContentSize: true,
    // x: 0,
    // y: 0
  });
  win.loadFile('index.html');
  if (screenHeight < screenWidth) {
    // const [currentWidth, currentHeight] = win.getSize();
    const currentHeight = win.getSize()[1];
    const newWidth = Math.round(currentHeight / 2);
    // const newWidth = screenWidth;
    win.setSize(newWidth, currentHeight);
    win.center();
  }


  // const display = screen.getPrimaryDisplay();
  // const { width: screenWidth, height: screenHeight } = display.workAreaSize; // без taskbar

  // const scaleFactor = display.scaleFactor;

  // const win = new BrowserWindow({
  //   width: Math.round(screenWidth / scaleFactor),
  //   height: Math.round(screenHeight / scaleFactor),
  //   useContentSize: true,
  //   x: 0,
  //   y: 0
  // });


  // console.log('1 Content size:', win.getContentSize());
  // console.log('1 Outer size:', win.getSize());


  // setTimeout(() => {
  //   console.log("timeout");
  // }, 150);
  // console.log('2 Content size:', win.getContentSize());
  // console.log('2 Outer size:', win.getSize());
  // console.log(win);

  // Для ПК:
  // win.maximize();
  // setTimeout(() => {
  //   if (screenHeight < screenWidth) {
  //     console.log('1 Content size:', win.getContentSize()); // 1 Content size: [ 2048, 1063 ]
  //     console.log('1 Outer size:', win.getSize()); // 1 Outer size: [ 2064, 1128 ] 

  //     const [currentWidth, currentHeight] = win.getSize();
  //     const newWidth = Math.round(currentHeight / 2.5);
  //     win.unmaximize();
  //     win.setSize(newWidth, currentHeight);
  //     win.center();
  //     // win.maximize();
  //     console.log("changing \"width\" for PC");

  //     console.log("newWidth", newWidth);
  //     console.log("currentHeight", currentHeight);
  //     // win.setContentSize(newWidth, contentHeight);
  //     console.log('2 Content size:', win.getContentSize()); // contentHeight 1063
  //     console.log('2 Outer size:', win.getSize()); // 1 Outer size: [ 2064, 1128 ] 
  //   }
  // }, 300);

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
  const scale = screen.getPrimaryDisplay().scaleFactor;
  createWindow(scale);
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(scale);
  });




  // dialog.showMessageBoxSync({
  //   message: 'Hello!',
  //   type: 'info'
  // });
});

// Quit the app when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});
