import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { themeSwich } from "../Features/theme";
import { Box, Tooltip } from "@mui/material";

const themes = [
  { name: "", label: "Orange", color: "rgb(255, 124, 0)" },
  { name: "blue-theme", label: "Red", color: "rgb(180, 15, 3)" },
  { name: "purple-theme", label: "Purple", color: "rgb(204, 32, 226)" },
];

const ThemeSwitcher = ({ setTheme }) => {
  const [activeTheme, setActiveTheme] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "";
    setActiveTheme(storedTheme);
    setTheme(storedTheme);
  }, [setTheme]);

  const handleThemeChange = (newTheme) => {
    setActiveTheme(newTheme);
    dispatch(themeSwich({ theme: newTheme }));
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        backgroundColor: "var(--switcher)",
        borderRadius: "20px",
        padding: "5px 8px",
      }}
    >
      {themes.map((theme) => (
        <Tooltip key={theme.name} title={theme.label} arrow>
          <Box
            onClick={() => handleThemeChange(theme.name)}
            sx={{
              width: activeTheme === theme.name ? 20 : 16,
              height: activeTheme === theme.name ? 20 : 16,
              borderRadius: "50%",
              backgroundColor: theme.color,
              cursor: "pointer",
              transition: "all 0.3s ease",
              border:
                activeTheme === theme.name
                  ? "2px solid #fff"
                  : "2px solid transparent",
              boxShadow:
                activeTheme === theme.name ? `0 0 8px ${theme.color}` : "none",
              "&:hover": {
                transform: "scale(1.2)",
                boxShadow: `0 0 10px ${theme.color}`,
              },
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
};

export default ThemeSwitcher;
