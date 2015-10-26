window.appendTree = function(docFrag) {
  let body = document.body;
  body.replaceChild(docFrag, body.childNodes[0]);
};
