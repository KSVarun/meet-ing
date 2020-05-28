import React from "react";
import { Formik, Field, Form } from "formik";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

class MeetForm extends React.Component {
  state = {
    value: "",
    attendees_name: [],
    meeting_name: "",
    start_date: new Date(),
    end_date: "",
  };
  handleAdd = () => {
    this.setState((state) => {
      const attendees_name = [...state.attendees_name, state.value];

      return {
        value: "",
        attendees_name: attendees_name,
      };
    });
  };

  handleAttendeeChange = (event) =>
    this.setState({ value: event.target.value });

  handleCancle = (remove_item) => {
    this.setState((state) => {
      const attendees_name = state.attendees_name.filter(
        (item) => item !== remove_item
      );

      return {
        value: "",
        attendees_name: attendees_name,
      };
    });
  };

  render() {
    // console.log(this.state);
    return (
      <div>
        <Formik
          initialValues={{
            meeting_name: "",
            start_date: this.state.start_date,
            end_date: "",
            email: "",
            attendees: [],
          }}
          onSubmit={(values) => {
            console.log(values);
            console.log(moment(values.start_date).format());
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="ui form">
              <div className="field">
                <label>Meeting Name</label>
                <Field autoFocus name="meeting_name" type="text"></Field>
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
                <div className="ui action input">
                  <input
                    name="meeting_name"
                    type="email"
                    onChange={(email) => setFieldValue("email", email)}
                    placeholder="Email"
                  />
                  <button type="button">Add</button>
                </div>
              </div>
              <div>
                {this.state.attendees_name.map((item, index) => {
                  return (
                    <div key={item}>
                      <div>{item}</div>
                      <span onClick={() => this.handleCancle(item)}>
                        cancle
                      </span>
                    </div>
                  );
                })}
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
