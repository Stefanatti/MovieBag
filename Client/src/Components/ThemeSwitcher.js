import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { themeSwich } from "../Features/theme";

const ThemeSwitcher = ({ theme, setTheme }) => {
  const [moveBall, setMoveBall] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      console.log(storedTheme);
      setTheme(storedTheme);
      switch (storedTheme) {
        case "blue-theme":
          setMoveBall(27);
          break;
        case "purple-theme":
          setMoveBall(52);
          break;
        default:
          setMoveBall(2);
      }
    }
  }, []);

  const handleThemeChange = (newTheme, ballPosition) => {
    setMoveBall(ballPosition);
    dispatch(themeSwich({ theme: newTheme }));
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="switch">
      <div className="switch-radios">
        <input
          onChange={() => handleThemeChange("", 2)}
          type="radio"
          name="theme-type"
          value="one"
          id="first"
        />
        <input
          onChange={() => handleThemeChange("blue-theme", 27)}
          type="radio"
          name="theme-type"
          value="two"
          id="second"
        />
        <input
          onChange={() => handleThemeChange("purple-theme", 52)}
          type="radio"
          name="theme-type"
          value="three"
          id="third"
        />
      </div>

      <div className="ball" style={{ left: moveBall }}></div>
    </div>
  );
};

export default ThemeSwitcher;
