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
              source: SOURCE_POPUP,
              action: ACTION_APPEND,
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
                source: SOURCE_POPUP,
                action: ACTION_REMOVE,
                tabId: tabInfo.id
              }
            );
          }
        );
      }, false);
});
