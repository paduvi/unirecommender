/**
 * Created by chotoxautinh on 6/1/17.
 */
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const {ipcMain} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, loadingScreen;
const Store = require('electron-store');
const store = new Store();

// const list_university = require('./data/university');
let list_branch, list_block;

const preprocess_data = () => {
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

    // Object.assign(store, ...list_university.map(university => ({
    //     [university.id]: university
    // })));
    // console.log(store);
}

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 700, height: 700,
        resizable: false,
        show: false,
        // frame: false,
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
        mainWindow.show();

        if (loadingScreen) {
            let loadingScreenBounds = loadingScreen.getBounds();
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
        width: 700,
        height: 700,
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
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('recommend', (event, param) => {
    const data = [{
        key: '1',
        id: 'BKA',
        name: 'Đại Học Bách Khoa Hà Nội',
        count: 3
    }, {
        key: '2',
        id: 'QHI',
        name: 'Đại Học Công Nghệ – Đại Học Quốc Gia Hà Nội',
        count: 2
    }, {
        key: '3',
        id: 'KHA',
        name: 'Đại Học Kinh Tế Quốc Dân',
        count: 4
    }];

    event.sender.send('recommend-response', data);
})