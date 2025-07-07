import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";
import { Snackbar } from "@mui/material";
import "../styles/authentication.css";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Authentication() {
  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState();
  const [name, setName] = React.useState();
  const [error, setError] = React.useState();
  const [message, setMessage] = React.useState();

  const [formState, setFormState] = React.useState(0);

  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  let handleAuth = async () => {
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      } else if (formState === 1) {
        let result = await handleRegister(name, username, password);
        console.log(result);
        setUsername("");
        setMessage(result);
        setOpen(true);
        setError("");
        setFormState(0);
        setPassword("");
      }
    } catch (err) {
      console.error("Authentication error:", err);

      let message;

      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = `Network Error: ${err.message}`;
      } else {
        message = "An unexpected error occurred.";
      }

      setError(message);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
   <div className="full-auth-container">
  <div className="auth-card-container">
    <Avatar className="auth-avatar">
      <LockOutlinedIcon />
    </Avatar>

    <div className="auth-toggle">
  <Button
    className={`toggle-button ${formState === 0 ? "active-btn" : ""}`}
    onClick={() => setFormState(0)}
  >
    Sign In
  </Button>
  <Button
    className={`toggle-button ${formState === 1 ? "active-btn" : ""}`}
    onClick={() => setFormState(1)}
  >
    Sign Up
  </Button>
</div>


    <Box component="form" noValidate className="auth-form">
      {formState === 1 && (
        <TextField
          margin="normal"
          fullWidth
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <TextField
        margin="normal"
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        margin="normal"
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="auth-error">{error}</p>}

      <Button
  type="button"
  fullWidth
  variant="contained"
  className="auth-submit-button"
  onClick={handleAuth}
>
  {formState === 0 ? "Login" : "Register"}
</Button>

    </Box>
  </div>
</div>


      <Snackbar open={open} autoHideDuration={4000} message={message} />
    </ThemeProvider>
  );
}
