'use strict';

class AXTree {
  constructor(rootNode) {
    this.rootNode = rootNode;
    this.tree = AXTree.buildTree(this.rootNode);
  }
  static buildTree(automationNode, opt_parentNode, opt_indent) {
    var RoleType = chrome.automation.RoleType;

    if (!opt_parentNode && automationNode.role != RoleType.rootWebArea)
      throw 'no parent node and not rootWebArea';

    var parentNode = opt_parentNode,
        indent = opt_indent || '',
        node = null;

    for (var property in automationNode) {
      var value = automationNode[property];
      if (typeof value === 'function')
        continue;
      if (value === undefined)
        continue;
    }

    var atomic = false;

    switch (automationNode.role) {
    case RoleType.rootWebArea:
      node = document.createDocumentFragment();
      break;

    case RoleType.button:
      atomic = true;
      node = parentNode.appendChild(document.createElement("button"));
      if (automationNode.name.trim() == "" && automationNode.description && automationNode.description.trim() != "")
        node.appendChild(document.createTextNode(automationNode.description));
      else
        node.appendChild(document.createTextNode(automationNode.name));
      break;

    case RoleType.link:
      node = parentNode.appendChild(document.createElement("a"));
      node.href = automationNode.url;

      if (automationNode.name.trim() == "" && automationNode.description && automationNode.description.trim() != "")
        node.appendChild(document.createTextNode(automationNode.description));
      break;



    case RoleType.cell:
      node = parentNode.appendChild(document.createElement("td"));
      break;

    case RoleType.checkBox:
      atomic = true;
      node = parentNode.appendChild(document.createElement("input"));
      node.type = "checkbox";
      node.checked = automationNode.state.checked;
      break;

    case RoleType.date:
    case RoleType.dateTime:
    case RoleType.time:
      node = parentNode.appendChild(document.createElement("time"));
      break;

    case RoleType.div:
      node = parentNode.appendChild(document.createElement("div"));
      break;

    case RoleType.figcaption:
      node = parentNode.appendChild(document.createElement("figcaption"));
      break;

    case RoleType.figure:
      node = parentNode.appendChild(document.createElement("figure"));
      break;

    case RoleType.heading:
      switch (automationNode.hierarchicalLevel) {
      case 1:
        node = parentNode.appendChild(document.createElement("h1"));
        break;
      case 2:
        node = parentNode.appendChild(document.createElement("h2"));
        break;
      case 3:
        node = parentNode.appendChild(document.createElement("h3"));
        break;
      case 4:
        node = parentNode.appendChild(document.createElement("h4"));
        break;
      case 5:
        node = parentNode.appendChild(document.createElement("h5"));
        break;
      case 6:
      default:
        node = parentNode.appendChild(document.createElement("h6"));
        break;
      }
      break;

    case RoleType.image:
      atomic = true;
      node = parentNode.appendChild(document.createElement("img"));
      node.src = "";
      node.alt = automationNode.name != "" ? automationNode.name : automationNode.url ? automationNode.url.split('/').pop() : '<' + automationNode.htmlTag + '>';
      break;

    case RoleType.inputTime:
      atomic = true;
      node = parentNode.appendChild(document.createElement("input"));
      node.type = "time"
      node.value = automationNode.value;
      break;

    case RoleType.list:
      node = parentNode.appendChild(document.createElement(automationNode.htmlTag));
      break;

    case RoleType.listItem:
      node = parentNode.appendChild(document.createElement("li"));
      break;

    case RoleType.listMarker:
      atomic = true; // ignore list markers as the ul/ol will insert them
      break;

    case RoleType.paragraph:
      node = parentNode.appendChild(document.createElement("p"));
      break;

    case RoleType.pre:
      node = parentNode.appendChild(document.createElement("pre"));
      break;

    case RoleType.radioButton:
      atomic = true;
      node = parentNode.appendChild(document.createElement("input"));
      node.type = "radio";
      node.checked = automationNode.state.checked;
      break;

    case RoleType.rowHeader:
    case RoleType.columnHeader:
      node = parentNode.appendChild(document.createElement("th"));
      break;

    case RoleType.row:
      node = parentNode.appendChild(document.createElement("tr"));
      break;

    case RoleType.slider:
      atomic = true;
      node = parentNode.appendChild(document.createElement("input"));
      node.type = "range";
      node.min = automationNode.minValueForRange;
      node.max = automationNode.maxValueForRange;
      node.value = automationNode.valueForRange;
      // TODO: valuetext
      break;

    case RoleType.staticText:
      atomic = true;
      node = parentNode.appendChild(document.createTextNode(automationNode.value));
      break;

    case RoleType.table:
      node = parentNode.appendChild(document.createElement("table"));
      break;

    case RoleType.textField:
      atomic = true;
      node = parentNode.appendChild(document.createElement("input"));
      node.type = "text";
      node.value = automationNode.value;
      break;


    case RoleType.alertDialog:
    case RoleType.alert:
    case RoleType.annotation:
    case RoleType.application:
    case RoleType.article:
    case RoleType.banner:
    case RoleType.blockquote:
    case RoleType.busyIndicator:
    case RoleType.buttonDropDown:
    case RoleType.canvas:
    case RoleType.caption:
    case RoleType.client:
    case RoleType.colorWell:
    case RoleType.column:
    case RoleType.comboBox:
    case RoleType.complementary:
    case RoleType.contentInfo:
    case RoleType.definition:
    case RoleType.descriptionListDetail:
    case RoleType.descriptionList:
    case RoleType.descriptionListTerm:
    case RoleType.desktop:
    case RoleType.details:
    case RoleType.dialog:
    case RoleType.directory:
    case RoleType.disclosureTriangle:
    case RoleType.document:
    case RoleType.embeddedObject:
    case RoleType.footer:
    case RoleType.form:
    case RoleType.grid:
    case RoleType.group:
    case RoleType.iframe:
    case RoleType.iframePresentational:
    case RoleType.ignored:
    case RoleType.imageMapLink:
    case RoleType.imageMap:
    case RoleType.inlineTextBox:
    case RoleType.labelText:
    case RoleType.legend:
    case RoleType.lineBreak:
    case RoleType.listBoxOption:
    case RoleType.listBox:
    case RoleType.locationBar:
    case RoleType.log:
    case RoleType.main:
    case RoleType.mark:
    case RoleType.marquee:
    case RoleType.math:
    case RoleType.menuBar:
    case RoleType.menuButton:
    case RoleType.menuItem:
    case RoleType.menuItemCheckBox:
    case RoleType.menuItemRadio:
    case RoleType.menuListOption:
    case RoleType.menuListPopup:
    case RoleType.menu:
    case RoleType.meter:
    case RoleType.navigation:
    case RoleType.note:
    case RoleType.outline:
    case RoleType.pane:
    case RoleType.popUpButton:
    case RoleType.presentational:
    case RoleType.progressIndicator:
    case RoleType.radioGroup:
    case RoleType.region:
    case RoleType.ruby:
    case RoleType.ruler:
    case RoleType.svgRoot:
    case RoleType.scrollArea:
    case RoleType.scrollBar:
    case RoleType.seamlessWebArea:
    case RoleType.search:
    case RoleType.searchBox:
    case RoleType.sliderThumb:
    case RoleType.spinButtonPart:
    case RoleType.spinButton:
    case RoleType.splitter:
    case RoleType.status:
    case RoleType.switch:
    case RoleType.tabGroup:
    case RoleType.tabList:
    case RoleType.tabPanel:
    case RoleType.tab:
    case RoleType.tableHeaderContainer:
    case RoleType.timer:
    case RoleType.titleBar:
    case RoleType.toggleButton:
    case RoleType.toolbar:
    case RoleType.treeGrid:
    case RoleType.treeItem:
    case RoleType.tree:
    case RoleType.unknown:
    case RoleType.tooltip:
    case RoleType.webArea:
    case RoleType.webView:
    case RoleType.window:
      node = parentNode.appendChild(document.createElement("div"));
      node.setAttribute('role', automationNode.role);
      break;
    }

    if (atomic)
      return;

    for (var child of automationNode.children) {
      AXTree.buildTree(child, node, indent + "  ");
      node.appendChild(document.createTextNode("\n"));
    }
    return node;
  }
}
