const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow } = electron


let mainWindow = null

app.on('ready', function(){
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 725,
        resizable: true,
        transparent: true,
    
        
    
    });
       
    mainWindow.loadURL(url.format({
        pathname: path.join('mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    
})
