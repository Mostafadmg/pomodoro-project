/* ======================================================================= */
/* LEARNING NOTES - My Journey Building This Code */
/* ======================================================================= */

/*
FONT SELECTION - First Attempt (Using inline styles):
- Used btn.dataset.tooltip to get font name
- Applied font with app.style.fontFamily = fontName
- This worked but didn't support preview/revert functionality
- Replaced with CSS class approach for better control

COLOR SELECTION - Understanding:
- Added color functionality after mastering fonts
- Combined revert functions into one (revertAllChanges)
- Both font and color now revert together when closing without Apply

KEY LEARNINGS:
- else if is better than multiple if when only one can be true
- Preview vs. Apply pattern: currentColor = previewColor (save), previewColor = currentColor (revert)
- localStorage persists data across page refreshes
- window.currentThemeColor makes color available globally for tabs
*/

/* ======================================================================= */
/* MODAL OPEN/CLOSE FUNCTIONALITY */
/* ======================================================================= */

const settingBtn = document.querySelector(".setting-button");
const mobileSetting = document.querySelector(".mobile__setting");
const closeBtn = document.querySelector(".close__btn");

// 1️⃣ Open the modal
settingBtn.addEventListener("click", () => {
  mobileSetting.classList.add("mobile__setting--active");
});

// 2️⃣ Close the modal when clicking the X button
closeBtn.addEventListener("click", () => {
  revertAllChanges();
});

// 3️⃣ Close the modal when clicking outside the modal content
document.addEventListener("click", (e) => {
  if (
    mobileSetting.classList.contains("mobile__setting--active") &&
    !mobileSetting.contains(e.target) &&
    !settingBtn.contains(e.target) &&
    !applyBtn.contains(e.target)
  ) {
    revertAllChanges();
  }
});

/* ======================================================================= */
/* INCREMENT/DECREMENT ARROWS */
/* ======================================================================= */

const upArrows = document.querySelectorAll(".setting__time-input-arrows img[alt='up']");
const downArrows = document.querySelectorAll(
  ".setting__time-input-arrows img[alt='down']"
);

// ===== HELPER FUNCTIONS =====
function increment(input) {
  input.value = parseInt(input.value, 10) + 1;
}

function decrement(input) {
  const currentValue = parseInt(input.value, 10);
  if (currentValue > 1) {
    input.value = currentValue - 1;
  }
}

// ====== CONTINUOUS HOLD FUNCTIONALITY ======
function handleHold(arrow, actionFn) {
  let intervalId;

  function startHold() {
    const input = arrow.closest(".setting__time-input-group").querySelector("input");
    actionFn(input);
    intervalId = setInterval(() => actionFn(input), 120);
  }

  function stopHold() {
    clearInterval(intervalId);
  }

  // Desktop events
  arrow.addEventListener("mousedown", startHold);
  arrow.addEventListener("mouseup", stopHold);
  arrow.addEventListener("mouseleave", stopHold);

  // Mobile events
  arrow.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Prevents ghost clicks on mobile
    startHold();
  });
  arrow.addEventListener("touchend", stopHold);
  arrow.addEventListener("touchcancel", stopHold);
  arrow.addEventListener("click", (e) => e.preventDefault());
}

upArrows.forEach((arrow) => handleHold(arrow, increment));
downArrows.forEach((arrow) => handleHold(arrow, decrement));

/* ======================================================================= */
/* FONT SELECTION */
/* ======================================================================= */

const fontButtons = document.querySelectorAll(".setting__font-option");
const app = document.querySelector("body");
const applyBtn = document.querySelector(".apply-btn");

let currentFont = localStorage.getItem("selectedFont") || "kumbh";
let previewFont = currentFont;

function applyFont(font) {
  app.classList.remove("font--roboto", "font--space", "font--kumbh");
  app.classList.add(`font--${font}`);
}

function highlightActiveFont(font) {
  fontButtons.forEach((btn) => {
    btn.classList.remove("setting__font-option--active");

    if (
      (font === "kumbh" && btn.classList.contains("kumbh-sans-font")) ||
      (font === "roboto" && btn.classList.contains("roboto-font")) ||
      (font === "space" && btn.classList.contains("space-mono-font"))
    ) {
      btn.classList.add("setting__font-option--active");
    }
  });
}

// Font button click listeners
fontButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    fontButtons.forEach((b) => {
      b.classList.remove("setting__font-option--active");
    });
    btn.classList.add("setting__font-option--active");

    if (btn.classList.contains("kumbh-sans-font")) previewFont = "kumbh";
    else if (btn.classList.contains("roboto-font")) previewFont = "roboto";
    else if (btn.classList.contains("space-mono-font")) previewFont = "space";

    applyFont(previewFont);
  });
});

/* ======================================================================= */
/* COLOR SELECTION */
/* ======================================================================= */

