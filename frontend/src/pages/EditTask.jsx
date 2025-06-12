import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppAppBar from "../comps/AppAppBar";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import {
  CardMedia,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

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

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

function Author({ card }) {
  const data = new Date();
  const formattedDate = data.toLocaleDateString("en-US", {
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
            alt={card?.userName || "Unknown"}
            src={card?.avatar || "/default-avatar.png"}
            sx={{ width: 24, height: 24 }}
          />
        </AvatarGroup>
        <Typography variant="caption">
          {card?.userName || "Unknown User"}
        </Typography>
      </Box>
      <Typography variant="caption">{formattedDate}</Typography>
    </Box>
  );
}

export default function EditTask(props) {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [focusedCardIndex, setFocusedCardIndex] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Fetch post by ID
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
      setTask(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleStatusChange = (e) => {
    setTask({ ...task, completed: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user?.id) {
        throw new Error("User not logged in or user ID missing");
      }
      const res = await fetch(`/api/todos/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: task.text,
          title: task.title,
          image: task.image,
          category: task.category,
          userId: user.id,
          completed: task.completed,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `HTTP error! Status: ${res.status}, Message: ${errorData.message}`
        );
      }

      await res.json();
      navigate(`/${task._id}`);
      setError(null);
    } catch (err) {
      console.error("Error updating todo:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  return (
    <AppTheme {...props}>
      <AppAppBar />
      <CssBaseline enableColorScheme />
      <Box sx={{ position: "fixed", top: "1rem", right: "1rem" }}>
        <ColorModeIconDropdown />
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      {task ? (
        <Grid
          container
          sx={{
            height: {
              xs: "100%",
              sm: "calc(100dvh - var(--template-frame-height, 0px))",
            },
            mt: {
              xs: 4,
              sm: 0,
            },
          }}
        >
          {/* Display of post */}
          <Grid
            size={{ xs: 12, sm: 5, lg: 4 }}
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              backgroundColor: "background.paper",
              borderRight: { sm: "none", md: "1px solid" },
              borderColor: { sm: "none", md: "divider" },
              alignItems: "start",
              pt: 16,
              px: 10,
              gap: 4,
            }}
          >
            <Typography variant="h1">Your Post</Typography>
            <Grid size={{ xs: 12 }} sx={{ padding: 0 }}>
              <StyledCard
                variant="outlined"
                onFocus={() => handleFocus(0)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === 0 ? "Mui-focused" : ""}
                sx={{ width: "100%" }}
              >
                <CardMedia
                  component="img"
                  image={task.image || "/default-image.png"}
                  alt={task.title}
                  sx={{
                    aspectRatio: "16 / 9",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                />
                <StyledCardContent>
                  <Typography gutterBottom variant="caption" component="div">
                    {task.category || "Uncategorized"}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    {task.title || "Untitled"}
                  </Typography>
                  <StyledTypography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {task.text || "No description"}
                  </StyledTypography>
                  <Typography gutterBottom variant="caption" component="div">
                    {task.completed === "completed" ? "Completed" : "Pending"}
                  </Typography>
                </StyledCardContent>
                <Author card={user} />
              </StyledCard>
            </Grid>
          </Grid>
          {/* Form */}
          <Grid
            size={{ sm: 12, md: 7, lg: 8 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "100%",
              width: "100%",
              backgroundColor: {
                xs: "transparent",
                sm: "background.default",
              },
              alignItems: "start",
              pt: { xs: 0, sm: 16 },
              px: { xs: 2, sm: 10 },
              gap: { xs: 4, md: 8 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: { sm: "space-between", md: "flex-end" },
                alignItems: "center",
                width: "100%",
                maxWidth: { sm: "100%", md: 600 },
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                width: "100%",
                maxWidth: { sm: "100%", md: 600 },
                maxHeight: "720px",
                gap: { xs: 5, md: "none" },
              }}
            >
              <Grid container spacing={3}>
                <FormGrid size={{ xs: 12, md: 6 }}>
                  <FormLabel htmlFor="title" required>
                    Title
                  </FormLabel>
                  <OutlinedInput
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Title"
                    autoComplete="off"
                    required
                    size="small"
                    value={task.title || ""}
                    onChange={(e) =>
                      setTask({ ...task, title: e.target.value })
                    }
                  />
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6 }}>
                  <FormLabel htmlFor="category" required>
                    Category
                  </FormLabel>
                  <OutlinedInput
                    id="category"
                    name="category"
                    type="text"
                    placeholder="Category"
                    autoComplete="off"
                    required
                    size="small"
                    value={task.category || ""}
                    onChange={(e) =>
                      setTask({ ...task, category: e.target.value })
                    }
                  />
                </FormGrid>
                <FormGrid size={{ xs: 12 }}>
                  <FormLabel htmlFor="description" required>
                    Description
                  </FormLabel>
                  <OutlinedInput
                    id="description"
                    name="description"
                    type="text"
                    placeholder="Type what ever you wanted to do"
                    required
                    size="large"
                    onChange={(e) => setTask({ ...task, text: e.target.value })}
                    multiline
                    value={task.text || ""}
                    rows={4}
                  />
                </FormGrid>
                <FormGrid size={{ xs: 12 }}>
                  <FormLabel htmlFor="image">Image URL</FormLabel>
                  <OutlinedInput
                    id="image"
                    name="image"
                    type="text"
                    placeholder="Visualize your task"
                    size="small"
                    value={task.image || ""}
                    onChange={(e) =>
                      setTask({ ...task, image: e.target.value })
                    }
                  />
                </FormGrid>
                <FormGrid size={{ xs: 12 }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" required>
                      Status
                    </FormLabel>
                    <RadioGroup
                      aria-label="status"
                      name="status"
                      value={task.completed || "pending"}
                      onChange={handleStatusChange}
                      row
                    >
                      <FormControlLabel
                        value="pending"
                        control={<Radio size="small" />}
                        label="Pending"
                      />
                      <FormControlLabel
                        value="completed"
                        control={<Radio size="small" />}
                        label="Completed"
                      />
                    </RadioGroup>
                  </FormControl>
                </FormGrid>
                <Button
                  variant="contained"
                  endIcon={<ChevronRightRoundedIcon />}
                  sx={{ width: { xs: "100%", sm: "fit-content" } }}
                  onClick={handleSubmit}
                >
                  Update
                </Button>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </AppTheme>
  );
}
