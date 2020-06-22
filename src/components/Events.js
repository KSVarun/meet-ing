import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Modal } from "antd";
import { deleteEvent } from "../api/Schedule";

import "antd/dist/antd.css";

import SnackNotification from "./SnackNotification";

const Events = (props) => {
  const [key, setKey] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [eventId, setEventId] = useState("");
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    handleRender();
  }, [key]);

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  }

  function handleDelete(eventId) {
    var events = JSON.parse(localStorage.getItem("events"));
    localStorage.clear();
    var updatedEvents = events.filter((event) => event.eventId !== eventId);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setKey(eventId);
  }

  const handleRender = () => {
    console.log(snackOpen);
    if (
      JSON.parse(localStorage.getItem("events")) &&
      JSON.parse(localStorage.getItem("events")).length > 0
    ) {
      var events = JSON.parse(localStorage.getItem("events"));
      return (
        <div>
          <Modal
            title="Delete confirmation"
            visible={openModal}
            okText="Delete"
            onOk={() => {
              setLoading(true);
              deleteEvent(eventId).then((response) => {
                setLoading(false);
                handleDelete(eventId);
                setSnackOpen(true);
                setOpenModal(false);
              });
            }}
            onCancel={() => {
              setOpenModal(false);
            }}
            confirmLoading={loading}
            cancelButtonProps={{ disabled: loading }}
          >
            <p>
              Are you sure you want to delete the event:{" "}
              <strong>{eventName}</strong>
            </p>
          </Modal>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Link to="/schedule" className="ui primary button">
              CREATE MEET
            </Link>
          </div>

          <h4 className="ui horizontal divider header">EVENTS</h4>

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
                        setOpenModal(true);
                        setEventId(e.eventId);
                        setEventName(e.summary);
                      }}
                    ></i>
                    <div className="header">{e.summary}</div>
                    <div className="description">
                      <h6>{e.description}</h6>
                    </div>
                    <div className="description">
                      {moment(e.startDateObj).format("MMMM Do YYYY, h:mm A")}
                    </div>
                    <div className="description">
                      {moment(e.endDateObj).format("MMMM Do YYYY, h:mm A")}
                    </div>
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
          <SnackNotification
            open={snackOpen}
            handleClose={handleClose}
            message="Delete successful"
            severiaty="success"
          />
        </div>
      );
    } else {
      return (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Link to="/schedule" className="ui primary button">
              CREATE MEET
            </Link>
          </div>

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
