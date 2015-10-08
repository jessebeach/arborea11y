"use strict";

const COMPLETE = 'complete';

function buildAXTree(tabId) {
  return new Promise(function(resolve, reject) {
    chrome.automation.getTree(tabId, function(rootNode) {
      if (!rootNode) {
        reject('No rootNode returned from chrome.automation.getTree');
        return;
      }
      let tree = AXTreeBuilder.createTree(rootNode);
      resolve({
        axtree: DocFragUtils.serialize(tree)
      });
    });
  });
}

let onUpdatedTabHandler = function(tabId, processInfo, tabInfo) {
  if (processInfo.status === COMPLETE) {
    chrome.runtime.sendMessage(
      {
        action: 'replace',
        tabId: tabInfo.id
      }
    );
    chrome.tabs.onUpdated.removeListener(onUpdatedTabHandler);
  }
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.action) {
      case 'replace':
        let id = request.tabId || (sender.tab && sender.tab.id);
        if (id) {
          buildAXTree(id).then(
            // Success
            function(fragStr) {
              Tabs.sendTo(id, fragStr);
            }
          );
        }
        break;
    }
  }
);

// chrome.tabs.onUpdated.addListener(onUpdatedTabHandler);
