import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f5f2ec",  // --paper
      paper: "#f0ebe0",    // --warm
    },
    text: {
      primary: "#0f0e0d",   // --ink
      secondary: "#7a7670", // --muted
    },
    primary: {
      main: "#c9572a",      // --accent (terracotta/rust)
      contrastText: "#f5f2ec",
    },
    secondary: {
      main: "#2a6fc9",      // --accent2 (blue)
      contrastText: "#f5f2ec",
    },
    success: {
      main: "#2a9c57",      // --accent3 (green)
    },
    divider: "#d8d2c4",     // --border
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--ink": "#0f0e0d",
          "--paper": "#f5f2ec",
          "--warm": "#f0ebe0",
          "--accent": "#c9572a",
          "--accent2": "#2a6fc9",
          "--accent3": "#2a9c57",
          "--muted": "#7a7670",
          "--border": "#d8d2c4",
          "--code-bg": "#1a1917",
          "--code-text": "#e8e4da",
        },
        "html, body": {
          margin: 0,
          padding: 0,
          backgroundColor: "#f5f2ec",
          color: "#0f0e0d",
          minHeight: "100vh",
        },
        "#main": {
          minHeight: "100vh",
          backgroundColor: "#f5f2ec",
        },
        "#app": {
          width: "100%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: "#c9572a",
          "&:hover": {
            backgroundColor: "#b04820",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#f0ebe0",
          border: "1px solid #d8d2c4",
          boxShadow: "0 2px 8px rgba(15,14,13,0.08)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(15,14,13,0.12)",
          },
          transition: "box-shadow 0.2s ease",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#f0ebe0",
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(26,25,23,0.97)",
          color: "#e8e4da",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(232,228,218,0.1)",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          "@media (min-width:0px)": { minHeight: 60 },
          "@media (min-width:600px)": { minHeight: 64 },
          "@media (min-width:900px)": { minHeight: 68 },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1a1917",
          color: "#e8e4da",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: "#e8e4da",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f5f2ec",
            "& fieldset": {
              borderColor: "#d8d2c4",
            },
            "&:hover fieldset": {
              borderColor: "#c9572a",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#c9572a",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#c9572a",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {},
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#d8d2c4",
        },
      },
    },
  },
});

export default theme;
