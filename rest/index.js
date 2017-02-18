'use strict';

const electron = require('electron');
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipc;
const twitter = require('twitter');
const Key = require('../key.js');

var key = new Key();

var client = new twitter({
  consumer_key : key.consumer_key,
  consumer_secret : key.consumer_secret,
  access_token_key : key.access_token_key,
  access_token_secret : key.access_token_secret,
});

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // DEBUG
  //mainWindow.openDevTools(true);

  client.get('lists/statuses', {slug: 'aaa', owner_screen_name: 'naoc007t'}, function (error, tweet, response){
  		mainWindow.webContents.send('tweet', JSON.stringify(tweet));
  });

  setInterval(function(){client.get('lists/statuses', {slug: 'aaa', owner_screen_name: 'naoc007t'},  
			  function(error, tweet, response){
        mainWindow.webContents.send('tweet', JSON.stringify(tweet));
        });
  }, 30000);

  mainWindow.on('closed', function() {
  mainWindow = null;
  });
});
