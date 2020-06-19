import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { deleteEvent } from "../api/Schedule";

const Events = () => {
  const [key, setKey] = useState("");
  const [parentLoadDiv, setParentLoadDiv] = useState("");
  const [childLoadDiv, setChildLoadDiv] = useState("");
  const [deleteText, setDeleteText] = useState("");

  useEffect(() => {
    handleRender();
  }, [key]);

  const handleDelete = (eventId) => {
    var events = JSON.parse(localStorage.getItem("events"));
    localStorage.clear();
    var updatedEvents = events.filter((event) => event.eventId !== eventId);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setKey(eventId);
  };

  const handleRender = () => {
    if (
      JSON.parse(localStorage.getItem("events")) |
      (JSON.parse(localStorage.getItem("events")).length !== 0)
    ) {
      var events = JSON.parse(localStorage.getItem("events"));
      return (
        <div>
          <Link to="/schedule" className="ui primary button">
            CREATE MEET
          </Link>

          <h4 className="ui horizontal divider header">EVENTS</h4>
          <div className={parentLoadDiv}>
            <div className={childLoadDiv}>{deleteText}</div>
          </div>
          <div className="ui cards">
            {events.map((e) => {
              return (
                <div className="card" key={e.key}>
                  <div className="content">
                    <Link to={{ pathname: "/schedule", state: e }}>
                      <i className="right floated edit icon"></i>
                    </Link>
                    <i
                      className="right floated trash icon"
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => {
                        setParentLoadDiv("ui active inverted dimmer");
                        setChildLoadDiv("ui text loader");
                        setDeleteText("Deleting");
                        deleteEvent(e.eventId).then((response) => {
                          setParentLoadDiv("");
                          setChildLoadDiv("");
                          setDeleteText("");
                          handleDelete(e.eventId);
                        });
                      }}
                    ></i>
                    <div className="header">{e.summary}</div>
                    <div className="description">{e.description}</div>
                    <div className="description">{e.startDateTime}</div>
                    <div className="description">{e.endDateTime}</div>
                    <a
                      href={e.meetURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="description"
                    >
                      {e.meetURL}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Link
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            to="/schedule"
            className="ui primary button"
          >
            CREATE MEET
          </Link>
          <h4 className="ui horizontal divider header">EVENTS</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            NO EVENTS
          </div>
        </div>
      );
    }
  };

  return handleRender();
};

export default Events;
