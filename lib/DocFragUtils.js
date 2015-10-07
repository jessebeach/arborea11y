class DocFragUtils {
  static serialize(frag) {
    var div = document.createElement('div');
    div.appendChild(frag.cloneNode(true));
    return div.innerHTML;
  }
  static deserialize(fragStr) {
    let div = document.createElement('div');
    div.innerHTML = fragStr;

    let frag = document.createDocumentFragment();
    let elements = Array.prototype.slice.call(div.childNodes);
    for (let el of elements) {
      frag.appendChild(el);
    }
    return frag;
  }
}
