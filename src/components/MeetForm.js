import React, { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import DatePicker from "react-datepicker";
import moment from "moment";
import uuid from "uuid/v4";
import { Link, useHistory } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

import { addEvent, updateEvent } from "../api/Schedule";

const MeetForm = (props) => {
  var schedule = {};

  const history = useHistory();

  const [buttonClassName, setButtonClassName] = useState("ui primary button");
  const [update, setUpdate] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [buttonMsg, setButtonMsg] = useState("SCHEDULE");

  const attendees = [
    { name: "Alex", email: "alex@gmail.com" },
    { name: "Jarvis", email: "jarvis@gmail.com" },
    { name: "Siri", email: "siri@gmail.com" },
    { name: "Cortana", email: "cortana@gmail.com" },
    { name: "Alexa", email: "alexa@gmail.com" },
    { name: "Eric", email: "eric@gmail.com" },
    { name: "Elliot", email: "elliot@gmail.com" },
  ];

  useEffect(() => {
    if (props.location.state) {
      setUpdate(props.location.state.eventId);
      setDisabled(true);
      setButtonMsg("UPDATE SCHEDULE");
    }
  }, [props.location.state]);

  const handleLS = (reseponse, key) => {
    setButtonClassName("ui primary button");

    if (update.length === 0) {
      var existing = localStorage.getItem("events");
      existing = existing ? JSON.parse(existing) : [];

      // Add new data to localStorage Array
      existing.push({
        key: key,
        summary: schedule.summary,
        description: schedule.description,
        startDateTime: moment(schedule.startDateTime).format(
          "MMMM Do YYYY, h:mm A"
        ),
        endDateTime: moment(schedule.endDateTime).format(
          "MMMM Do YYYY, h:mm A"
        ),
        attendees: schedule.attendees,
        eventId: reseponse.data.eventId,
        startDateObj: schedule.startDateTime,
        endDateObj: schedule.endDateTime,
        meetURL: reseponse.data.url,
      });

      localStorage.setItem("events", JSON.stringify(existing));
    } else {
      var events = JSON.parse(localStorage.getItem("events"));
      localStorage.clear();
      var updatedEvents = events.filter(
        (event) => event.eventId !== props.location.state.eventId
      );
      updatedEvents.push({
        key: key,
        summary: schedule.summary,
        description: schedule.description,
        startDateTime: moment(schedule.startDateTime).format(
          "MMMM Do YYYY, h:mm A"
        ),
        endDateTime: moment(schedule.endDateTime).format(
          "MMMM Do YYYY, h:mm A"
        ),
        attendees: schedule.attendees,
        eventId: reseponse.data.eventId,
        startDateObj: schedule.startDateTime,
        endDateObj: schedule.endDateTime,
        meetURL: reseponse.data.url,
      });
      localStorage.setItem("events", JSON.stringify(updatedEvents));
    }
  };

  const handleSubmit = async (data) => {
    setButtonClassName("ui primary loading button");

    if (update.length === 0) {
      var updatedSummary = String(data.program).concat(
        " - ",
        String(data.batch),
        " - ",
        String(data.summary)
      );

      schedule = {
        summary: updatedSummary,
        description: data.meeting_name,
        startDateTime: moment(data.start_date).format(),
        endDateTime: moment(data.end_date).format(),
        attendees: data.attendees,
      };

      return await addEvent(schedule);
    } else {
      schedule = {
        summary: props.location.state.summary,
        description: props.location.state.description,
        startDateTime: moment(data.start_date).format(),
        endDateTime: moment(data.end_date).format(),
        attendees: props.location.state.attendees,
      };
      return await updateEvent(props.location.state.eventId, schedule);
    }
  };

  return (
    <div>
      <Link
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        to="/"
        className="ui primary button"
      >
        EVENTS
      </Link>
      <h4 className="ui horizontal divider header">{buttonMsg} MEET</h4>
      <Formik
        enableReinitialize
        initialValues={{
          program: "",
          batch: "",
          meeting_name: update.length > 0 ? props.location.state.summary : "",
          start_date: "",
          end_date: "",
          attendees: [],
          summary: update.length > 0 ? props.location.state.description : "",
        }}
        onSubmit={(data, { resetForm }) => {
          handleSubmit(data)
            .then((reseponse) => {
              handleLS(reseponse, uuid());
            })
            .then(() => {
              history.push("/");
            })
            .catch((err) => console.log(err));

          resetForm();
        }}
      >
        {({ values, setFieldValue, handleChange }) => (
          <Form className="ui form">
            <div className="field">
              <label>Program</label>
              <select
                className="selectpicker"
                name="program"
                title="Select Program"
                onChange={handleChange}
                disabled={disabled}
              >
                <option>Grade 1</option>
                <option>Grade 2</option>
                <option>Grade 3</option>
              </select>
            </div>
            <div className="field">
              <label>Batch</label>
              <select
                className="selectpicker"
                name="batch"
                title="Select Batch"
                onChange={handleChange}
                disabled={disabled}
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>
            <div className="field">
              <label>Meeting Name</label>
              <Field
                autoFocus
                name="meeting_name"
                type="text"
                disabled={disabled}
              ></Field>
            </div>
            <div className="field">
              <label>Summary</label>
              <Field name="summary" type="text" disabled={disabled}></Field>
            </div>
            <div className="field">
              <label>Start Time</label>
              <DatePicker
                selected={values.start_date}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={60}
                timeCaption="time"
                dateFormat="yyyy-MM-dd, HH:mm"
                onChange={(date) => {
                  setFieldValue("start_date", date);
                }}
              />
            </div>
            <div className="field">
              <label>End Time</label>
              <DatePicker
                selected={values.end_date}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={60}
                timeCaption="time"
                dateFormat="yyyy-MM-dd, HH:mm"
                onChange={(date) => {
                  setFieldValue("end_date", date);
                }}
              />
            </div>
            <div className="field">
              <label>Attendees</label>
              <select
                className="selectpicker"
                multiple
                name="attendees"
                data-live-search="true"
                title="Select Attendees"
                data-dropup-auto="false"
                data-actions-box="true"
                data-size="3"
                data-selected-text-format="count > 3"
                onChange={handleChange}
                disabled={disabled}
              >
                {attendees.map((attendee) => {
                  return (
                    <option key={attendee.email} value={attendee.email}>
                      {attendee.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button className={buttonClassName} type="submit">
                {buttonMsg}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MeetForm;
