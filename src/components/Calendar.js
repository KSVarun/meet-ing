import React from "react";

class Calendar extends React.Component {
  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      window.gapi.auth2.init({
        client_id: process.env.REACT_APP_CLIENT_ID,
      });
    });
  }

  /**
   * Sample JavaScript code for calendar.events.insert
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/guides/code_samples#javascript
   */

  authenticate() {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn({
        scope:
          "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
      })
      .then(
        function () {
          console.log("Sign-in successful");
        },
        function (err) {
          console.error("Error signing in", err);
        }
      );
  }
  loadClient() {
    window.gapi.client.setApiKey(process.env.REACT_APP_API_KEY);
    return window.gapi.client
      .load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
      .then(
        function () {
          console.log("GAPI client loaded for API");
        },
        function (err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  execute() {
    return window.gapi.client.calendar.events
      .insert({
        calendarId: "primary",
        resource: {
          end: {
            dateTime: "2020-05-28T18:00:00+05:30",
            timeZone: "Asia/Kolkata",
          },
          start: {
            timeZone: "Asia/Kolkata",
            dateTime: "2020-05-28T17:00:00+05:30",
          },
          summary: "test-summary-update",
          description: "test-description-update",
          attendees: [
            {
              email: "ksvarun002@gmail.com",
            },
            {
              email: "varunks001@gmail.com",
            },
          ],
        },
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
        },
        function (err) {
          console.error("Execute error", err);
        }
      );
  }

  render() {
    return (
      <div>
        <button
          className="ui button"
          onClick={() => this.authenticate().then(this.loadClient)}
        >
          authorize and load
        </button>

        <button className="ui button" onClick={() => this.execute()}>
          execute
        </button>
      </div>
    );
  }
}

export default Calendar;
