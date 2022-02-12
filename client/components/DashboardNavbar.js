import styled from "@emotion/styled"
import { AppBar } from "@mui/material"
import TopNav from "./TopNav"

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}))

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, ...other } = props

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: "calc(100% - 280px)",
          },
        }}
        {...other}
      >
        <TopNav />
      </DashboardNavbarRoot>
    </>
  )
}
