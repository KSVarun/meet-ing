import React from "react";

import Calendar from "./Calendar";
import MeetForm from "./MeetForm";

class App extends React.Component {
  state = {
    logged_in: false,
  };

  updateLogin = (status) => {
    this.setState({ logged_in: status });
  };

  render() {
    return (
      <div className="ui container" style={{ margin: "10px" }}>
        <div>
          <Calendar
            expires_at={this.state.expires_at}
            onUpdateLogin={this.updateLogin}
          />
        </div>
        <div>
          <MeetForm loginStatus={this.state.logged_in} />
        </div>
      </div>
    );
  }
}

export default App;
