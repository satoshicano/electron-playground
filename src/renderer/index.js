import React from "react";
import { render } from "react-dom";
import { ipcRenderer } from "electron";

export class Messeage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: ""
    };
  }

  componentDidMount() {
    ipcRenderer.on("message", function(event, text) {
      this.setState({ message: text });
    });
  }
  render() {
    return <div>{this.state.messages}</div>;
  }
}

render(
  <div>
    Current version: <span>v{window.location.hash.substring(1)}</span>
    <Messeage />
  </div>,
  document.querySelector("#app")
);
