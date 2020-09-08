const electron = require('electron')
const { app, BrowserWindow, Menu } = require('electron')



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  })
  
  var menu = Menu.buildFromTemplate([
      {
          label: 'File',
          submenu: [
              {
                label:'Open',
                accelerator: 'CmdOrCtrl+o',
                click: () => { win.webContents.send('mClick', 'open') }
              }, 
              {
                label:'Save',
                accelerator: 'CmdOrCtrl+s',
                click: () => { win.webContents.send('mClick', 'save') }
              }, 
              {type: 'separator'},
              {
                label:'Export current frame',
                accelerator: 'CmdOrCtrl+shift+e', 
                click: () => { win.webContents.send('mClick', 'exportOne') }               
              },
              {type: 'separator'},
              {
                label:'Export all corrections',
                accelerator: 'CmdOrCtrl+e',
                click: () => { win.webContents.send('mClick', 'exportAll') }
              }
          ]
      },
      {
         label: 'Edit',
          submenu: [              
              {
                label:'Undo',
                accelerator: 'CmdOrCtrl+z',
                click: () => { win.webContents.send('mClick', 'undo') }
              }, 
              {
                label:'Redo',
                accelerator: 'shift+z',
                click: () => { win.webContents.send('mClick', 'redo') }
              },
              {
                label:'Delete all empty comments',
                click: () => { win.webContents.send('mClick', 'deleteEmpty') }
              },
              {type: 'separator'},
              {
                label:'Preferences',
                click: () => { win.webContents.send('mClick', 'pref') }
              }
          ]
      },
      {
         label: 'Controls',
          submenu: [              
              {
                label:'Play Toggle',
                accelerator: 'Space',
                click: () => { win.webContents.send('mClick', 'play') }
              }, 
              {
                label:'Previous Frame',
                accelerator: ',',
                click: () => { win.webContents.send('mClick', 'pframe') }
              },
              {
                label:'Next Frame',
                accelerator: '.',
                click: () => { win.webContents.send('mClick', 'nframe') }
              },
              {
                label:'Previous Comment',
                accelerator: 'j',
                click: () => { win.webContents.send('mClick', 'pcomment') }
              },
              {
                label:'Next Comment',
                accelerator: 'k',
                click: () => { win.webContents.send('mClick', 'ncomment') }
              },
              {
                label:'Goto Start',
                accelerator: 'Home',
                click: () => { win.webContents.send('mClick', 'gstart') }
              },
              {
                label:'Goto End',
                accelerator: 'End',
                click: () => { win.webContents.send('mClick', 'gend') }
              }
          ]
      },
      {
         label: 'Extras',
          submenu: [
              {
                label:'Website',
                click: () => { win.webContents.send('mClick', 'website') }
              },
              {type: 'separator'},
              {
                label:'About',
                click: () => { win.webContents.send('mClick', 'about') }
              }
          ]
      }
  ])
  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  win.loadFile('index.html')

  win.maximize()
  //win.setFullScreen(true)
  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})


