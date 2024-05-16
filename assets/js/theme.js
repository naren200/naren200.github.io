const STORAGE_KEY = "theme";
const THEME_ATTR  = "data-theme";
const QUERY_KEY   = "(prefers-color-scheme: dark)";

const themes = {
  LIGHT: "light",
  DARK: "dark",
};

initTheme();

// Ensure the dark theme on the landing page
function initTheme() {
  const currentPath = window.location.pathname;

  if (currentPath === "/" || currentPath === "/index.html") {
    setTheme(themes.DARK);
  } else {
    const savedTheme = localStorage.getItem(STORAGE_KEY) || themes.DARK;
    setTheme(savedTheme);
  }

  // System theme change listener for non-landing pages
  if (currentPath !== "/" && currentPath !== "/index.html") {
    window.matchMedia(QUERY_KEY).addEventListener("change", (e) => {
      const newTheme = e.matches ? themes.DARK : themes.LIGHT;
      setTheme(newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
    });
  }
}

function toggleTheme() {
  // console.log("Current path:", window.location.pathname);
    // Check if the current page is /home
    if (window.location.pathname === "/") {
      setTheme(themes.DARK);
      localStorage.setItem(STORAGE_KEY, themes.DARK);
      return; // Exit the function
    }
  
  const theme = getTheme();
  const newTheme = theme === themes.DARK ? themes.LIGHT : themes.DARK;
  setTheme(newTheme);
  localStorage.setItem(STORAGE_KEY, newTheme);
}

function getTheme() {
  return document.documentElement.getAttribute(THEME_ATTR);
}

function setTheme(value) {
  document.documentElement.setAttribute(THEME_ATTR, value);
}
