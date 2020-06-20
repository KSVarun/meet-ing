import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import DatePicker from "react-datepicker";
import moment from "moment";
import uuid from "uuid/v4";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import * as yup from "yup";
import { TextField, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import "react-datepicker/dist/react-datepicker.css";

import { addEvent, updateEvent } from "../api/Schedule";

const MeetForm = (props) => {
  var schedule = {};

  const history = useHistory();

  const [buttonClassName, setButtonClassName] = useState("ui primary button");
  const [update, setUpdate] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [buttonMsg, setButtonMsg] = useState("SCHEDULE");
  const [open, setOpen] = useState(false);

  const attendees = [
    { label: "Alex", value: "alex@gmail.com" },
    { label: "Jarvis", value: "jarvis@gmail.com" },
    { label: "Siri", value: "siri@gmail.com" },
    { label: "Cortana", value: "cortana@gmail.com" },
    { label: "Alexa", value: "alexa@gmail.com" },
    { label: "Eric", value: "eric@gmail.com" },
    { label: "Elliot", value: "elliot@gmail.com" },
  ];

  const program = [
    { label: "Group 1", value: "Group 1" },
    { label: "Group 2", value: "Group 2" },
    { label: "Group 3", value: "Group 3" },
  ];

  const batch = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
  ];

  useEffect(() => {
    if (props.location.state) {
      setUpdate(props.location.state.eventId);
      setDisabled(true);
      setButtonMsg("UPDATE SCHEDULE");
    }
  }, [props.location.state]);

  const handleLS = (reseponse, key, data) => {
    setButtonClassName("ui primary button");

    if (update.length === 0) {
      var existing = localStorage.getItem("events");
      existing = existing ? JSON.parse(existing) : [];

      // Add new data to localStorage Array
      existing.push({
        key: key,
        program: data.program,
        batch: data.batch,
        summary: schedule.summary,
        description: schedule.description,
        attendees: data.attendees,
        eventId: reseponse.data.eventId,
        startDateObj: data.start_date,
        endDateObj: data.end_date,
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
        program: data.program,
        batch: data.batch,
        summary: schedule.summary,
        description: schedule.description,
        attendees: data.attendees,
        eventId: reseponse.data.eventId,
        startDateObj: data.start_date,
        endDateObj: data.end_date,
        meetURL: reseponse.data.url,
      });
      localStorage.setItem("events", JSON.stringify(updatedEvents));
    }
  };

  const handleSubmit = async (data) => {
    setButtonClassName("ui primary loading button");

    if (update.length === 0) {
      var updatedSummary = String(data.program.value).concat(
        " - ",
        String(data.batch.value),
        " - ",
        String(data.summary)
      );

      schedule = {
        summary: updatedSummary,
        description: data.meeting_name,
        startDateTime: moment(data.start_date).format(),
        endDateTime: moment(data.end_date).format(),
        attendees: data.attendees.map((a) => a.value),
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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const validationSchema = yup.object({
    meeting_name: yup.string().required().max(30),
    summary: yup.string().required().max(30),
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Link to="/" className="ui primary button">
          EVENTS
        </Link>
      </div>
      <h4 className="ui horizontal divider header">{buttonMsg} MEET</h4>
      <Formik
        validateOnChange={true}
        enableReinitialize
        initialValues={{
          program: update.length > 0 ? props.location.state.program : "",
          batch: update.length > 0 ? props.location.state.batch : "",
          meeting_name: update.length > 0 ? props.location.state.summary : "",
          start_date:
            update.length > 0
              ? new Date(props.location.state.startDateObj)
              : "",
          end_date:
            update.length > 0 ? new Date(props.location.state.endDateObj) : "",
          attendees: update.length > 0 ? props.location.state.attendees : "",
          summary: update.length > 0 ? props.location.state.description : "",
        }}
        validationSchema={validationSchema}
        onSubmit={(data) => {
          handleSubmit(data)
            .then((reseponse) => {
              handleLS(reseponse, uuid(), data);
            })
            .then(() => {
              history.push("/");
            })
            .catch((err) => {
              setOpen(true);
              setButtonClassName("ui primary button");

              console.log(err);
            });
        }}
      >
        {({ values, setFieldValue, handleChange, handleBlur, errors }) => (
          <Form className="ui form error">
            <div className="required field">
              <label>Program</label>
              <Select
                autoFocus
                name="program"
                options={program}
                className="basic-single"
                classNamePrefix="select"
                onChange={(value) => {
                  setFieldValue("program", value);
                }}
                value={values.program}
                isDisabled={disabled}
              />
            </div>
            <div className="required field">
              <label>Batch</label>
              <Select
                name="batch"
                options={batch}
                className="basic-single"
                classNamePrefix="select"
                onChange={(value) => {
                  setFieldValue("batch", value);
                }}
                value={values.batch}
                isDisabled={disabled}
              />
            </div>
            <div className="required field">
              <label>Meeting Name</label>
              <TextField
                name="meeting_name"
                type="text"
                disabled={disabled}
                error={!!errors.meeting_name}
                helperText={errors.meeting_name}
                fullWidth
                value={values.meeting_name}
                onChange={handleChange}
                onBlur={handleBlur}
              ></TextField>
            </div>

            <div className="required field">
              <label>Summary</label>
              <TextField
                name="summary"
                type="text"
                error={!!errors.summary}
                helperText={errors.summary}
                disabled={disabled}
                fullWidth
                value={values.summary}
                onChange={handleChange}
                onBlur={handleBlur}
              ></TextField>
            </div>

            <div className="required field">
              <label>Start Time</label>
              <DatePicker
                selected={values.start_date}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="time"
                dateFormat="yyyy-MM-dd, HH:mm"
                onChange={(date) => {
                  setFieldValue("start_date", date);
                }}
                value={values.start_date}
              />
            </div>
            <div className="required field">
              <label>End Time</label>
              <DatePicker
                selected={values.end_date}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="time"
                dateFormat="yyyy-MM-dd, HH:mm"
                onChange={(date) => {
                  setFieldValue("end_date", date);
                }}
                value={values.end_date}
              />
            </div>
            <div className="required field">
              <label>Attendees</label>
              <Select
                isMulti
                name="attendees"
                options={attendees}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(value) => {
                  setFieldValue("attendees", value);
                }}
                closeMenuOnSelect={false}
                value={values.attendees}
                isDisabled={disabled}
              />
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
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity="error">
          Some thing happened! Please check the form and retry
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MeetForm;
