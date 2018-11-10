import React from "react";
import { Router } from "./components";
import routes from "./pages/routes";
import "./styles/index.less";

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        {/* <Header></Header> */}
        <div className="flex-1 flex column full-y">
          <Router routes={routes} />
        </div>
      </React.Fragment>
    );
  }
} // class App end