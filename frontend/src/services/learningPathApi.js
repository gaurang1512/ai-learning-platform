import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export const generateLearningPath = (data) =>
  API.post("api/v1/learning-path", data);

export const getMyLearningPaths = () => API.get("api/v1/my-paths");

export const markWeekCompleted = (data) =>
  API.post("api/v1/learning-path/complete-week", data);