const colorOptions = document.querySelectorAll(".setting__color-option");
const progressCircle = document.querySelector(".progress-circle");
const tabOptions = document.querySelectorAll(".tab-options");

let currentColor = localStorage.getItem("selectedColor") || "red";
let previewColor = currentColor;

function applyColor(color) {
  let colorValue;

  switch (color) {
    case "red":
      colorValue = "#F87070";
      break;
    case "cyan":
      colorValue = "#70F3F8";
      break;
    case "purple":
      colorValue = "#D881F8";
      break;
  }

  // Apply color to SVG progress circle
  if (progressCircle) {
    progressCircle.setAttribute("stroke", colorValue);
  }

  // Apply color to Apply button
  applyBtn.style.backgroundColor = colorValue;

  // Store globally for tab highlighting
  window.currentThemeColor = colorValue;

  const activeTab = document.querySelector(".tab-options.active");
  if (activeTab) {
    activeTab.style.backgroundColor = colorValue;
  }
}

function highlightActiveColor(color) {
  colorOptions.forEach((option) => {
    option.classList.remove("setting__color-option--active");

    if (
      (color === "red" && option.classList.contains("color-red")) ||
      (color === "cyan" && option.classList.contains("color-cyan")) ||
      (color === "purple" && option.classList.contains("color-purple"))
    ) {
      option.classList.add("setting__color-option--active");
    }
  });
}

// Color button click listeners
colorOptions.forEach((option) => {
  option.addEventListener("click", () => {
    colorOptions.forEach((c) => c.classList.remove("setting__color-option--active"));
    option.classList.add("setting__color-option--active");

    if (option.classList.contains("color-red")) previewColor = "red";
    else if (option.classList.contains("color-cyan")) previewColor = "cyan";
    else if (option.classList.contains("color-purple")) previewColor = "purple";

    applyColor(previewColor);
  });
});

/* ======================================================================= */
/* APPLY BUTTON - Save Font & Color */
/* ======================================================================= */
applyBtn.addEventListener("click", () => {
  // Save font
  currentFont = previewFont;
  localStorage.setItem("selectedFont", currentFont);

  // Save color
  currentColor = previewColor;
  localStorage.setItem("selectedColor", currentColor);

  // Update durations from inputs
  durations.pomodoro = parseInt(pomodoroInput.value, 10) * 60;
  durations.short = parseInt(shortBreakInput.value, 10) * 60;
  durations.long = parseInt(longBreakInput.value, 10) * 60;

  // Save durations to localStorage
  localStorage.setItem("pomodoroTime", pomodoroInput.value);
  localStorage.setItem("shortTime", shortBreakInput.value);
  localStorage.setItem("longTime", longBreakInput.value);

  // Reset timer with new duration
  remainingTime = durations[currentMode];
  updateDisplay();

  // Close modal
  mobileSetting.classList.remove("mobile__setting--active");
});
/* ======================================================================= */
/* REVERT ALL CHANGES - Font + Color */
/* ======================================================================= */

function revertAllChanges() {
  // Revert font
  previewFont = currentFont;
  applyFont(currentFont);
  highlightActiveFont(currentFont);

  // Revert color
  previewColor = currentColor;
  applyColor(currentColor);
  highlightActiveColor(currentColor);

  // Close modal
  mobileSetting.classList.remove("mobile__setting--active");
}

/* ======================================================================= */
/* INITIALIZE ON PAGE LOAD */
/* ======================================================================= */

// Apply saved font
applyFont(currentFont);
highlightActiveFont(currentFont);

// Apply saved color
applyColor(currentColor);
highlightActiveColor(currentColor);

/* ======================================================================= */
/* TAB SWITCHING */
/* ======================================================================= */

