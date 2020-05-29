import React, { useState, useEffect } from "react";

class Calendar extends React.Component {
  state = {
    expiry: "",
    button: "",
    class_name: "ui button red",
    logged_in: false,
  };

  handleUpdateButton = () => {
    if (
      this.state.expiry === "" ||
      this.state.expiry < new Date().setSeconds(0, 0)
    ) {
      this.setState({ button: "LOGIN" });
    } else {
      this.setState({ button: "LOGGED_IN", logged_in: true });
      this.props.onUpdateLogin(this.state.logged_in);
    }
  };
  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      window.gapi.auth2.init({
        client_id: process.env.REACT_APP_CLIENT_ID,
      });
    });

    this.handleUpdateButton();
  }

  authenticate = () => {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn({
        scope:
          "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
      })
      .then(
        (response) => {
          this.setState({
            expiry: response.wc.expires_at,
            button: "LOGGED_IN",
            class_name: "ui button green",
            logged_in: true,
          });

          this.handleUpdateButton();
        },
        (err) => {
          console.error("Error signing in", err);
        }
      );
  };
  loadClient() {
    window.gapi.client.setApiKey(process.env.REACT_APP_API_KEY);
    return window.gapi.client
      .load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
      .then(
        () => {
          console.log("GAPI client loaded for API");
        },
        (err) => {
          console.error("Error loading GAPI client for API", err);
        }
      );
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "auto",
        }}
      >
        <button
          className={this.state.class_name}
          onClick={() => this.authenticate().then(this.loadClient)}
        >
          {this.state.button}
        </button>
      </div>
    );
  }
}

export default Calendar;
