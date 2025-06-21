import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import Sitemark from "../comps/SitemarkIcon";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));
function Author({ user }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
        }}
      >
        <AvatarGroup max={3}>
          <Avatar
            alt={user.userName}
            src={user.avatar}
            sx={{ width: 24, height: 24 }}
          />
        </AvatarGroup>
        <Typography variant="caption" color="primary">
          {user.userName || ""}
        </Typography>
      </Box>
      {/* <Typography variant="caption">j</Typography> */}
    </Box>
  );
}
export default function AppAppBar() {
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const nav = useNavigate();
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
    nav("/");
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Sitemark />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Link to="/mytodos">
                <Button variant="text" color="info" size="small">
                  Mytodos
                </Button>
              </Link>
              <Link to="/new">
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  sx={{ minWidth: 0 }}
                >
                  New
                </Button>
              </Link>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {user ? (
              <>
                <Author user={user} />
                <Link to="">
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button color="primary" variant="text" size="small">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button color="primary" variant="contained" size="small">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem>
                  <Link to="/mytodos" className="no-underline">
                    MyTodos
                  </Link>
                </MenuItem>
                <Link to="/new" className="no-underline">
                  <MenuItem>New</MenuItem>
                </Link>
                <Divider sx={{ my: 3 }} />
                {user ? (
                  <>
                    <Author user={user} />
                    <Link to="">
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={handleLogout}
                        sx={{ mt: 1 }}
                      >
                        Log out
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <MenuItem>
                      <Link to="/signup">
                        <Button color="primary" variant="contained" fullWidth>
                          Sign up
                        </Button>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to="/signin">
                        <Button color="primary" variant="outlined" fullWidth>
                          Sign in
                        </Button>
                      </Link>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
