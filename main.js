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
       
    mainWindow.loadURL(url.format({
        pathname: path.join('mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    
    document.querySelector("#minWindow").click = function(e){

             mainWindow.minimize();
             };
     document.querySelector("#maxWindow").onchange = function(e){
            // var window = BrowserWindow.getFocusedWindow();
             mainWindow.maximize();
             };
     document.querySelector("#exit").onchange = function(e){
             //var window = BrowserWindow.getFocusedWindow();
             mainWindow.close();
             };
    
})
