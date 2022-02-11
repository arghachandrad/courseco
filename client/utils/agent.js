import axios from "axios"
import { toast } from "react-toastify"
import { logout } from "../redux/auth/actions"
import { store } from "../redux/store"

axios.defaults.baseURL = "/api"

// Helper fundtion for getting actual data from axios response
const responseBody = (response) => response.data

// Reusable Object for diff type of requests
const nonAuthRequests = {
  get: async (url) => responseBody(await axios.get(url)),
  post: async (url, body) => responseBody(await axios.post(url, body)),
  put: async (url, body) => responseBody(await axios.put(url, body)),
  delete: async (url) => responseBody(await axios.delete(url)),
}

// Feature wise api calls
const Auth = {
  register: (formData) => nonAuthRequests.post("/register", formData),
  login: (formData) => nonAuthRequests.post("/login", formData),
  logout: () => nonAuthRequests.get("/logout"),
}

// in request header putting csrf (prevention against csrf attacks)
export const getCsrfToken = async () => {
  try {
    const { csrfToken } = responseBody(await axios.get("/csrf-token"))
    axios.defaults.headers["X-CSRF-Token"] = csrfToken
  } catch (error) {
    console.log(error)
  }
}

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response
  },
  function (error) {
    // Do something with response error

    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        // 404 we will handle inside component
        case 400:
          toast.error(data.message)
          return false
        case 401:
          // unauthorized so redirect to login page and clear user data
          store.dispatch(logout()) // clear user data
          Auth.logout() // clear cookie in backend
          window.location.href = "/login"
          toast.error(data.message)
          return false
        case 500:
          toast.error(data.message)
          return false
        case 404:
          toast.error(data.message)
          return false
        default:
          break
      }
    }

    return Promise.reject(error)
  }
)

const agent = {
  Auth,
}

export default agent
