import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { GoogleIcon, SitemarkIcon } from "../comps/CustomIcons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignUp(props) {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarError, setAvatarError] = useState(false);
  const [avatarErrorMessage, setAvatarErrorMessage] = useState("");
  const nav = useNavigate();

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name || name.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (avatar) {
      fetch(avatar)
        .then((res) => {
          if (!res.ok) {
            setAvatarError(true);
            setAvatarErrorMessage("Can't get the image.");
            isValid = false;
          }
        })
        .catch(() => {
          setAvatarError(true);
          setAvatarErrorMessage("Can't get the image.");
          isValid = false;
        });
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateInputs();
    if (!isValid) {
      return;
    }
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: name, email, password, avatar }),
      });

      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.message);
      }
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      nav("/");
    } catch (err) {
      setServerError(err.message);
      console.error(err);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const response = await fetch("/api/auth/google", {
        method: "GET",
      });
      const data = await response.json();
      window.location.href = data.url; // Redirect to Google auth
    } catch (error) {
      setServerError("Failed to initiate Google sign-in");
      console.error(error);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          {serverError && (
            <Typography color="error" sx={{ textAlign: "center" }}>
              {serverError}
            </Typography>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">User name *</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
                onChange={(e) => setName(e.target.value.trim())}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email *</FormLabel>
              <TextField
                required
                fullWidth
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? "error" : "primary"}
                onChange={(e) => setEmail(e.target.value.trim())}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password *</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
                onChange={(e) => setPassword(e.target.value.trim())}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="avatar">Avatar</FormLabel>
              <TextField
                fullWidth
                name="avatar"
                placeholder="URL"
                type="text"
                variant="outlined"
                error={avatarError}
                helperText={avatarErrorMessage}
                color={avatarError ? "error" : "primary"}
                onChange={(e) => setAvatar(e.target.value.trim())}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignUp}
            >
              Sign up with Google
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link
                href="/signin/"
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
