class Tabs {
  static sendToTab(id, data) {
    chrome.tabs.sendMessage(id, data);
  }
  static getCurrent() {
    return new Promise(function(resolve, reject) {
      chrome.windows.getAll({'populate': true}, function(windows) {
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
}
