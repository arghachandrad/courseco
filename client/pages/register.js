import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useState } from "react"
import validationUtility from "../utils/validationUtility"
import agent from "../utils/agent"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import LoadingButton from "@mui/lab/LoadingButton"
import Link from "next/link"

const Register = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
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
      validationUtility.text(formData.name) &&
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
      const { name, email, password } = formData
      const response = await agent.Auth.register({ name, email, password })
      setLoading(false) // after getting response set loading to false, whether error or not
      if (response) {
        // no error (if error then will get caught in axios interceptor and response will be undefined)
        toast.success(response.message)
        setFormData((prev) => ({
          ...prev,
          name: "",
          email: "",
          password: "",
          validation: false,
        }))
        router.push("/login")
      }
    } else {
      toast.error("Please fill all the required fields")
    }
  }

  return (
    <>
      {/* <Banner text="Register" /> */}
      <Paper
        sx={{
          p: 2,
          maxWidth: 800,
          mt: 5,
          mx: "auto",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12}>
              <TextField
                label="Name"
                type="text"
                variant="outlined"
                name="name"
                onChange={handleChange}
                placeholder="Enter name"
                fullWidth
                error={
                  formData.validation
                    ? !validationUtility.text(formData.name)
                    : false
                }
                helperText={
                  formData.validation && !validationUtility.text(formData.name)
                    ? "Please enter a valid name"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                name="email"
                onChange={handleChange}
                placeholder="Enter email"
                fullWidth
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
            <Grid item>
              <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
                size="large"
              >
                Register
              </LoadingButton>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ display: "inline" }} variant="body2">
                Already registered ?
              </Typography>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  )
}

export default Register
