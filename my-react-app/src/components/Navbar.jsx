import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import '../styles/App.css';

function Navbar() {
  const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mediconnect:colorMode");
    if (saved === "bw") setIsBlackAndWhite(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.colorMode = isBlackAndWhite ? "bw" : "default";
    localStorage.setItem("mediconnect:colorMode", isBlackAndWhite ? "bw" : "default");
  }, [isBlackAndWhite]);

  return (
    <nav className="Navbar">
      <div className="container1">
        <NavLink to="/" className="brand">
          MediConnect
        </NavLink>
      </div>
      <div className="container2">
        <ul>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
          <li><NavLink to="/appointment">Appointment</NavLink></li>
        </ul>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setIsBlackAndWhite((v) => !v)}
          aria-pressed={isBlackAndWhite}
        >
          {isBlackAndWhite ? "Color Mode" : "Black & White"}
        </button>
      </div>
    </nav>
  );  
}

export default Navbar;
