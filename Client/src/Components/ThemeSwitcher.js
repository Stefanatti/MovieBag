import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import { pink } from "@mui/material/colors";
import Switch from "@mui/material/Switch";

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: pink[600],
    "&:hover": {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: pink[600],
  },
}));

const label = { inputProps: { "aria-label": "Color switch demo" } };

export default function ColorSwitches() {
  return (
    <div>
      {/* <Switch {...label} defaultChecked />
      <Switch {...label} defaultChecked color="secondary" />
      <Switch {...label} defaultChecked color="warning" /> */}
      {/* <Switch {...label} defaultChecked color="default" /> */}
      <PinkSwitch {...label} defaultChecked />
    </div>
  );
}

// import { useState, useEffect } from "react";

// const ThemeSwitcher = ({ theme, setTheme }) => {
//   const [switcher, setSwitcher] = useState(false);
//   const [moveBall, setMoveBall] = useState();

//   useEffect(() => {
//     if (localStorage.getItem("theme")) {
//       console.log(localStorage.getItem("theme"));
//       setTheme(localStorage.getItem("theme"));
//     }
//   }, []);

//   return (
//     <div className="switch">
//       <div className="switch-radios">
//         <input
//           onChange={() => {
//             setMoveBall(3);
//             setTheme("");
//           }}
//           type="radio"
//           name="theme-type"
//           value="one"
//           id="first"
//         />
//         <input
//           onChange={() => {
//             setMoveBall(27);
//             setTheme("blue-theme");
//           }}
//           type="radio"
//           name="theme-type"
//           value="two"
//           id="second"
//         />
//         <input
//           onChange={() => {
//             setMoveBall(52);
//             setTheme("purple-theme");
//           }}
//           type="radio"
//           name="theme-type"
//           value="three"
//           id="third"
//         />
//       </div>

//       <div className="ball" style={{ left: moveBall }}></div>
//     </div>
//   );
// };

// export default ThemeSwitcher;
