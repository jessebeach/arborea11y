"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById('loadAXTreeButton');
  button.addEventListener('click', function () {
    let button = event.target;
    Tabs.getCurrent().then(
      // Success.
      function(tabInfo) {
        chrome.runtime.sendMessage(
          {
            source: 'popup',
            action: 'append',
            tabId: tabInfo.id
          }
        );
      }
    );
  }, false);
});
