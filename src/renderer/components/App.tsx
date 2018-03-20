import { ipcRenderer } from "electron";
import * as React from "react";

interface IState {
  messages: string;
}

export class App extends React.Component<{}, IState> {
  state: IState = {
    messages: ""
  };

  componentDidMount() {
    ipcRenderer.on("message", (event: any, text: string) => {
      this.setState({ messages: text });
    });
  }

  render() {
    return (
      <div>
        Current version: <span>{window.location.hash.substring(1)}</span>
        {this.state.messages}
        <p>this is beta</p>
      </div>
    );
  }
}
