import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import Container from "@mui/material/Container"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import MenuItem from "@mui/material/MenuItem"
import Link from "next/link"
import { useRouter } from "next/router"
import agent from "../utils/agent"
import { logout } from "../redux/auth/actions"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { authSelector } from "../redux/auth/selector"

const pages = ["Login", "Register"] // menu when in logout state
const settings = ["Profile", "Account", "Dashboard", "Logout"] // menus when in logged in state

const TopNav = ({ onSidebarOpen }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector(authSelector)

  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleRedirect = (page) => {
    router.push(`/${page.toLowerCase()}`)
  }

  const handleSettings = async (setting) => {
    if (setting === "Logout") {
      // perform logout
      const response = await agent.Auth.logout()
      dispatch(logout())
      toast.success(response.message)
      router.push("/login")
    }
    if (setting === "Dashboard") {
      router.push("/user")
    }
    // closing the menu
    handleCloseUserMenu()
  }

  return (
    <AppBar position="static" sx={{ background: "#fff", color: "#111" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {user && (
            <IconButton
              onClick={onSidebarOpen}
              sx={{
                display: {
                  xs: "inline-flex",
                  lg: "none",
                },
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}
          {!user && (
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex", flexGrow: 1 },
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => router.push("/")}
            >
              Edemy
            </Typography>
          )}

          {!user && (
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => handleRedirect(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
          {!user && (
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => router.push("/")}
            >
              Edemy
            </Typography>
          )}
          {!user && (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleRedirect(page)}
                  sx={{
                    my: 2,
                    display: "block",
                    color:
                      router.pathname === `/${page.toLowerCase()}`
                        ? "primary"
                        : "#111",
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          )}
          {user && (
            <Box sx={{ flexGrow: 0, marginLeft: "auto" }}>
              <Tooltip title="Open settings">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  p={1}
                >
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="https://images.unsplash.com/photo-1644347517589-6f6ba8b9b4b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                    />
                  </IconButton>
                  <Typography variant="body2">{user && user.name}</Typography>
                </Box>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleSettings(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default TopNav
