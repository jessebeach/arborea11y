"use strict";

const COMPLETE = 'complete';

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
    switch (request.action) {
      case 'append':
        let id = request.tabId || (sender.tab && sender.tab.id);
        if (id) {
          buildAXTree(id).then(
            // Success
            function(data) {
              data.action = request.action;
              Tabs.sendTo(id, data);
            }
          );
        }
        break;
    }
  }
);
