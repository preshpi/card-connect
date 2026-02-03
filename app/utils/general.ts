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

export function isColorLight(color: string) {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
}

export const PATTERNS = [
  {
    id: "zebra",
    label: "Zebra",
    css: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,1) 10px, rgba(255,255,255,1) 20px)",
  },
  {
    id: "geo",
    label: "Geometric",
    css: "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,1) 5px, rgba(255,255,255,1) 10px)",
  },
  {
    id: "lines",
    label: "Lines",
    css: "repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,1) 20px)",
  },
  {
    id: "carbon",
    label: "Carbon",
    css: "linear-gradient(45deg, rgba(255,255,255,1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,1) 75%, rgba(255,255,255,1)), linear-gradient(45deg, rgba(255,255,255,1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,1) 75%, rgba(255,255,255,1))",
    size: "20px 20px",
  },
  {
    id: "diagonal",
    label: "Blueprint",
    css: "repeating-linear-gradient(45deg, rgba(255,255,255,1), rgba(255,255,255,1) 1px, transparent 1px, transparent 10px)",
    size: "auto",
  },
  {
    id: "sparkles",
    label: "Sparkles",
    css: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px), radial-gradient(circle, rgba(255,255,255,1) 2px, transparent 2px)",
    size: "60px 60px",
  },
  {
    id: "hearts",
    label: "Hearts",
    css: "radial-gradient(circle at 50% 40%, rgba(255,255,255,1) 10%, transparent 11%), radial-gradient(circle at 40% 50%, rgba(255,255,255,1) 10%, transparent 11%), radial-gradient(circle at 60% 50%, rgba(255,255,255,1) 10%, transparent 11%)",
    size: "40px 40px",
  },
  {
    id: "dots",
    label: "Terminal",
    css: "radial-gradient(rgba(255,255,255,1) 1.5px, transparent 1.5px)",
    size: "15px 15px",
  },
  {
    id: "grid",
    label: "Grid",
    css: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
    size: "25px 25px",
  },
];
