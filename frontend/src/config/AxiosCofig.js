import axios from "axios";

const api = axios.create({
  baseURL:'http://43.204.150.47:8000',
  timeout:5000
})


api.interceptors.request.use(
  (config)=>{
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
  },
  (error) => {
    // Handle request error
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
)

api.interceptors.response.use(
  (response) => {
    console.log("Response Interceptor: Response received");
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Response Interceptor: Unauthorized access - Redirecting to login");
    } else {
      console.error("Response Interceptor Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api