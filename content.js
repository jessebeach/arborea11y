"use strict";

const COMPLETE = 'complete';

function onExtensionMessage(response) {
  if (response.axtree) {
    let axTreeFrag = DocFragUtils.deserialize(response.axtree);
    document.body.innerHTML = '';
    document.body.appendChild(axTreeFrag);
  }
}

function swapInAXTree() {
  chrome.runtime.sendMessage({
    action: 'replace'
  });
}

chrome.runtime.onMessage.addListener(onExtensionMessage);

if (document.readyState === COMPLETE) {
  swapInAXTree();
} else {
  document.addEventListener('DOMContentLoaded', function() {
    swapInAXTree();
    document.removeEventListener(swapInAXTree);
  });
}
