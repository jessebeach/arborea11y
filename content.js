function onExtensionMessage(request) {
  let axTreeFrag = DocFragUtils.deserialize(request.axtree);
  document.body.innerHTML = '';
  document.body.appendChild(axTreeFrag);
}

function initContentScript() {
  chrome.extension.onRequest.addListener(onExtensionMessage);
  chrome.extension.sendRequest({}, onExtensionMessage);
}

initContentScript();
