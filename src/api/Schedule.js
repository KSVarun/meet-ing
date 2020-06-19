import axios from "axios";

export function updateEvent(id, requestBody) {
  // return new Promise(resolve => {
  //   setTimeout(() => {
  //     resolve(requestBody);
  //   }, 1000);
  // });
  return axios.put(`/update/${id}`, requestBody);
}

export function deleteEvent(id) {
  return axios.delete(`/delete/${id}`);
}

export function addEvent(schedule) {
  return axios.post(`/schedule/`, schedule);
}

export function findByName(topicName) {
  return axios.get(`/topics/${topicName}`);
}

export function sortByName(topicName, type) {
  return axios.get(`/topics?sort=${topicName},${type}`);
}
