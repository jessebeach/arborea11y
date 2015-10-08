'use strict';

function buildAXTree(tabId) {
  return new Promise(function(resolve, reject) {
    if (tabId) {
      chrome.automation.getTree(tabId, function(rootNode) {
        if (!rootNode) {
          reject('No rootNode returned from chrome.automation.getTree for the Tab with ID ' + tabId);
          return;
        }
        let tree = AXTreeBuilder.createTree(rootNode);
        resolve({
          axtree: DocFragUtils.serialize(tree)
        });
      });
    } else {
      reject('No tabId provided.');
    }
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let id = request.tabId || (sender.tab && sender.tab.id);
    if (id) {
      switch (request.source) {
        case SOURCE_POPUP:
          Tabs.sendTo(id, {
            source: SOURCE_POPUP,
            action: request.action
          });
          break;
        case SOURCE_CONTENT:
          buildAXTree(id).then(
            // Success
            function(data) {
              data.action = request.action;
              data.source = SOURCE_BACKGROUND;
              Tabs.sendTo(id, data);
            }
          );
          break;
      }
    }
  }
);
