import React from "react";
export default class PersonSpotlight extends React.Component {
  render() {
    const props = this.props;
    return (
      <div className="container0" style={styles.container0}>
        <div className="container1" style={styles.container1}>
          <div className="container2" style={styles.container2} />
          <div className="container3" style={styles.container3} />
        </div>
        <div className="container4" style={styles.container4}>
          <div className="container5" style={styles.container5} />
          <div className="container6" style={styles.container6}>
            <div className="container7" style={styles.container7} />
          </div>
          <div className="container8" style={styles.container8} />
        </div>
      </div>
    );
  }
}

const styles = {
  container2: {},
  container3: {},
  container1: {},
  container5: {},
  container7: {},
  container6: {},
  container8: {},
  container4: {},
  container0: {}
};
