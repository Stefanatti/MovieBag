import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { themeSwich } from "../Features/theme";

const ThemeSwitcher = ({ theme, setTheme }) => {
  const [switcher, setSwitcher] = useState(false);
  const [moveBall, setMoveBall] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      console.log(localStorage.getItem("theme"));
      setTheme(localStorage.getItem("theme"));
    }
  }, []);
  return (
    <div className="switch">
      <div className="switch-radios">
        <input
          onChange={() => {
            setMoveBall(3);
            dispatch(themeSwich({ theme: "" }));
          }}
          type="radio"
          name="theme-type"
          value="one"
          id="first"
        />
        <input
          onClick={() => {
            setMoveBall(27);
            dispatch(themeSwich({ theme: "blue-theme" }));
          }}
          type="radio"
          name="theme-type"
          value="two"
          id="second"
        />
        <input
          onChange={() => {
            setMoveBall(52);
            dispatch(themeSwich({ theme: "purple-theme" }));
          }}
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
