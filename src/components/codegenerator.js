import React from "react";

export class ReactGenerator {
  code = "";
  styleSheet = "";
  elements = "";
  componentName = "";
  uniqueClassNameCount = {
    image: 0,
    container: 0,
    link: 0,
    textblock: 0,
    text: 0
  };

  setComponentName = name => {
    // console.log("setting component name");
    this.componentName = name;
    return;
  };

  genComponentNodes = node => {
    const nodeKeys = Object.keys(node);
    // console.log("genComponentNodes =>", nodeKeys);
    nodeKeys.forEach(key => {
      if (node[key] === "element") {
        // console.log("content =>", node["content"]);
        // console.log("switch =>", node["content"]["elementType"]);

        switch (node["content"]["elementType"]) {
          case "container":
            // console.log("node", node);
            this.genContainer(node["content"]);
            break;
          case "textblock":
            this.genTextBlock(node["content"]);
            break;
          case "text":
            this.genText(node["content"]);
            break;
          case "link":
            this.genLink(node["content"]);
            break;
          case "image":
            this.genImage(node["content"]);
            break;
          default:
            // console.log("no element match");
            break;
        }
      } else if (node[key] === "dynamic") {
        // console.log("dynamic node", node);
        this.genDynamicNode(node["content"]);
      }
    });
  };

  genDynamicNode = node => {
    this.elements = `${this.elements}{${
      node.referenceType === "prop" ? "props" : "state"
    }.${node.id}}`;
  };

  genImage = node => {
    // console.log("generating image here", node);
    const className = this.genClassName(node);
    // Starting tag generation
    const imageStartTemplate = `<img src={${node["attrs"]["url"].slice(
      1
    )}} className="${className}" style={styles.${className}}`;

    this.elements = `${this.elements}${imageStartTemplate}`;
    this.searchForChildren(node);
    const imageEndTemplate = `/>`;
    this.elements = `${this.elements}${imageEndTemplate}`;
    if (node.hasOwnProperty("style")) {
      this.genStyleSheet(className, node.style);
    }
  };

  genContainer = (node, id) => {
    // console.log("generating container here", node);
    let style = "";
    const className = this.genClassName(node);
    if (node.hasOwnProperty("style")) {
      // console.log("here >>>>", "node", node);
      style = this.genStyleSheet(
        `container${node.id.split("_").join("")}`,
        node.style
      );
    }

    const containerStartTemplate = `<div class="${className}">`;
    this.elements = `${this.elements}${containerStartTemplate}`;
    this.searchForChildren(node);
    const containerEndTemplate = `</div>`;
    this.elements = `${this.elements}${containerEndTemplate}`;
  };

  genTextBlock = node => {
    // console.log("generating textblock here", node);
    const className = this.genClassName(node);
    const imageStartTemplate = `<p className="${className}" style={styles.${className}}>`;
    this.elements = `${this.elements}${imageStartTemplate}`;
    this.searchForChildren(node);

    const imageEndTemplate = `</p>`;
    this.elements = `${this.elements}${imageEndTemplate}`;
    if (node.hasOwnProperty("style")) {
      this.genStyleSheet(className, node.style);
    }
  };

  genText = node => {
    // console.log("generating textblock here", node);
    const className = this.genClassName(node);

    const imageStartTemplate = `<span className="${className}" style={styles.${className}}>`;
    this.elements = `${this.elements}${imageStartTemplate}`;
    this.searchForChildren(node);
    const imageEndTemplate = `</span>`;
    this.elements = `${this.elements}${imageEndTemplate}`;
    if (node.hasOwnProperty("style")) {
      this.genStyleSheet(className, node.style);
    }
  };

  genLink = node => {
    // console.log("generating link here");

    const className = this.genClassName(node);
    const linkStartTemplate = `<a className="${className}" style={styles.${className}}  >`;
    this.elements = `${this.elements}${linkStartTemplate}`;
    this.searchForChildren(node);

    const linkEndTemplate = `</a>`;
    this.elements = `${this.elements}${linkEndTemplate}`;
    if (node.hasOwnProperty("style")) {
      this.genStyleSheet(className, node.style);
    }
  };

  searchForChildren = node => {
    if (node.hasOwnProperty("children")) {
      node.children.forEach(child => {
        this.genComponentNodes(child);
      });
    }
  };

