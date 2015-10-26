'use strict';

function buildAXTree(tabId) {
  return new Promise(function(resolve, reject) {
    if (tabId) {
      chrome.automation.getTree(tabId, function(rootNode) {
        if (!rootNode) {
          reject('No rootNode returned from chrome.automation.getTree for the Tab with ID ' + tabId);
          return;
        }
        let tree = (new AXTree(rootNode)).tree;
        resolve({
          axtree: DocFragUtils.serialize(tree)
        });
      });
    } else {
      reject('No tabId provided.');
    }
  });
}

function launchTreeView(data) {
  function updateExplorer(tabInfo) {
    let win = chrome.extension.getViews({
      type: 'tab',
      windowId: tabInfo.windowId
    })[0];
    if (win && win.appendTree) {
      win.appendTree(
        DocFragUtils.deserialize(data.axtree)
      );
    }
  }

  function onUpdatedWindowHandler(tabId, processInfo, tabInfo) {
    if (processInfo.status === COMPLETE) {
      updateExplorer(tabInfo);
      chrome.tabs.onUpdated.removeListener(onUpdatedWindowHandler);
    }
  };

  chrome.windows.create({
    url: chrome.extension.getURL('view/explorer.html')
  }, function(winInfo) {
    let tabInfo = winInfo.tabs[0];
    if (tabInfo && tabInfo.status === COMPLETE) {
      updateExplorer(tabInfo);
    } else {
      chrome.tabs.onUpdated.addListener(onUpdatedWindowHandler);
    }
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let id = request.tabId || (sender.tab && sender.tab.id);
    if (id) {
      switch (request.source) {
        case SOURCE_POPUP:
          switch (request.action) {
            case ACTION_APPEND:
            case ACTION_REMOVE:
              Tabs.sendTo(id, {
                source: SOURCE_POPUP,
                action: request.action
              });
              break;
            case ACTION_POPOUT:
              buildAXTree(id).then(launchTreeView);
              break;
          }
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
