'use strict';

document.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById('loadAXTreeButton')
    .addEventListener('click', function () {
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
    document
      .getElementById('removeAXTreeButton')
      .addEventListener('click', function () {
        let button = event.target;
        Tabs.getCurrent().then(
          // Success.
          function(tabInfo) {
            chrome.runtime.sendMessage(
              {
                source: 'popup',
                action: 'remove',
                tabId: tabInfo.id
              }
            );
          }
        );
      }, false);
});
