"use strict";

class Tabs {
  static sendTo(id, data) {
    chrome.tabs.sendMessage(id, data);
  }
  static sendToCurrent(data) {
    chrome.tabs.getCurrent(function(tabInfo) {
      console.log(arguments);
      chrome.tabs.sendMessage(tabInfo.id, data);
    });
  }
  static sendToAll(data) {
    chrome.windows.getAll({
      'populate': true
    }, function(windows) {
      for (var i = 0; i < windows.length; i++) {
        var tabs = windows[i].tabs;
        for (var j = 0; j < tabs.length; j++) {
          chrome.tabs.sendMessage(
              tabs[j].id,
              {data: data});
        }
      }
    });
  }
  static getCurrent() {
    return new Promise(function(resolve, reject) {
      chrome.windows.getAll({
        'populate': true}, function(windows) {
        for (var i = 0; i < windows.length; i++) {
          var tabs = windows[i].tabs;
          var currentTab;
          for (var tab of tabs) {
            if (tab.selected && tab.active) {
              currentTab = tab;
              break;
            }
          }
          if (currentTab) {
            resolve(currentTab);
          } else {
            reject();
          }
        }
      });
    });
  }
  static loadScriptsInAll(scriptPaths) {
    scriptPaths = scriptPaths || [];
    chrome.windows.getAll({
      'populate': true
    }, function(windows) {
      for (var win of windows) {
        for (var tab of win.tabs) {
          for (var path of scriptPaths) {
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
