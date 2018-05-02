const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow } = electron


let mainWindow = null

app.on('ready', function(){
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        resizable: true,
        backgroundColor: '#21363d',
        frame: false,
    

    });
    
    mainWindow.loadURL(`file://${__dirname}/mainWindow.html`)
       
   /* mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'mainWindow.html'),
        protocol: 'file:',
        slashes: true,
    }));    */
    
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    
});
