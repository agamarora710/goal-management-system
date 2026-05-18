import axios from "axios"

const api = axios.create({
  baseURL: "https://goal-management-backend.onrender.com",
})

export default api