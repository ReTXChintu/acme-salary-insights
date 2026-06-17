import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ColorMode = "light" | "dark";

type ThemeContextValue = {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
};

const STORAGE_KEY = "acme-theme";

const ThemeContext = createContext<ThemeContextValue>({
  colorMode: "light",
  setColorMode: () => {},
  toggleColorMode: () => {},
});

function getInitialColorMode(): ColorMode {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyColorMode(colorMode: ColorMode): void {
  const root = document.documentElement;
  root.dataset.theme = colorMode;
  root.classList.toggle("dark", colorMode === "dark");
  root.classList.toggle("light", colorMode === "light");
  localStorage.setItem(STORAGE_KEY, colorMode);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorMode, setColorModeState] = useState<ColorMode>(() =>
    getInitialColorMode(),
  );

  useLayoutEffect(() => {
    applyColorMode(colorMode);
  }, [colorMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEY)) {
        return;
      }

      setColorModeState(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorModeState((current) => (current === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({ colorMode, setColorMode, toggleColorMode }),
    [colorMode, setColorMode, toggleColorMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
