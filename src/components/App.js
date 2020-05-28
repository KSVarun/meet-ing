import React from "react";

import Calendar from "./Calendar";
import MeetForm from "./MeetForm";

class App extends React.Component {
  render() {
    return (
      <div>
        <Calendar />
        <MeetForm />
      </div>
    );
  }
}

export default App;
