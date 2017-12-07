/**
 * Created by chotoxautinh on 6/1/17.
 */
const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron');
const math = require('mathjs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, loadingScreen;
const Store = require('electron-store');
const store = new Store();

// const list_university = require('./data/university');
let list_branch, list_block, list_major, list_university;

const preprocess_data = () => {
    store.clear();

    list_branch = store.get('list_branch');
    if (!list_branch) {
        list_branch = require('./data/branch');
        store.set('list_branch', list_branch);
    }

    list_block = store.get('list_block');
    if (!list_block) {
        list_block = require('./data/block');
        store.set('list_block', list_block);
    }

    list_major = store.get('list_major');
    if (!list_major) {
        list_major = require('./data/major');
        store.set('list_major', list_major);
    }

    list_university = store.get('list_university');
    if (!list_major) {
        list_major = require('./data/university');
        store.set('list_university', list_university);
    }
}

const range = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 500, height: 500,
        // resizable: false,
        show: false,
        frame: false,
        icon: path.join(__dirname, '/../public/icon/png/logo.png')
    })

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.setFullScreen(true);
        mainWindow.show();

        if (loadingScreen) {
            const loadingScreenBounds = loadingScreen.getBounds();
            mainWindow.setBounds(loadingScreenBounds);
            loadingScreen.close();
        }
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

const createLoadingScreen = () => {
    loadingScreen = new BrowserWindow({
        width: 500,
        height: 500,
        resizable: false,
        show: false,
        frame: false,
        icon: path.join(__dirname, '/../public/icon/png/logo.png'),
        parent: mainWindow
    });
    const url = process.env.ELECTRON_START_URL ? path.join(__dirname, '/../public/loading.html') : path.join(__dirname, '/../build/loading.html')
    loadingScreen.loadURL('file://' + url);
    loadingScreen.on('closed', () => loadingScreen = null);
    loadingScreen.webContents.on('did-finish-load', () => {
        loadingScreen.show();
    });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createLoadingScreen();
    preprocess_data();
    createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // if (process.platform !== 'darwin') {
    app.quit();
    // }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('recommend', (event, param) => {
    const matrix = list_major.map(major => {
        const distance = param.total - Number(major.diem_chuan);
        const x1 = distance < 0 ? (1 + 5 * distance / 30) : (1 - distance / 30);
        const x2 = 0.4 * Number(major.chi_tieu_nganh) / Number(major.chi_tieu_truong) * Number(major.diem_chuan) / Number(major.diem_san) + 0.6 * param.total / Number(major.diem_chuan);
        const x3 = (param.branch == major.branch) ? 1 : 0;
        const x4 = (major.khoi_thi.indexOf(param.block) == -1) ? 0 : 1;
        return [0.15 * x1, 0.05 * x2, 0.3 * x3, 0.5 * x4];
    });

    const a_star = matrix.map(vector => math.max(vector));

    const s_star = matrix.map((vector, i) => {
        const v_star = a_star[i];
        const result = vector.reduce((v) => Math.pow((v - v_star), 2), 0);
        return Math.sqrt(result);
    });

    let indices = range(0, list_major.length - 1);
    indices.sort((a, b) => s_star[a] - s_star[b]);

    const result = indices.map((major_index, sort_index) => Object.assign({}, list_major[major_index], {
        key: sort_index + 1,
        ten_truong: list_university[list_major[major_index].ma_truong]
    }));

    event.sender.send('recommend-response', result);
})