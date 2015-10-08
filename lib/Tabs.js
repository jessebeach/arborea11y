'use strict';

class Tabs {
  static get() {
    return new Promise(function(resolve, reject) {
      chrome.tabs.query({
        currentWindow: true
      }, function (tabs) {
        if (tabs) {
          resolve(tabs);
        } else {
          reject('No Tabs available.');
        }
      });
    });
  }
  static getCurrent() {
    return new Promise(function(resolve, reject) {
      chrome.tabs.query({
        currentWindow: true,
        active: true
      }, function (tabs) {
        if (tabs[0]) {
          resolve(tabs[0]);
        } else {
          reject('No current Tab available.');
        }
      });
    });
  }
  static sendTo(id, data) {
    chrome.tabs.sendMessage(id, data);
  }
  static sendToCurrent(data) {
    Tabs.getCurrent().then(
      function(tabInfo) {
        chrome.tabs.sendMessage(tabInfo.id, data);
      }
    );
  }
  static sendToAll(data) {
    Tabs.get().then(function(tabs) {
      for (let tab of tabs) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            data: data
          }
        );
      }
    });
  }
  static loadScriptsInAll(scriptPaths) {
    scriptPaths = scriptPaths || [];
    chrome.windows.getAll({
      'populate': true
    }, function(windows) {
      for (let win of windows) {
        for (let tab of win.tabs) {
          for (let path of scriptPaths) {
            chrome.tabs.executeScript(
              tab.id,
              {
                file: path,
                allFrames: true
              }
            );
          }
        }
      }
    });
  }
}
