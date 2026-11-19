import { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AuthField } from "./AuthLayout";

export default function PasswordField({ label, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <AuthField
      {...props}
      label={label}
      type={visible ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              type="button" edge="end"
              aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
              onClick={() => setVisible((value) => !value)}
            >
              {visible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
