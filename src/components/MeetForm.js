import React from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

class MeetForm extends React.Component {
  render() {
    // console.log(this.state);
    return (
      <div>
        <Formik
          enableReinitialize
          initialValues={{
            meeting_name: "",
            start_date: "",
            end_date: "",
            attendees: [],
            summary: "",
          }}
          onSubmit={(values, { resetForm }) => {
            console.log(values);
            console.log(moment(values.start_date).format());
            resetForm();
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
                <Field autoFocus name="summary" type="text"></Field>
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
                              <label htmlFor={`attendees.${index}.email`}>
                                Email
                              </label>
                              <Field
                                name={`attendees.${index}.email`}
                                placeholder="Email"
                                type="text"
                              />
                            </div>
                            <div className="col">
                              <button
                                type="button"
                                className="secondary"
                                onClick={() => remove(index)}
                              >
                                X
                              </button>
                            </div>
                          </div>
                        ))}
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => push({ email: "" })}
                      >
                        Add Attendee
                      </button>
                    </div>
                  )}
                />
              </div>
              <div>
                <button className="ui primary button" type="submit">
                  CREATE MEET
                </button>
              </div>
              <pre>{JSON.stringify(values)}</pre>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default MeetForm;
