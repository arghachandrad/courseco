import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import { useRouter } from "next/router"
import { useState } from "react"
import validationUtility from "../utils/validationUtility"
import LoadingButton from "@mui/lab/LoadingButton"
import { toast } from "react-toastify"
import Link from "next/link"
import agent from "../utils/agent"
import { useDispatch } from "react-redux"
import { login } from "../redux/auth/actions"

const Login = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    validation: false,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const formValidation = () => {
    if (
      validationUtility.email(formData.email) &&
      validationUtility.text(formData.password)
    ) {
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFormData((prev) => ({ ...prev, validation: true }))
    const validationResponse = await formValidation()
    if (validationResponse) {
      const { email, password } = formData
      const response = await agent.Auth.login({ email, password })
      setLoading(false) // after getting response set loading to false, whether error or not
      if (response) {
        // no error (if error then will get caught in axios interceptor and response will be undefined)
        dispatch(login(response.data))
        toast.success(response.message)
        setFormData((prev) => ({
          ...prev,
          email: "",
          password: "",
          validation: false,
        }))
        router.push("/")
      }
    } else {
      setLoading(false)
      toast.error("Please enter all the required fields")
    }
  }

  return (
    <>
      <Paper sx={{ p: 2, maxWidth: 800, mx: "auto", mt: 5 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                name="email"
                onChange={handleChange}
                placeholder="Enter email"
                fullWidth
                value={formData.email}
                error={
                  formData.validation
                    ? !validationUtility.email(formData.email)
                    : false
                }
                helperText={
                  formData.validation &&
                  !validationUtility.email(formData.email)
                    ? "Please enter a valid email"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                name="password"
                onChange={handleChange}
                placeholder="Enter password"
                fullWidth
                value={formData.password}
                error={
                  formData.validation
                    ? !validationUtility.text(formData.password)
                    : false
                }
                helperText={
                  formData.validation &&
                  !validationUtility.text(formData.password)
                    ? "Please enter a valid password"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
                size="large"
                fullWidth
              >
                Login
              </LoadingButton>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ display: "inline" }} variant="body2">
                Don't have an account ?
              </Typography>
              <Link href="/register">
                <a>Register</a>
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  )
}

export const getServerSideProps = async function ({ req, res }) {
  const { token } = req.cookies

  if (token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default Login
