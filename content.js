"use strict";

const EXT_NAME = 'arborea11y';
const COMPLETE = 'complete';
const SOURCE_PAGE = 'page';
const SOURCE_CONTENT = 'content';
const SOURCE_BACKGROUND = 'background';
const SOURCE_POPUP = 'popup';
const ACTION_APPEND = 'append';
const ACTION_REMOVE = 'remove';
const ARBOREA11Y_CONTAINER_ID = 'arborea11y-container';

function onExtensionMessage(response) {
  switch (response.action) {
    case ACTION_APPEND:
      switch (response.source) {
        case SOURCE_POPUP:
          requestGenAXTree();
          break;
        case SOURCE_BACKGROUND:
          appendAXTree(response.axtree);
          break;
      }
      break;
    case ACTION_REMOVE:
      removeAXTree();
      break;
  }
}

function onPageMessage(event) {
  // Only accept messages from the embedding page.
  if (event.source !== window) {
    return;
  }

  let data = event.data || {};

  if (
    data.extension === EXT_NAME &&
    data.source === SOURCE_PAGE
  ) {
    switch (data.action) {
      case ACTION_APPEND:
        requestGenAXTree();
        break;
      case ACTION_REMOVE:
        removeAXTree();
        break;
    }
  }
}

function requestGenAXTree() {
  if (document.readyState === COMPLETE) {
    genAXTree();
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      genAXTree();
      document.removeEventListener(genAXTree);
    });
  }
}

function genAXTree() {
  const message = {
    action: ACTION_APPEND,
    source: SOURCE_CONTENT
  };
  // Clean up any AX info in the DOM.
  removeAXTree().then(
    // Success.
    function() {
      // Wait for the DOM to really get itself freshened up.
      window.setTimeout(function() {
        // Rebuild the tree.
        chrome.runtime.sendMessage(message);
      }, 0);
    }
  );
}

function appendAXTree(axTree) {
  if (!axTree) {
    throw new Error('No AXTree provided for appending.');
    return;
  }
  let axTreeFrag = DocFragUtils.deserialize(axTree);
  let axContainer = document.createElement('div');
  axContainer.setAttribute('id', ARBOREA11Y_CONTAINER_ID);
  axContainer.setAttribute('style', 'outline: 1px solid red; outline-offset: -1px; padding: 10px; margin: 10px 0;');
  axContainer.appendChild(axTreeFrag);
  document.body.appendChild(axContainer);
}

function removeAXTree() {
  return new Promise(function(resolve, reject) {
    let axContainer = document.getElementById(ARBOREA11Y_CONTAINER_ID);
    if (axContainer) {
      // Wait for mutations to complete.
      let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          for (let node of Array.prototype.slice.call(mutation.removedNodes)) {
            if (node === axContainer) {
              resolve(node);
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
    }
    else {
      resolve();
    }
  });
}
// Embedded page messages.
window.addEventListener("message", onPageMessage, false);
// Background messages.
chrome.runtime.onMessage.addListener(onExtensionMessage);
