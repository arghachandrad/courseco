import axios from "axios"
import { useEffect, useState } from "react"
import agent from "../../utils/agent"

const UserRoute = ({ children }) => {
  const [ok, setOk] = useState(false)
  const getCurrentUser = async () => {
    try {
      const res = await agent.Auth.getCurrentUser()
      // console.log(res)
      if (res.ok) setOk(true) // authenticated
    } catch (error) {
      setOk(false)
      console.log("err", error)
    }
  }
  useEffect(() => {
    getCurrentUser()
  }, [])
  return <>{ok && <div>{children}</div>}</>
}

export default UserRoute
