import * as React from "react";
import { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import AppTheme from "../static/shared-theme/AppTheme";
import AppAppBar from "../comps/AppAppBar";
import MainContent from "../comps/MainContent";
import Footer from "../comps/Footer";

export default function Home(props) {
  const [todos, setTodos] = useState(null); // Initialize as null for clarity
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        props.userId ? `/api/todos/mytodos/${props.userId}` : "/api/todos",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setTodos(data);
      setLoading(false);
    } catch (err) {
      console.error("Error while fetching:", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: "flex", flexDirection: "column", my: 16, gap: 4 }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <MainContent todos={todos} />
        )}
      </Container>
      <Footer />
    </AppTheme>
  );
}
