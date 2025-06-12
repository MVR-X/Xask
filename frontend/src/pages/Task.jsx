import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import EditTask from "../pages/EditTask"; // Assuming you have an Edittask component
import { CardActions } from "@mui/material";
import AppTheme from "../shared-theme/AppTheme";
import Container from "@mui/material/Container";
import AppAppBar from "../comps/AppAppBar";
import MainContent from "../comps/MainContent";
import Footer from "../comps/Footer";
import CssBaseline from "@mui/material/CssBaseline";

// Styled components from MainContent
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  backgroundColor: (theme.vars || theme).palette.background.paper,
  "&:hover": {
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "2px",
  },
}));

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 16,
  flexGrow: 1,
  "&:last-child": {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({});

// Author component adapted for a single task
function Author({ card }) {
  const data = new Date(card.createdAt);
  const formatedD = data.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
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
            alt={card.userName || "Unknown"}
            src={card.avatar || "/default-avatar.png"} // Fallback avatar
            sx={{ width: 24, height: 24 }}
          />
        </AvatarGroup>
        <Typography variant="caption">
          {card.userName || "Anonymous"}
        </Typography>
      </Box>
      <Typography variant="caption">{formatedD}</Typography>
    </Box>
  );
}

function Task(props) {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState(false); // Permission to edit/delete
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const nav = useNavigate();

  // Fetch task by ID
  const fetchTask = async () => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setPermission(user?.id && data.userId ? user.id === data.userId : false);
      setTask(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle task deletion
  const handleDel = async () => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`, await res.json());
      }
      nav("/"); // Redirect to home on successful deletion
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Fetch task on component mount or ID change
  useEffect(() => {
    if (!id) {
      setError("Invalid task ID");
      setLoading(false);
      return;
    }
    fetchTask();
  }, [id]);

  return (
    <>
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                p: 2,
                mx: "auto",
              }}
            >
              {loading ? (
                <Typography>Loading...</Typography>
              ) : error ? (
                <Typography color="error">Error: {error}</Typography>
              ) : (
                <>
                  <StyledCard variant="outlined">
                    <CardMedia
                      component="img"
                      image={task.image || "/default-image.png"} // Fallback image
                      sx={{
                        aspectRatio: "16 / 9",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                    <StyledCardContent>
                      <Typography
                        gutterBottom
                        variant="caption"
                        component="div"
                      >
                        {task.category || ""}
                      </Typography>
                      <Typography gutterBottom variant="h6" component="div">
                        {task.title || "Untitled"}
                      </Typography>
                      <StyledTypography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {task.text || "No content available"}
                      </StyledTypography>
                    </StyledCardContent>
                    <Author card={task} />
                    {user && permission && (
                      <CardActions sx={{ padding: "0 16px 16px" }}>
                        <Link to={`/edit/${task._id}`}>
                          <Button variant="contained">Edit</Button>
                        </Link>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={handleDel}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    )}
                  </StyledCard>
                </>
              )}
            </Box>
          )}
        </Container>
        <Footer />
      </AppTheme>
    </>
  );
}

export default Task;
