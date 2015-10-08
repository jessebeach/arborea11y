"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById('loadAXTreeButton');
  button.addEventListener('click', function () {
    let button = event.target;
    Tabs.getCurrent().then(function(tabInfo) {
      chrome.runtime.sendMessage(
        {
          action: 'replace',
          tabId: tabInfo.id
        }
      );
    });
  }, false);
});
