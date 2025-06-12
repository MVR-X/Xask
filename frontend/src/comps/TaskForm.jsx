import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function TaskForm() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const [status] = useState("pending");
  const [, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Retrieve user from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        throw new Error("User not logged in or user ID missing");
      }
      const token = localStorage.getItem("token");
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
          title,
          image,
          category,
          userId: user.id,
          userName: user.name,
          complete: status === "completed" ? true : false,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! St: ${res.st}`);
      }
      const data = await res.json();
      console.log("Todo created:", data);
      setError(null);
      navigate("/");
    } catch (err) {
      console.error("Error while creating todo:", err.message);
      setError(err.message);
    }
  };

  return (
    <Grid container spacing={3}>
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="title" required>
          Title
        </FormLabel>
        <OutlinedInput
          id="title"
          name="title"
          type="name"
          placeholder="Title"
          autoComplete="title"
          required
          size="small"
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormGrid>
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="category" required>
          Category
        </FormLabel>
        <OutlinedInput
          id="category"
          name="category"
          type="category"
          placeholder="Category"
          autoComplete="category"
          required
          size="small"
          onChange={(e) => setCategory(e.target.value)}
        />
      </FormGrid>

      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="description" required>
          Description
        </FormLabel>
        <OutlinedInput
          id="description"
          name="description"
          type="text-area"
          placeholder="Type what ever you wanted to do"
          required
          size="large"
          onChange={(e) => setText(e.target.value)}
          sx={{ paddingBottom: "1rem" }}
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="address2">Image URL</FormLabel>
        <OutlinedInput
          id="image"
          name="image"
          type="text"
          placeholder="Visualize your task"
          required
          size="small"
          onChange={(e) => setImage(e.target.value)}
        />
      </FormGrid>
      {/* <FormGrid size={{ xs: 6 }}>
        <FormLabel htmlFor="city" required>
          City
        </FormLabel>
        <OutlinedInput
          id="city"
          name="city"
          type="city"
          placeholder="New York"
          autoComplete="City"
          required
          size="small"
        />
      </FormGrid>
       */}
      {/* <FormGrid size={{ xs: 12 }}>
        <FormControlLabel
          control={<Checkbox name="saveAddress" value="yes" />}
          label="Use this address for payment details"
        />
      </FormGrid> */}
      <Button
        variant="contained"
        endIcon={<ChevronRightRoundedIcon />}
        sx={{ width: { xs: "100%", sm: "fit-content" } }}
        onClick={handleSubmit}
      >
        Post
      </Button>
    </Grid>
  );
}
