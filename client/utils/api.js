import axios from "axios"
import { toast } from "react-toastify"

// For Creating a Delay so that we can see loading
// const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

axios.defaults.baseURL = "http://localhost:5000/api/"
axios.defaults.withCredentials = true

// Helper fundtion for getting actual data from axios response
const responseBody = (response) => response.data

// AXIOS INTERCEPTOR - intercepting the response coming back from API
// use(onFulfilled, onRejected) => onFulfilled we are returning the actual res, But onRejected(i.e. 400,500 range err) we are intercepting the res
axios.interceptors.response.use(
  async (res) => {
    // await sleep(); // creating a delay
    return res
  },
  (error) => {
    const { data, status } = error.response
    switch (status) {
      // 404 we will handle inside component
      case 400:
        // toast.error(data.title);
        break
      case 401:
        // toast.error(data.title);
        break
      case 500:
        // also need to send the server error to ServerError Component
        // toast.error(data.title);
        break
      case 404:
        // also need to send the server error to ServerError Component
        // toast.error(data.title);
        break
      default:
        break
    }
    return Promise.reject(error.response)
  }
)

// Reusable Object for diff type of requests
const withoutAuthRequests = {
  get: async (url) => responseBody(await axios.get(url)),
  post: async (url, body) => responseBody(await axios.post(url, body)),
  put: async (url, body) => responseBody(await axios.put(url, body)),
  delete: async (url) => responseBody(await axios.delete(url)),
}

const header = {
  // headers: { Authorization: `Bearer ${Cookies.get("token")}` },
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
}
const authRequests = {
  get: async (url) => responseBody(await axios.get(url, header)),
  post: async (url, body) => responseBody(await axios.post(url, body, header)),
  put: async (url, body) => responseBody(await axios.put(url, body, header)),
  delete: async (url) => responseBody(await axios.delete(url, header)),
}

// store requests for catalog
// const Catalog = {
//   list: () => requests.get("products"),
//   details: (id: number) => requests.get(`products/${id}`),
// }

// const Basket = {
//   get: () => requests.get("basket"),
//   addItem: (productId: number, quantity: number = 1) =>
//     requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
//   removeItem: (productId: number, quantity: number = 1) =>
//     requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
// }

const agent = {
  // Catalog,
  // TestErrors,
  // Basket,
}

export default agent