function hexToRgba(hex, alpha) {
  hex = hex.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

tabOptions.forEach((tab) => {
  // Hover effect (only for inactive tabs)
  tab.addEventListener("mouseenter", function () {
    if (!this.classList.contains("active")) {
      const globalColor = window.currentThemeColor;
      this.style.backgroundColor = hexToRgba(globalColor, 0.7);
    }
  });

  // Remove hover effect (only for inactive tabs)
  tab.addEventListener("mouseleave", function () {
    if (!this.classList.contains("active")) {
      this.style.backgroundColor = "";
      this.style.opacity = "";
    }
  });

  // Click to activate
  tab.addEventListener("click", function () {
    const globalColor = window.currentThemeColor;

    // Remove active from all tabs
    tabOptions.forEach((t) => {
      t.classList.remove("active");
      t.style.backgroundColor = "";
      t.style.opacity = ""; // ← Fixed: empty string
    });

    // Add active to clicked tab
    this.classList.add("active");
    this.style.backgroundColor = globalColor;
    this.style.opacity = "1";

    if (this.textContent.includes("pomodoro")) {
      currentMode = "pomodoro";
    } else if (this.textContent.includes("short")) {
      currentMode = "short";
    } else if (this.textContent.includes("long")) {
      currentMode = "long";
    }

    resetTimer();
  });
});
tabOptions[0].classList.add("active");
tabOptions[0].style.backgroundColor = window.currentThemeColor;
tabOptions[0].style.opacity = "1";

/* ======================================================================= */
/* TIMER ELEMENTS */
/* ======================================================================= */
const timeDisplay = document.querySelector(".time");
const pauseBtn = document.querySelector(".pause-and-restart");
const timerSVG = document.querySelector(".progress-circle");

const pomodoroInput = document.querySelector("#pomodoro");
const shortBreakInput = document.querySelector("#short-break");
const longBreakInput = document.querySelector("#long-break");

pomodoroInput.value = localStorage.getItem("pomodoroTime") || 25;
shortBreakInput.value = localStorage.getItem("shortTime") || 5;
longBreakInput.value = localStorage.getItem("longTime") || 15;

const radius = 120;
const circumference = 2 * Math.PI * radius; // ~753.98 pixels
timerSVG.style.strokeDasharray = circumference;
timerSVG.style.strokeDashoffset = 0;

//convert minutes to seconds

let durations = {
  pomodoro: parseInt(pomodoroInput.value, 10) * 60,
  short: parseInt(shortBreakInput.value, 10) * 60,
  long: parseInt(longBreakInput.value, 10) * 60,
};

let currentMode = "pomodoro"; // Start in pomodoro mode
let countdown; // Will store the setInterval ID
let isRunning = false; // Is the timer currently counting down?
let remainingTime = durations[currentMode]; // Seconds left in current mode

function updateDisplay() {
  let minutes = String(Math.floor(remainingTime / 60)).padStart(2, "0");
  let seconds = String(remainingTime % 60).padStart(2, "0");
  timeDisplay.textContent = `${minutes}:${seconds}`;
}

updateDisplay();

/* ======================================================================= */
/* Start Timer Function*/
/* ======================================================================= */

function startTimer(immediate = true) {
  // Re-enable smooth animation whenever we start/resume
  timerSVG.style.transition = "stroke-dashoffset 1s linear";

  const tick = () => {
    if (remainingTime > 0) {
      remainingTime--;
      updateDisplay();

      const progress = (1 - remainingTime / durations[currentMode]) * circumference;

      timerSVG.style.strokeDashoffset = progress;
    } else {
      clearInterval(countdown);
      isRunning = false;
      isCompleted = true;
      pauseBtn.textContent = "Restart";
    }
  };

  // If starting from fresh, tick immediately (so user sees change)
  if (immediate) {
    tick();
    countdown = setInterval(tick, 1000);
  } else {
    // If resuming from pause, wait 1 second before first tick
    countdown = setInterval(tick, 1000);
  }
}

/* ======================================================================= */
/* Pause Button*/
/* ======================================================================= */
pauseBtn.textContent = "Start";
let isCompleted = false;

pauseBtn.addEventListener("click", () => {
  // If completed → restart logic
  if (isCompleted) {
    resetTimer();
    isCompleted = false;
    isRunning = true;
    pauseBtn.textContent = "Pause";
    startTimer(true);
    return;
  }

  // Start or resume
  if (!isRunning) {
    isRunning = true;
    pauseBtn.textContent = "Pause";

    // 🟢 RESUME FIX
    // 1️⃣ Re-enable animation immediately
    timerSVG.style.transition = "stroke-dashoffset 1s linear";

    // 2️⃣ Do an immediate fake tick to avoid jump
    const progress = (1 - remainingTime / durations[currentMode]) * circumference;
    timerSVG.style.strokeDashoffset = progress;

    // 3️⃣ Then start normal ticking (no immediate tick)
    countdown = setInterval(() => {
      remainingTime--;
      updateDisplay();

      const progress2 = (1 - remainingTime / durations[currentMode]) * circumference;
      timerSVG.style.strokeDashoffset = progress2;

      if (remainingTime <= 0) {
        clearInterval(countdown);
        isRunning = false;
        isCompleted = true;
        pauseBtn.textContent = "Restart";
      }
    }, 1000);

    return;
  }

  // Pause
  isRunning = false;
  pauseBtn.textContent = "Start";
  clearInterval(countdown);

  // Freeze at REAL pixel position
  const computedOffset = parseFloat(getComputedStyle(timerSVG).strokeDashoffset);
  timerSVG.style.transition = "none";
  timerSVG.style.strokeDashoffset = computedOffset;
});

/* ======================================================================= */
/* Reset Timer Logic*/
/* ======================================================================= */

function resetTimer() {
  clearInterval(countdown); // Stop the countdown if it's running
  isRunning = false;
  remainingTime = durations[currentMode];
  updateDisplay();
  pauseBtn.textContent = "Start";
  timerSVG.style.strokeDashoffset = 0;
}
