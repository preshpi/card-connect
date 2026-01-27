// --- 1. THEME CONFIGURATION ---
export const CODE_THEMES: Record<string, any> = {
  vscode: {
    label: "VS Code",
    bg: "#1e1e1e",
    text: "#d4d4d4",
    tokens: {
      key: "#9CDCFE",
      string: "#CE9178",
      boolean: "#569CD6",
      number: "#B5CEA8",
      comment: "#d5e4ce",
    },
  },
  dracula: {
    label: "Dracula",
    bg: "#282A36",
    text: "#f8f8f2",
    tokens: {
      key: "#ff79c6",
      string: "#f1fa8c",
      boolean: "#bd93f9",
      number: "#bd93f9",
      comment: "#cfd4e3",
    },
  },
  midnight: {
    label: "Midnight",
    bg: "#0F172A",
    text: "#E2E8F0",
    tokens: {
      key: "#38BDF8",
      string: "#A5F3FC",
      boolean: "#818CF8",
      number: "#F472B6",
      comment: "#d1d7e0",
    },
  },
  monokai: {
    label: "Monokai",
    bg: "#272822",
    text: "#f8f8f2",
    tokens: {
      key: "#F92672",
      string: "#E6DB74",
      boolean: "#AE81FF",
      number: "#AE81FF",
      comment: "#dddbd5",
    },
  },
  github_light: {
    label: "Light",
    bg: "#ffffff",
    text: "#24292e",
    isLight: true,
    tokens: {
      key: "#d73a49",
      string: "#032f62",
      boolean: "#005cc5",
      number: "#005cc5",
      comment: "#6a737d",
    },
  },
};
