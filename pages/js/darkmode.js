const toggleDarkButton = document.getElementById('toggleDark');
const toggleLightButton = document.getElementById('toggleLight');

const darkThemeDiv = document.getElementById('darkThemeDiv');
const lightThemeDiv = document.getElementById('lightThemeDiv');

const currentTheme = localStorage.getItem('theme');
const bodyElement = document.body; // or a main container element

function applyTheme(theme) {
  if (theme === 'dark-mode') {
    darkThemeDiv.style.display = 'block';
    lightThemeDiv.style.display = 'none';
    bodyElement.classList.add('dark-mode');
    bodyElement.classList.remove('light-mode');
    toggleDarkButton.style.display = 'none';
    toggleLightButton.style.display = 'block';
  } else {
    darkThemeDiv.style.display = 'none';
    lightThemeDiv.style.display = 'block';
    bodyElement.classList.add('light-mode');
    bodyElement.classList.remove('dark-mode');
    toggleDarkButton.style.display = 'block';
    toggleLightButton.style.display = 'none';
  }
  localStorage.setItem('theme', theme);
}

if (currentTheme) {
  applyTheme(currentTheme);
} else {
  // Set a default theme if none is stored
  applyTheme('light-mode');
}

toggleDarkButton.addEventListener('click', function() {
  applyTheme('dark-mode');
});

toggleLightButton.addEventListener('click', function() {
  applyTheme('light-mode');
});
