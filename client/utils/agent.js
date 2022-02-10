import axios, { AxiosError, AxiosResponse } from "axios"
import { toast } from "react-toastify"

axios.defaults.baseURL = "/api"

// Helper fundtion for getting actual data from axios response
const responseBody = (response) => response.data

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response
  },
  function (error) {
    // Do something with response error
    const { data, status } = error.response
    switch (status) {
      // 404 we will handle inside component
      case 400:
        toast.error(data.message)
        return false
      case 401:
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
    return Promise.reject(error)
  }
)

// Reusable Object for diff type of requests
const nonAuthRequests = {
  get: async (url) => responseBody(await axios.get(url)),
  post: async (url, body) => responseBody(await axios.post(url, body)),
  put: async (url, body) => responseBody(await axios.put(url, body)),
  delete: async (url) => responseBody(await axios.delete(url)),
}

const Auth = {
  register: (formData) => nonAuthRequests.post("/register", formData),
  // addItem: (productId: number, quantity: number = 1) =>
  //   requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
  // removeItem: (productId: number, quantity: number = 1) =>
  //   requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}

const agent = {
  Auth,
}

export default agent
