import React, { useState } from "react";

import Calendar from "./Calendar";
import MeetForm from "./MeetForm";

const App = () => {
  const [logged, setLogged] = useState(false);

  const updateLogin = (status) => {
    setLogged(status);
  };

  return (
    <div className="ui container" style={{ margin: "10px" }}>
      <div>
        <Calendar onUpdateLogin={updateLogin} />
      </div>
      <div>
        <MeetForm loginStatus={logged} />
      </div>
    </div>
  );
};

export default App;
