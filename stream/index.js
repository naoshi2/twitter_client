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
  mainWindow = new BrowserWindow({width: 960, height: 1080});
  mainWindow.setPosition(2880,0);
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // DEBUG
  //mainWindow.openDevTools(true);

  client.stream('user',   function(stream){
  //client.stream('statuses/sample',   function(stream){
  //client.stream('statuses/filter',  {track: '#trump'}, function(stream){
      stream.on('data', function(tweet) {
      mainWindow.webContents.send('tweet', JSON.stringify(tweet));
    });

    stream.on('error', function(error) {
      console.log(error);
    });
  });

  mainWindow.on('closed', function() {
  mainWindow = null;
  });
});
