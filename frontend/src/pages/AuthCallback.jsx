import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Typography, Box, CircularProgress } from "@mui/material";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", decodeURIComponent(user));
      navigate("/");
    } else {
      navigate("/signup", { state: { error: "Authentication failed" } });
    }
  }, [searchParams, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Processing authentication...
      </Typography>
    </Box>
  );
}
