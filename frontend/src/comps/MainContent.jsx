import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Link } from "react-router-dom";
import { CardMedia, FormControl } from "@mui/material";

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

// Search component definition
const Search = ({ search, setSearch }) => (
  <FormControl sx={{ width: { xs: "100%", md: "25ch" } }} variant="outlined">
    <OutlinedInput
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      size="small"
      id="search"
      placeholder="Search…"
      sx={{ flexGrow: 1 }}
      startAdornment={
        <InputAdornment position="start" sx={{ color: "text.primary" }}>
          <SearchRoundedIcon fontSize="small" />
        </InputAdornment>
      }
      inputProps={{
        "aria-label": "search",
      }}
    />
  </FormControl>
);

function Author({ task }) {
  const data = new Date(task.createdAt);
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
            alt="{author.name}"
            src={task.avatar}
            sx={{ width: 24, height: 24 }}
          />
        </AvatarGroup>
        <Typography variant="caption">{task.userName || ""}</Typography>
      </Box>
      <Typography variant="caption">{formatedD}</Typography>
    </Box>
  );
}

// Author.propTypes = {
//   authors: PropTypes.arrayOf(
//     PropTypes.shape({
//       avatar: PropTypes.string.isRequired,
//       name: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };

export default function MainContent({ todos }) {
  const [focusedCardIndex, setFocusedCardIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState(todos.slice(0, 10)); // Initialize with todos
  const [debouncedSearch] = useDebounce(search, 300);

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleClick = (name) => {
    let catTasks = name
      ? todos.filter((task) => task.category?.includes(name))
      : [...todos];
    setTasks(catTasks);
  };
  const debSearch = () => {
    let filteredTasks = [...todos]; // Create a new array to avoid mutating props
    if (debouncedSearch.trim()) {
      filteredTasks = todos.filter(
        (card) =>
          card.text
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase().trim()) ||
          card.title
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase().trim()) ||
          card.category
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase().trim())
      );
      filteredTasks = filteredTasks.slice(0, 10);
    }
    setTasks(filteredTasks);
  };
  useEffect(() => {
    debSearch();
  }, [debouncedSearch, todos]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Xasks
        </Typography>
        <Typography>
          Stay in the loop with the latest todos of others and yours
        </Typography>
      </div>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          width: "100%",
          justifyContent: "space-between",
          alignItems: { xs: "start", md: "center" },
          gap: 4,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "row",
            gap: 3,
            overflow: "auto",
          }}
        >
          <Chip
            onClick={() => handleClick(null)}
            size="medium"
            label="All categories"
          />
          <Chip
            onClick={() => handleClick("Work")}
            size="medium"
            label="Work"
            name="work"
            sx={{
              backgroundColor: "transparent",
              border: "none",
            }}
          />
          <Chip
            onClick={() => handleClick("Home")}
            size="medium"
            label="Home"
            name="home"
            sx={{
              backgroundColor: "transparent",
              border: "none",
            }}
          />
          <Chip
            onClick={() => handleClick("Personal")}
            size="medium"
            label="Personal"
            sx={{
              backgroundColor: "transparent",
              border: "none",
            }}
            name="personal"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            width: { xs: "100%", md: "fit-content" },
            overflow: "auto",
          }}
        >
          <Search search={search} setSearch={setSearch} />
          <IconButton size="small" aria-label="RSS feed">
            <RssFeedRoundedIcon />
          </IconButton>
        </Box>
      </Box>
      <Grid
        size={{ xs: 12, sm: 5, lg: 3 }}
        sx={{
          display: { md: "flex" },
          flexDirection: "column",
          backgroundColor: "background.paper",
          borderRight: { sm: "none", md: "1px solid" },
          borderColor: { sm: "none", md: "divider" },
          alignItems: "start",
          py: 6,
          gap: 4,
        }}
      >
        <Grid container spacing={2} columns={12}>
          {tasks.map((task, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <StyledCard
                variant="outlined"
                onFocus={() => handleFocus(0)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === 0 ? "Mui-focused" : ""}
              >
                <Link to={`/${task._id}`} className="no-underline">
                  <CardMedia
                    component="img"
                    image={task.image}
                    sx={{
                      aspectRatio: "16 / 9",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                  <StyledCardContent>
                    <Typography gutterBottom variant="caption" component="div">
                      {task.category}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                      {task.title}
                    </Typography>
                    <StyledTypography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {task.text}
                    </StyledTypography>
                    <Typography gutterBottom variant="caption" component="div">
                      {task.completed}
                    </Typography>
                  </StyledCardContent>
                </Link>
                <Author task={task} />
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
