"use strict";

const COMPLETE = 'complete';

function onExtensionMessage(response) {
  if (response.axtree) {
    let axTreeFrag = DocFragUtils.deserialize(response.axtree);
    let axContainer = document.createElement('div');
    axContainer.setAttribute('id', 'arborea11y-container');
    axContainer.setAttribute('style', 'outline: 1px solid red; outline-offset: -1px; padding: 10px; margin: 10px 0;');
    axContainer.appendChild(axTreeFrag);
    document.body.appendChild(axContainer);
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
