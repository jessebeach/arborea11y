"use strict";

const COMPLETE = 'complete';
const PAGE_MESSAGE = 'pageMessage';
const ARBOREA11Y_CONTAINER_ID = 'arborea11y-container';

function onExtensionMessage(response) {
  if (response.axtree) {
    switch (response.action) {
      case 'append':
        let axTreeFrag = DocFragUtils.deserialize(response.axtree);
        let axContainer = document.createElement('div');
        axContainer.setAttribute('id', ARBOREA11Y_CONTAINER_ID);
        axContainer.setAttribute('style', 'outline: 1px solid red; outline-offset: -1px; padding: 10px; margin: 10px 0;');
        axContainer.appendChild(axTreeFrag);
        document.body.appendChild(axContainer);
        break;
    }
  }
}

function onPageMessage(event) {
  // Only accept messages from the embedding page.
  if (event.source !== window) {
    return;
  }

  if (event.data.type && (event.data.type == PAGE_MESSAGE)) {
    injectAXTree();
  }
}

function requestAXTreeInjection() {
  if (document.readyState === COMPLETE) {
    injectAXTree();
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      injectAXTree();
      document.removeEventListener(injectAXTree);
    });
  }
}

function injectAXTree() {
  // Clean up any AX info in the DOM.
  let axContainer = document.getElementById(ARBOREA11Y_CONTAINER_ID);
  if (axContainer) {
    // Wait for mutations to complete.
    let observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        for (let node of Array.prototype.slice.call(mutation.removedNodes)) {
          if (node === axContainer) {
            // Wait for the DOM to really get itself freshened up.
            window.setTimeout(function() {
              // Rebuild the tree.
              chrome.runtime.sendMessage({
                action: 'append'
              });
            }, 0);
            observer.disconnect();
            break;
          }
        }
      });
    });
    let config = {
      attributes: false,
      childList: true,
      characterData: false
    };
    observer.observe(document.body, config);
    document.body.removeChild(axContainer);
  } else {
    // Rebuild the tree.
    chrome.runtime.sendMessage({
      action: 'append'
    });
  }
}
// Embedded page messages.
window.addEventListener("message", onPageMessage, false);
// Background messages.
chrome.runtime.onMessage.addListener(onExtensionMessage);
