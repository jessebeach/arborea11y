'use strict';

function attachEventListeners () {
  [
    {
      event: 'popOutAXTreeButton',
      action: ACTION_POPOUT,
    },
    {
      event: 'appendAXTreeButton',
      action: ACTION_APPEND,
    },
    {
      event: 'removeAXTreeButton',
      action: ACTION_REMOVE,
    }
  ].forEach(function (mapping) {
    document
      .getElementById(mapping.event)
      .addEventListener('click', function () {
        let button = event.target;
        Tabs.getCurrent().then(
          // Success.
          function(tabInfo) {
            chrome.runtime.sendMessage(
              {
                source: SOURCE_POPUP,
                action: mapping.action,
                tabId: tabInfo.id
              }
            );
          }
        );
      }, false);
  });
}

document.addEventListener('DOMContentLoaded', attachEventListeners);
