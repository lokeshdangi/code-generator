import React, { Component } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import "./App.css";
import { ReactGenerator } from "./components/codegenerator";

let that;
const allowedCssPropertiesForText = [
  { fontSize: "number" },
  { color: "text" },
  { fontWeight: "text" },
  { marginLeft: "number" },
  { marginRight: "number" },
  { marginTop: "number" },
  { marginBottom: "number" },
  { paddingLeft: "number" },
  { paddingRight: "number" },
  { paddingTop: "number" },
  { paddingBottom: "number" }
];

const allowedCssPropertiesForContainer = [
  { backgroundColor: "text" },
  { height: "number" },
  { width: "number" },
  { marginLeft: "number" },
  { marginRight: "number" },
  { marginTop: "number" },
  { marginBottom: "number" },
  { paddingLeft: "number" },
  { paddingRight: "number" },
  { paddingTop: "number" },
  { paddingBottom: "number" }
];

export default class App extends Component {
  styles = {};
  styleSheet = "";

  state = {
    currentElementId: 0,
    currentElementType: "container",
    style: {},
    backgroundColor: "",
    marginLeft: "",
    marginRight: "",
    marginTop: "",
    marginBottom: "",
    paddingLeft: "",
    paddingRight: "",
    paddingTop: "",
    paddingBottom: "",
    fontSize: "",
    height: "",
    width: ""
  };

  uidl = {
    type: "element",
    id: "0",
    content: {
      id: "0",
      elementType: "container",
      style: {
        backgroundColor: "red",
        height: "650px",
        width: "350px",
        position: "absolute"
      },
      children: []
    }
  };

  componentDidMount = () => {
    that = this;
    document.getElementById("0").addEventListener("click", event => {
      // console.log("clicked :", event.target.id);
      clearState();
      setCurrentElementProperties(event.target.id.slice(9));
      setCurrentElement(this, "container", event.target.id);
    });
  };

