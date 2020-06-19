import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import MeetForm from "./MeetForm";
import Events from "./Events";

class App extends React.Component {
  render() {
    return (
      <div className="ui container" style={{ margin: "10px" }}>
        <Router>
          <Switch>
            <Route path="/schedule" component={MeetForm} />
            <Route path="/" component={Events} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
