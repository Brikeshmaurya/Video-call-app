import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function LandingPage() {
  const router = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (path) => {
    setIsMenuOpen(false);
    router(path);
  };

  return (
    <div className="landingpagecontainer">
      <nav className="navbar">
        <div className="navHeader roboto-regular">
          <h2>StreamVerse Connect</h2>
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </div>
        </div>

        <div className={`navList ${isMenuOpen ? "open" : ""}`}>
          <p className="navLink" onClick={() => handleNavClick("/joinAsGuest")}>
            Join as Guest
          </p>
          <p className="navLink" onClick={() => handleNavClick("/auth")}>
            Register
          </p>
          <div className="loginBtn" onClick={() => handleNavClick("/auth")} role="button">
            <p>Login</p>
          </div>
        </div>
      </nav>

      <div className="mainContainer roboto-regular">
        <div className="landingContent">
          <h1>
            <span className="highlight">Connect</span> with your Loved Ones
          </h1>
          <p className="subtitle">Close the distance with the magic of code.</p>
          <Link to={"/home"} className="getStartedBtn">
            Get Started
          </Link>
        </div>
        <div className="landingImage">
          <img src="mobile.png" alt="Video Call" />
        </div>
      </div>
    </div>
  );
}