  genStyleSheet = (className, style) => {
    let styles = JSON.stringify(style);

    const stylesArr = [...styles];
    stylesArr.forEach((char, index) => {
      if (char === "-") {
        stylesArr[index] = "";
        stylesArr[index + 1] = stylesArr[index + 1].toUpperCase();
      } else if (
        char === '"' &&
        (styles[index - 1] === "{" || styles[index - 1] === ",")
      ) {
        stylesArr[index] = "";
      } else if (char === '"' && styles[index + 1] === ":") {
        stylesArr[index] = "";
      } else if (char === ",") {
        stylesArr[index] = ";";
      }
    });

    const styleTemplate = `.${className}${stylesArr.join("")}`;
    this.styleSheet = `${this.styleSheet}${styleTemplate}`;
  };

  genClassName = node => {
    return `${node["elementType"] +
      this.uniqueClassNameCount[node["elementType"]]++}`;
  };

  genClass = (name, elements, style) => {
    return `
    import React from "react"
    export default class ${name} extends React.Component{ 
       render() {
         const props = this.props
         return(
           ${elements}
           )
        }
      }
      
      const styles = {
        ${style}
      }
      
      `;
  };

  setProps = props => {
    // console.log("props =>", props);
  };

  traverseUidl = uidl => {
    const uidlKeys = Object.keys(uidl);
    uidlKeys.forEach(key => {
      if (key === "name") {
        this.setComponentName(uidl[key]);
      } else if (key === "node") {
        this.genComponentNodes(uidl[key]);
      } else if (key === "props") {
        this.setProps(uidl[key]);
      }
      // console.log("Elements =>", this.elements);
    });

    this.code = this.genClass(
      this.componentName,
      this.elements,
      this.styleSheet
    );
  };
}

function handleClick(e, data) {
  // console.log(data.foo);
}

function App() {
  const uidl = {
    name: "PersonSpotlight",
    // propDefinitions: {
    //   name: {
    //     type: "string",
    //     defaultValue: "John Doe"
    //   },
    //   url: {
    //     type: "string",
    //     defaultValue: "http://lorempixel.com/150/150/"
    //   },
    //   flag: {
    //     type: "string",
    //     defaultValue: "🇷🇴"
    //   },
    //   link: {
    //     type: "string",
    //     defaultValue: "https://twitter.com/teleportHQio"
    //   },
    //   displayLink: {
    //     type: "string",
    //     defaultValue: "@teleportHQ"
    //   },
    //   bio: {
    //     type: "string",
    //     defaultValue:
    //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    //   }
    // },
    node: {
      type: "element",
      content: {
        elementType: "container",
        style: {
          width: "300px",
          border: "1px solid #ccc",
          padding: "10px",
          margin: "5px"
        },
        children: [
          {
            type: "element",
            content: {
              elementType: "image",
              attrs: {
                url: "$props.url"
              },
              style: {
                display: "block",
                margin: "auto",
                "border-radius": "100%",
                width: "300px"
              }
            }
          },
          {
            type: "element",
            content: {
              elementType: "textblock",
              style: {
                "font-size": "22px",
                "font-weight": "900",
                margin: "0",
                "text-align": "center"
              },
              children: [
                {
                  type: "element",
                  content: {
                    elementType: "text",
                    style: {
                      "margin-right": "7px",
                      "font-size": "28px",
                      "vertical-align": "middle"
                    },
                    children: [
                      {
                        type: "dynamic",
                        content: {
                          referenceType: "prop",
                          id: "flag"
                        }
                      }
                    ]
                  }
                },
                {
                  type: "dynamic",
                  content: {
                    referenceType: "prop",
                    id: "name"
                  }
                }
              ]
            }
          },
          {
            type: "element",
            content: {
              elementType: "textblock",
              style: {
                "font-size": "16px",
                margin: "0",
                "text-align": "center"
              },
              children: [
                {
                  type: "element",
                  content: {
                    elementType: "link",
                    style: {
                      "text-decoration": "none",
                      color: "#822cec"
                    },
                    attrs: {
                      url: {
                        type: "dynamic",
                        content: {
                          referenceType: "prop",
                          id: "link"
                        }
                      }
                    },
                    children: ["$props.displayLink"]
                  }
                }
              ]
            }
          },
          {
            type: "element",
            content: {
              elementType: "textblock",
              children: [
                {
                  type: "dynamic",
                  content: {
                    referenceType: "prop",
                    id: "bio"
                  }
                }
              ]
            }
          }
        ]
      }
    }
  };

  const reactCodeGen = new ReactGenerator();
  reactCodeGen.traverseUidl(uidl);
  console.log("generated code =>", reactCodeGen.code);
  console.log("generated styles =>", reactCodeGen.styleSheet);
  const props = {};
  props.bio = "bio";
  props.flag = "";
  props.url = "https://www.gstatic.com/webp/gallery/1.sm.webp";
  props.name = "lokesh";
  // console.log(props);

  return <React.Fragment />;
}
