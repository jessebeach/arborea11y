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
    let id = request.tabId || (sender.tab && sender.tab.id);
    if (id) {
      switch (request.source) {
        case 'popup':
          Tabs.sendTo(id, {
            source: 'popup',
            action: request.action
          });
          break;
        case 'content':
          buildAXTree(id).then(
            // Success
            function(data) {
              data.action = request.action;
              data.source = 'background';
              Tabs.sendTo(id, data);
            }
          );
          break;
      }
    }
  }
);
