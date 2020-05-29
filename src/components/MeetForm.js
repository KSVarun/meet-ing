import React, { useState } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

const MeetForm = ({ loginStatus }) => {
  const [url, setUrl] = useState("");

  const execute = (data) => {
    return window.gapi.client.calendar.events
      .insert({
        calendarId: "primary",
        resource: {
          end: {
            dateTime: moment(data.end_date).format(),
            timeZone: "Asia/Kolkata",
          },
          start: {
            timeZone: "Asia/Kolkata",
            dateTime: moment(data.start_date).format(),
          },
          summary: data.summary,
          description: data.meeting_name,
          attendees: data.attendees,
        },
      })
      .then(
        (response) => {
          setUrl(response.result.hangoutLink);
        },
        (err) => {
          console.error("Execute error", err);
        }
      );
  };
  return (
    <div>
      <h4 className="ui horizontal divider header">SCHEDULE MEET</h4>
      <Formik
        enableReinitialize
        initialValues={{
          meeting_name: "",
          start_date: "",
          end_date: "",
          attendees: [],
          summary: "",
        }}
        onSubmit={(data, { resetForm }) => {
          execute(data).then(resetForm);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="ui form">
            <div className="field">
              <label>Meeting Name</label>
              <Field autoFocus name="meeting_name" type="text"></Field>
            </div>
            <div className="field">
              <label>Summary</label>
              <Field name="summary" type="text"></Field>
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
                onChange={(date) => setFieldValue("start_date", date)}
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
                onChange={(date) => setFieldValue("end_date", date)}
              />
            </div>
            <div className="field">
              <label>Attendees</label>
              <FieldArray
                name="attendees"
                render={({ insert, remove, push }) => (
                  <div>
                    {values.attendees.length > 0 &&
                      values.attendees.map((attendee, index) => (
                        <div className="row" key={index}>
                          <div className="col">
                            <label
                              htmlFor={`attendees.${index}.email`}
                              style={{ marginBottom: "5px" }}
                            >
                              Email
                            </label>
                            <Field
                              name={`attendees.${index}.email`}
                              placeholder="Email"
                              type="text"
                              style={{ marginBottom: "5px" }}
                            />
                          </div>
                          <div className="col">
                            <button
                              type="button"
                              className="mini ui button"
                              onClick={() => remove(index)}
                              style={{ marginBottom: "5px" }}
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ))}
                    <button
                      type="button"
                      className="ui button"
                      onClick={() => push({ email: "" })}
                    >
                      Add Attendee
                    </button>
                  </div>
                )}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                className="ui primary button"
                type="submit"
                disabled={!loginStatus}
              >
                CREATE MEET
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <h4 className="ui horizontal divider header">MEET URL</h4>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    </div>
  );
};

export default MeetForm;
