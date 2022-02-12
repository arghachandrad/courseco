import UserRoute from "../../components/routes/UserRoute"
import { DashboardLayout } from "../../layout/DashboardLayout"

const UserIndex = () => {
  return (
    <UserRoute>
      <h1>Hey you are logged in</h1>
    </UserRoute>
  )
}

UserIndex.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default UserIndex
