function buildAXTree() {
  return new Promise(function(resolve, reject) {
    chrome.automation.getTree(function(rootNode) {
      if (!rootNode) {
        reject('No rootNode returned from chrome.automation.getTree');
      }
      let tree = AXTreeBuilder.createTree(rootNode);
      resolve({
        axtree: DocFragUtils.serialize(tree)
      });
    });
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.action) {
      case 'replace':
        if (request.tabInfo && request.tabInfo.id) {
          let id = request.tabInfo.id;
          buildAXTree().then(
            // Success
            function(fragStr) {
              Tabs.sendToTab(id, fragStr);
            }
          );
        }
        break;
    }
  }
);
