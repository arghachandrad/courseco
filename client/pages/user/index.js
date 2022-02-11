import axios from "axios"
import { useEffect, useState } from "react"
import agent from "../../utils/agent"

const UserIndex = () => {
  const [hidden, setHidden] = useState(true)
  const getCurrentUser = async () => {
    try {
      const res = await agent.Auth.getCurrentUser()
      setHidden(false)
      console.log(res)
    } catch (error) {
      setHidden(true)
      console.log("err", error)
    }
  }
  useEffect(() => {
    getCurrentUser()
  }, [])
  return <>{!hidden && <h1>User Page</h1>}</>
}

export default UserIndex
