import User from "../models/user"
import { comparePassword, hashPassword } from "../utils/auth"
import jwt from "jsonwebtoken"
import AWS from "aws-sdk"
import { nanoid } from "nanoid"

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
}

const SES = new AWS.SES(awsConfig)

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // validation
    if (!name || !email)
      return res
        .status(400)
        .json({ success: false, message: "Please enter required fields" })
    if (!password || password.length < 6)
      return res.status(400).json({
        success: false,
        message: "Password is required and should be minimum 6 character long",
      })

    let userExist = await User.findOne({ email }).exec()
    if (userExist)
      return res.status(400).json({ success: false, message: "Email is taken" })

    // Hashpassword
    const hashedPassword = await hashPassword(password)

    // register
    const user = await new User({
      name,
      email,
      password: hashedPassword,
    }).save()
    return res
      .status(201)
      .json({ success: true, message: "User is registered successfully" })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: "Registration error. Try again",
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    // check user with that email
    const user = await User.findOne({ email }).exec()
    if (!user)
      return res.status(400).json({
        success: false,
        message: "No user found",
      })

    // check password
    const match = await comparePassword(password, user.password)
    if (!match)
      return res.status(400).json({
        success: false,
        message: "Incorrect credentials",
      })
    // create signed JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    // return user and token to client
    user.password = undefined // excluding passowrd

    // send token in Cookie (httpOnly)
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // only works on https
    })

    // send user as json respnse
    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      data: user, // except password
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Login error. Try Again!",
    })
  }
}

export const logout = async (req, res) => {
  try {
    // clearly httpOnly cookie, so that for any further request cookie will be not there in response header
    res.clearCookie("token")
    return res.status(200).json({
      success: true,
      message: "Signed out successfully",
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      message: "Failed to logout. Try Again!",
    })
  }
}

// this is used to protect authenticated route in frontend
export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec()
    console.log("current user: ", user)
    return res.json({ ok: true })
  } catch (error) {
    console.log(error)
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const shortCode = nanoid(6).toUpperCase()
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    )

    if (!user)
      return res.status(400).json({ success: false, message: "User not found" })

    // send this code as an email
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      ReplyToAddresses: [process.env.EMAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
            <html>
              <h1>Reset password link</h1>
              <p>Please use the following code to reset your password</p>
              <h2 style="color: red;">${shortCode}</h2>
              <i>courseco.com</i>
            </html>
          `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset Password",
        },
      },
    }

    const emailSent = SES.sendEmail(params).promise()
    emailSent
      .then((data) => {
        console.log(data)
        return res.status(200).json({
          success: true,
          message: "email sent successfully",
        })
      })
      .catch((err) => {
        return res.status(400).json({
          success: true,
          message: "Failed to send email",
        })
      })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: true,
      message: "Failed to send email",
    })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body
    const hashedPassword = await hashPassword(newPassword)

    const user = await User.findOneAndUpdate(
      { email, passwordResetCode: code },
      { password: hashedPassword, passwordResetCode: "" }
    ).exec()

    if (!user) {
      return res.status(400).json({
        success: true,
        message: "Check you password reset code",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    })
  } catch (error) {
    return res.status(400).json({
      success: true,
      message: "Failed to reset password",
    })
  }
}
