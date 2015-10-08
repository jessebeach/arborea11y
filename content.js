function onExtensionMessage(request) {
  if (request.axtree) {
    let axTreeFrag = DocFragUtils.deserialize(request.axtree);
    document.body.innerHTML = '';
    document.body.appendChild(axTreeFrag);
  }
}

chrome.runtime.onMessage.addListener(onExtensionMessage);
