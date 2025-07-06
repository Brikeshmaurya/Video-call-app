import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Home.module.css';
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const { addToUserHistory } = useContext(AuthContext);

  const handleJoinVideoCall = async () => {
    if (!meetingCode.trim()) {
      alert("Please enter a valid meeting code.");
      return;
    }

    try {
      await addToUserHistory(meetingCode);
      navigate(`/${meetingCode}`);
    } catch (err) {
      console.error("Error joining video call:", err);
      alert("Something went wrong while joining the meeting.");
    }
  };

  return (
    <>
      <div className={styles.navBar}>
        <div>
          <h2>StreamVerse Call</h2>
        </div>

        <div>
          <IconButton onClick={() => navigate("/history")}>
            <RestoreIcon />
          </IconButton>
          <p>History</p>
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className={styles.meetContainer}>
        <div className={styles.leftPanel}>
          <h2>Providing Premium video Call with Chat.</h2>
          <div className={styles.formActions}>
            <TextField
              onChange={(e) => setMeetingCode(e.target.value)}
              id="outlined-basic"
              label="Meeting Code"
              variant="outlined"
              value={meetingCode}
            />
            <Button
              onClick={handleJoinVideoCall}
              variant="contained"
            >
              Join
            </Button>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <img src="/logo3.png" alt="Logo" />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomeComponent);
