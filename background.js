function initBackground() {
  chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
      var axtree = chrome.automation.getTree(function(rootNode) {
        if (!rootNode) {
          return;
        }
        var tree = AXTreeBuilder.createTree(rootNode);
        sendResponse({
          axtree: DocFragUtils.serialize(tree)
        });
      });
    }
  );
}

initBackground();
