import expressJwt from "express-jwt"

export const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  // requestProperty: "auth",
  algorithms: ["HS256"],
  getToken: function (req) {
    return req.headers.cookie.split("token=")[1]
  },
})
