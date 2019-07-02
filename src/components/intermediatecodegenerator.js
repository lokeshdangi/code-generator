import React, { Component } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import "./App.css";
export default class App extends Component {
  state = {
    currentElementId: 0
  };

  uidl = {
    type: "element",
    id: "0",
    content: {
      id: "0",
      elementType: "container",
      style: {},
      children: []
    }
  };

  componentDidMount = () => {
    document.getElementById("0").addEventListener("click", event => {
      // console.log("clicked :", event.target.id);

      this.setState({
        currentElementId: event.target.id
      });
    });
  };
  currentPoitionInUidl = ["node"];

  setElementData = (path, data) => {};

  createElement = (type, id) => {
    // console.log("BEFORE UIDL", JSON.stringify(this.uidl));
    const node = document.createElement(type);
    node.className = "dummydiv";

    let level = 0;
    let path;

    if (id.length > 1) {
      path = id.split("_");
    } else {
      path = [id];
    }
    // console.log("path :", path);
    // console.log("path length", path.length);
    const children = path.reduce((obj, key, index) => {
      level++;
      // console.log("index", index);
      // console.log("level", level);
      // console.log("key", key);
      // console.log("current obj", obj);
      if (path.length === level) {
        if (index === 0) {
          // console.log("final obj in if", obj["content"]["children"]);
          return obj["content"]["children"];
        } else {
          // console.log("final obj in else", obj["content"]["children"][key]);
          return obj["content"]["children"][key]["content"]["children"];
        }
      } else {
        if (index === 0) {
          return obj;
        } else {
          return obj["content"]["children"][key];
        }
      }
    }, this.uidl);

    node.id = `${id}_${children.length}`;
    // console.log("parentId", id);
    // console.log("childrenId", children.length);
    node.innerHTML = `div: ${id}_${children.length}`;
    node.style.padding = `0px 0px 0px ${path.length * 10}px`;

    const element = {
      type: "element",
      id: `${id}_${children.length}`,
      content: {
        id: `${id}_${children.length}`,
        selfId: children.length,
        elementType: "container",
        style: {},
        children: []
      }
    };

    level = 0;
    path.reduce((obj, key, index) => {
      level++;
      if (path.length === level) {
        if (index === 0) {
          return obj["content"]["children"].push(element);
        } else {
          return obj["content"]["children"][key]["content"]["children"].push(
            element
          );
        }
      } else {
        if (index === 0) {
          return obj;
        } else {
          return obj["content"]["children"][key];
        }
      }
    }, this.uidl);

    // console.log("AFTER UIDL: ", JSON.stringify(this.uidl));

    node.addEventListener("click", event => {
      // event.stopPropagation();
      this.setState({
        currentElementId: event.target.id
      });
    });

    document.getElementById(id).appendChild(node);
  };

  handleStyleChange = (event, data, isInPixel = false) => {
    let value = "";
    if (isInPixel) {
      value = `${event.target.value}px`;
    } else {
      value = event.target.value;
    }
    // console.log("data", data);
    let level = 0;
    const id = this.state.currentElementId;
    let path = [];
    if (id.length > 1) {
      path = id.split("_");
    } else {
      path = [id];
    }
    path.reduce((obj, key, index) => {
      level++;
      if (path.length === level) {
        if (index === 0) {
          return (obj["content"]["children"]["style"] = {
            ...obj["content"]["children"]["style"],
            [data]: value
          });
        } else {
          return (obj["content"]["children"][key]["content"]["style"] = {
            ...obj["content"]["children"][key]["content"]["style"],
            [data]: value
          });
        }
      } else {
        if (index === 0) {
          return obj;
        } else {
          return obj["content"]["children"][key];
        }
      }
    }, this.uidl);

    // console.log("final", JSON.stringify(this.uidl));
  };

  handleClick = (event, data) => {
    // console.log("currentElementId", this.state.currentElementId);
    this.createElement("div", this.state.currentElementId);
  };

  renderMenu = () => {
    return (
      <React.Fragment>
        <ContextMenu
          style={{ backgroundColor: "blue", width: 150, padding: 10 }}
          id={this.state.currentElementId}
        >
          <MenuItem data={{ type: "div" }} onClick={this.handleClick}>
            DIV
          </MenuItem>
          <MenuItem data={{ type: "h1" }} onClick={this.handleClick}>
            H1
          </MenuItem>
          <MenuItem divider />
          <MenuItem data={{ type: "p" }} onClick={this.handleClick}>
            PARA
          </MenuItem>
          <MenuItem data={{ type: "img" }} onClick={this.handleClick}>
            IMAGE
          </MenuItem>
        </ContextMenu>
      </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
        <h1>Board</h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <ContextMenuTrigger id={this.state.currentElementId}>
              <div
                id="0"
                style={{ height: 500, width: 800, background: "#dddddd" }}
                className="well"
              />
            </ContextMenuTrigger>
            {this.renderMenu()}
          </div>
          <div
            style={{
              marginLeft: 10,
              height: 500,

              background: "#eeeeee"
            }}
          >
            <label>backgroundColor</label>
            <br />
            <input
              type="text"
              data="backgroundColor"
              onChange={event =>
                this.handleStyleChange(event, "backgroundColor")
              }
              id="backgroundColor"
            />

            <br />
            <label>Height</label>
            <br />
            <input
              type="text"
              data="backgroundColor"
              onChange={event => this.handleStyleChange(event, "height", true)}
              id="backgroundColor"
            />

            <br />
            <label>Width</label>
            <br />
            <input
              type="text"
              data="backgroundColor"
              onChange={event => this.handleStyleChange(event, "width", true)}
              id="backgroundColor"
            />

            <br />
            <label>Margin Left</label>
            <br />
            <input
              type="text"
              data="backgroundColor"
              onChange={event =>
                this.handleStyleChange(event, "marginLeft", true)
              }
              id="backgroundColor"
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
