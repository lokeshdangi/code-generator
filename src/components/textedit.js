import React from "react";

class MyComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      value: ""
    };
  }

  handleBlur = event => {
    this.divref.innerHTML = this.node.value;
    this.node.remove();
    this.rootref.append(this.divref);
  };

  handleChange = event => {
    console.log("ref =>", this.divref);
    this.node = document.createElement("input");
    this.node.value = this.divref.innerHTML;
    this.node.onblur = this.handleBlur;
    this.divref.remove();
    console.log("node =>", this.node);
    this.rootref.appendChild(this.node);
  };

  render = () => {
    return (
      <React.Fragment>
        <div
          ref={node => {
            this.rootref = node;
          }}
        >
          <div
            ref={node => {
              this.divref = node;
            }}
            onClick={this.handleChange}
          >
            Text
          </div>
        </div>
      </React.Fragment>
    );
  };
}
export default MyComponent;
