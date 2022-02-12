import NextLink from "next/link"
import { useRouter } from "next/router"
import { Box, Button, ListItem } from "@mui/material"

export const NavItem = (props) => {
  const { href, icon, title, ...others } = props
  const router = useRouter()
  const active = href ? router.pathname === href : false

  return (
    <ListItem
      disableGutters
      sx={{
        display: "flex",
        mb: 0.5,
        py: 0,
        px: 2,
      }}
      {...others}
    >
      <NextLink href={href} passHref>
        <Button
          component="a"
          startIcon={icon}
          disableRipple
          sx={{
            backgroundColor: active && "secondary.main",
            borderRadius: 1,
            color: active ? "#357a38" : "primary.main",
            fontWeight: active && "bold",
            justifyContent: "flex-start",
            px: 3,
            textAlign: "left",
            textTransform: "none",
            width: "100%",
            "& .MuiButton-startIcon": {
              color: active ? "#357a38" : "primary.main",
            },
            "&:hover": {
              backgroundColor: "secondary.main",
              color: "#357a38",
            },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
        </Button>
      </NextLink>
    </ListItem>
  )
}
