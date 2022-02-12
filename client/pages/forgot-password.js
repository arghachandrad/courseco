import { useState } from "react"
import LoadingButton from "@mui/lab/LoadingButton"
import { Grid, Paper, TextField } from "@mui/material"
import agent from "../utils/agent"
import validationUtility from "../utils/validationUtility"
import { toast } from "react-toastify"
import { useRouter } from "next/router"

const ForgotPassword = () => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    success: false,
    code: "",
    newPassword: "",
    loading: false,
    validation: false,
  })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSendResetEmail = async (e) => {
    e.preventDefault()
    setFormData((prev) => ({ ...prev, loading: true, validation: true }))
    if (validationUtility.email(formData.email)) {
      const res = await agent.Auth.sendPasswordResetEmail({
        email: formData.email,
      })
      setFormData((prev) => ({ ...prev, loading: false })) // stop loader if error or not
      if (res) {
        setFormData((prev) => ({
          ...prev,
          validation: false,
          success: true,
        }))
        console.log("res: ", res)
        toast.success(res.message)
      }
    } else {
      setFormData((prev) => ({ ...prev, loading: false, validation: true }))
      toast.error("Please enter valid details")
    }
  }
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setFormData((prev) => ({ ...prev, loading: true, validation: true }))
    if (
      validationUtility.text(formData.code) &&
      validationUtility.text(formData.newPassword)
    ) {
      // call api to check code is valid or not
      const res = await agent.Auth.resetPassword({
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword,
      })
      setFormData((prev) => ({ ...prev, loading: false })) // stop loader if error or not
      if (res) {
        setFormData((prev) => ({
          ...prev,
          validation: false,
          email: "",
          newPassword: "",
          code: "",
        }))
        console.log("res: ", res)
        toast.success(res.message)
        router.push("/login")
      }
    } else {
      setFormData((prev) => ({ ...prev, loading: false, validation: true }))
      toast.error("Please enter valid details")
    }
  }

  return (
    <Paper sx={{ p: 2, maxWidth: 800, mx: { xs: 3, md: "auto" }, mt: 5 }}>
      {!formData.success && (
        <form onSubmit={handleSendResetEmail}>
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
              <LoadingButton
                loading={formData.loading}
                type="submit"
                variant="contained"
                size="large"
                fullWidth
              >
                Send Reset Link
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      )}
      {formData.success && (
        <form onSubmit={handleChangePassword}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12}>
              <TextField
                label="Code"
                type="text"
                variant="outlined"
                name="code"
                onChange={handleChange}
                placeholder="Enter your code"
                fullWidth
                value={formData.code}
                error={
                  formData.validation
                    ? !validationUtility.text(formData.code)
                    : false
                }
                helperText={
                  formData.validation && !validationUtility.text(formData.code)
                    ? "Please enter a valid email"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                name="newPassword"
                onChange={handleChange}
                placeholder="Enter New Password"
                fullWidth
                value={formData.newPassword}
                error={
                  formData.validation
                    ? !validationUtility.text(formData.newPassword)
                    : false
                }
                helperText={
                  formData.validation &&
                  !validationUtility.text(formData.newPassword)
                    ? "Please enter a valid password"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                loading={formData.loading}
                type="submit"
                variant="contained"
                size="large"
                fullWidth
              >
                Reset Password
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Paper>
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

export default ForgotPassword