  createElement = (type, id) => {
    const node = document.createElement("div");
    let level = 0;
    let path;

    if (id.length > 1) {
      path = id.split("_");
    } else {
      path = [id];
    }
    const children = path.reduce((obj, key, index) => {
      level++;
      if (path.length === level) {
        if (index === 0) {
          return obj["content"]["children"];
        } else {
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
    node.innerHTML = `div: ${id}_${children.length}`;
    node.style.height = `auto`;
    node.style.paddingLeft = `${path.length * 10}px`;

    let TYPE;
    let element;
    if (type === "div") {
      TYPE = "container";

      element = {
        type: "element",
        id: `${id}_${children.length}`,
        content: {
          id: `${id}_${children.length}`,
          elementType: TYPE,
          style: {
            height: "10px",
            width: "100%",
            backgroundColor: "blue",
            marginTop: "5px"
          },
          children: []
        }
      };
    } else if (type === "h1") {
      TYPE = "text";

      element = {
        type: "element",
        id: `${id}_${children.length}`,
        content: {
          id: `${id}_${children.length}`,
          elementType: TYPE,
          style: { padding: "0px", margin: "0px" },
          children: [
            {
              type: "static",
              content: "text here"
            }
          ]
        }
      };
    }

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
    // const reactGenerator = new ReactGenerator();

    // reactGenerator.traverseUidl({
    //   name: "PersonSpotlight",
    //   node: this.uidl
    // });

    // // console.log("element =>", reactGenerator.elements);
    // this.setState({
    //   code: reactGenerator.elements,
    //   style: JSON.parse(JSON.stringify(reactGenerator.styleSheet))
    // });

    // console.log("CREATED ELEMENT TYPE", TYPE);
    node.addEventListener("click", event => {
      event.stopPropagation();
      clearState();
      setCurrentElementProperties(event.target.id);
      setCurrentElement(this, TYPE, event.target.id);
    });

    document.getElementById(id).appendChild(node);
  };

  handleStyleChange = (event, data, isInPixel = false) => {
    this.setState({
      [data]: event.target.value
    });

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
  };

  handleClick = (event, data) => {
    // console.log("currentElementId", this.state.currentElementId);
    this.createElement(data.type, this.state.currentElementId);
  };

  setProps = props => {
    // console.log("props =>", props);
  };

  renderMenu = () => {
    let allowed = { container: ["container", "text"], text: [] };

    return (
      <React.Fragment>
        <ContextMenu
          style={{ backgroundColor: "white", width: 150, padding: 10 }}
          id={this.state.currentElementId}
        >
          {allowed[this.state.currentElementType].length
            ? allowed[this.state.currentElementType].map(element => {
                if (element === "container") {
                  return (
                    <MenuItem data={{ type: "div" }} onClick={this.handleClick}>
                      DIV
                    </MenuItem>
                  );
                } else if (element === "text") {
                  return (
                    <MenuItem data={{ type: "h1" }} onClick={this.handleClick}>
                      H1
                    </MenuItem>
                  );
                }
              })
            : "Children not allowed"}
        </ContextMenu>
      </React.Fragment>
    );
  };

  render() {
    // console.log("STATE =>", this.state);
    return (
      <React.Fragment>
        <h1>Board : current selected element {this.state.currentElementId}</h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {/* <div dangerouslySetInnerHTML={{ __html: this.state.code }} /> */}
          <ContextMenuTrigger id={this.state.currentElementId}>
            <CustomComponent
              uidl={{
                name: "ComponentName",
                node: this.uidl
              }}
            />
          </ContextMenuTrigger>
          <div>
            <ContextMenuTrigger id={this.state.currentElementId}>
              <div
                id="0"
                style={{
                  marginLeft: 400,
                  height: 500,
                  width: 800,
                  background: "#dddddd"
                }}
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
            {this.state.currentElementType === "container" &&
              allowedCssPropertiesForContainer.map(property => {
                return (
                  <React.Fragment>
                    <label>{Object.keys(property)[0]}</label>
                    <br />
                    <input
                      type={property[Object.keys(property)[0]]}
                      value={this.state[Object.keys(property)[0]]}
                      onChange={event =>
                        this.handleStyleChange(
                          event,
                          Object.keys(property)[0],
                          property[Object.keys(property)[0]] === "number"
                            ? true
                            : false
                        )
                      }
                    />
                    <br />
                  </React.Fragment>
                );
              })}

            {this.state.currentElementType === "text" &&
              allowedCssPropertiesForText.map(property => {
                return (
                  <React.Fragment>
                    <label>{Object.keys(property)[0]}</label>
                    <br />
                    <input
                      type={property[Object.keys(property)[0]]}
                      value={this.state[Object.keys(property)[0]]}
                      onChange={event =>
                        this.handleStyleChange(
                          event,
                          Object.keys(property)[0],
                          property[Object.keys(property)[0]] === "number"
                            ? true
                            : false
                        )
                      }
                    />
                    <br />
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const Children = props => {
  if (props.node.hasOwnProperty("children")) {
    return props.node.children.map(child => <GenComponentNodes node={child} />);
  }
};

const GenText = props => {
  let id = props.node.id;
  id = `container${id}`;
  return (
    <p
      style={props.node.style}
      id={id}
      onClick={event => {
        event.stopPropagation();
        clearState();
        setCurrentElementProperties(event.target.id.slice(9));
        setCurrentElement(that, "text", event.target.id.slice(9));

        let text = prompt("Edit text");
        if (text && text.length) {
          setNewText(event, text);
        }
      }}
    >
      <Children node={props.node} />
    </p>
  );
};

const GenContainer = props => {
  let id = props.node.id;
  id = `container${id}`;
  return (
    <div
      style={props.node.style}
      id={id}
      onClick={event => {
        event.stopPropagation();
        clearState();
        setCurrentElementProperties(event.target.id.slice(9));
        setCurrentElement(that, "container", event.target.id.slice(9));
      }}
    >
      <Children node={props.node} />
    </div>
  );
};

const GenComponentNodes = props => {
  const nodeKeys = Object.keys(props.node);
  return nodeKeys.map(key => {
    if (props.node[key] === "element") {
      switch (props.node["content"]["elementType"]) {
        case "container":
          return <GenContainer node={props.node["content"]} />;
        case "text":
          return <GenText node={props.node["content"]} />;
        default:
          return null;
      }
    } else if (props.node[key] === "dynamic") {
      // this.genDynamicNode(prop.node["content"]);
    } else if (props.node[key] === "static") {
      return props.node["content"];
    }
  });
};

const CustomComponent = props => {
  const uidlKeys = Object.keys(props.uidl);
  return uidlKeys.map(key => {
    if (key === "node") {
      return <GenComponentNodes node={props.uidl[key]} />;
    }
  });
};

const setCurrentElementProperties = id => {
  let path = [];
  if (id.length > 1) {
    path = id.split("_");
  } else {
    path = [id];
  }
  let level = 0;
  const style = path.reduce((obj, key, index) => {
    level++;
    if (path.length === level) {
      if (index === 0) {
        return obj["content"]["style"];
      } else {
        return obj["content"]["children"][key]["content"]["style"];
      }
    } else {
      if (index === 0) {
        return obj;
      } else {
        return obj["content"]["children"][key];
      }
    }
  }, that.uidl);

  // console.log("style on click =>", style);

  Object.keys(style).forEach(key => {
    let value = style[key].slice(-2);
    if (value === "px") {
      that.setState({
        [key]: style[key].slice(0, -2)
      });
    } else {
      that.setState({
        [key]: style[key]
      });
    }
  });
};

const setCurrentElement = (context, type, id) => {
  context.setState({
    currentElementType: type,
    currentElementId: id
  });
};

const setNewText = (event, text) => {
  let id = event.target.id.slice(9);

  let level = 0;
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
        return obj["content"];
      } else {
        obj["content"]["children"][key]["content"]["children"][0][
          "content"
        ] = text;
      }
    } else {
      if (index === 0) {
        return obj;
      } else {
        return obj["content"]["children"][key];
      }
    }
  }, that.uidl);
};

const clearState = () => {
  console.log("clearning state");
  that.setState({
    backgroundColor: "",
    marginLeft: "",
    marginRight: "",
    marginTop: "",
    marginBottom: "",
    paddingLeft: "",
    paddingRight: "",
    paddingTop: "",
    paddingBottom: "",
    fontSize: "",
    height: "",
    width: ""
  });
};
