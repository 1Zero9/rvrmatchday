import { createTheme } from "@mui/material/styles";

/** Club palette + typography (Raleway headings, Open Sans body) */
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#005C99" },   // deep blue
    secondary: { main: "#0099CC" }, // light blue
    error: { main: "#D32F2F" },
  },
  typography: {
    fontFamily:
      "Open Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    h1: { fontFamily: "Raleway, Open Sans, sans-serif", fontWeight: 800 },
    h2: { fontFamily: "Raleway, Open Sans, sans-serif", fontWeight: 800 },
    h3: { fontFamily: "Raleway, Open Sans, sans-serif", fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
});
