import React, { useState, useEffect } from "react";

class Calendar extends React.Component {
  state = {
    button: "Loading",
    class_name: "ui loading button",
    logged_in: false,
  };

  handleUpdateButton = (isSignedIn) => {
    if (!isSignedIn) {
      this.setState({ button: "LOGIN", class_name: "ui red button" });
    } else {
      this.setState({
        button: "LOGGED_IN",
        logged_in: true,
        class_name: "ui button green",
      });
      this.props.onUpdateLogin(this.state.logged_in);
    }
  };
  componentDidMount = () => {
    window.gapi.load("client:auth2", () => {
      window.gapi.auth2
        .init({
          client_id: process.env.REACT_APP_CLIENT_ID,
        })
        .then(
          () => {
            window.gapi.client.setApiKey(process.env.REACT_APP_API_KEY);
            window.gapi.client
              .load(
                "https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest"
              )
              .then(
                () => {
                  console.log("GAPI client loaded for API");
                },
                (err) => {
                  console.error("Error loading GAPI client for API", err);
                }
              );
            //fetch google auth
            var GoogleAuth = window.gapi.auth2.getAuthInstance();
            this.handleUpdateButton(GoogleAuth.isSignedIn.get());
            //fetch google user
            var GoogleUser = GoogleAuth.currentUser.get();
            console.log(GoogleUser.reloadAuthResponse());
          },
          (err) => {
            console.log("Error logging in ");
            var GoogleAuth = window.gapi.auth2.getAuthInstance();
            this.handleUpdateButton(GoogleAuth.isSignedIn.get());
          }
        );
    });
  };

  authenticate = () => {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn({
        scope:
          "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
      })
      .then(
        () => {
          var GoogleAuth = window.gapi.auth2.getAuthInstance();
          this.handleUpdateButton(GoogleAuth);
          this.load();
        },
        (err) => {
          console.error("Error signing in", err);
        }
      );
  };

  load = () => {
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
  };
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
          onClick={() => this.authenticate()}
        >
          {this.state.button}
        </button>
      </div>
    );
  }
}

export default Calendar;
