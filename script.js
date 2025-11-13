/* ======================================================================= */
/* OPEN / CLOSE SETTINGS MODAL */
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
  mobileSetting.classList.remove("mobile__setting--active");
});

// 3️⃣ Close the modal when clicking outside it
document.addEventListener("click", (e) => {
  if (
    mobileSetting.classList.contains("mobile__setting--active") &&
    !mobileSetting.contains(e.target) &&
    !settingBtn.contains(e.target)
  ) {
    mobileSetting.classList.remove("mobile__setting--active");
  }
});

/* ======================================================================= */
/* Mouse Down increments and decrements */
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

  arrow.addEventListener("mousedown", () => {
    const input = arrow.closest(".setting__time-input-group").querySelector("input");
    actionFn(input);
    intervalId = setInterval(() => actionFn(input), 120);
  });

  arrow.addEventListener("mouseup", () => clearInterval(intervalId));
  arrow.addEventListener("mouseleave", () => clearInterval(intervalId));
  arrow.addEventListener("mouseout", () => clearInterval(intervalId));
  arrow.addEventListener("click", (e) => e.preventDefault());
}

// Apply to all arrows
upArrows.forEach((arrow) => handleHold(arrow, increment));
downArrows.forEach((arrow) => handleHold(arrow, decrement));

/* ======================================================================= */
/* FONT + COLOR SETTING LOGIC */
/* ======================================================================= */

const fontButtons = document.querySelectorAll(".setting__font-option");
const applyBtn = document.querySelector(".apply-btn");
const app = document.querySelector("body");

const colorOptions = document.querySelectorAll(".setting__color-option");
// Updated selector for the new circle element
const progressCircle = document.querySelector(".progress-circle");

/* ======================================================================= */
/* SHARED STATE FOR FONT + COLOR + TIMER */
/* ======================================================================= */

// 🟥 Default color = red on first load
let currentColor = localStorage.getItem("selectedColor") || "red";
let previewColor = currentColor;

let currentFont = localStorage.getItem("selectedFont") || "kumbh";
let previewFont = currentFont;

/* ======================================================================= */
/* TIMER LOGIC CONNECTION */
/* ======================================================================= */

const timeDisplay = document.querySelector(".time");
const timerSVG = document.querySelector(".progress-circle");
const pauseBtn = document.querySelector(".pause-and-restart");

const pomodoroInput = document.querySelector("#pomodoro");
const shortBreakInput = document.querySelector("#short-break");
const longBreakInput = document.querySelector("#long-break");

pomodoroInput.value = localStorage.getItem("pomodoroTime") || 25;
shortBreakInput.value = localStorage.getItem("shortTime") || 5;
longBreakInput.value = localStorage.getItem("longTime") || 15;

let durations = {
  pomodoro: parseInt(pomodoroInput.value, 10) * 60,
  short: parseInt(shortBreakInput.value, 10) * 60,
  long: parseInt(longBreakInput.value, 10) * 60,
};

let currentMode = "pomodoro";
let countdown;
let isRunning = false;
let remainingTime = durations[currentMode];
let isCompleted = false; // New flag to track if timer completed

/* ======================================================================= */
/* SVG PROGRESS BAR SETUP */
/* ======================================================================= */

const radius = 120; // Updated to match the circle's actual radius
const circumference = 2 * Math.PI * radius;

timerSVG.style.strokeDasharray = circumference;
timerSVG.style.strokeDashoffset = 0;

/* ======================================================================= */
/* LOAD SAVED FONT + COLOR ON PAGE LOAD */
/* ======================================================================= */

applyFont(currentFont);
highlightActiveFont(currentFont);

// 🟥 Force apply default or saved color immediately (so SVG is red by default)
applyColor(currentColor);
highlightActiveColor(currentColor);

/* ======================================================================= */
/* FONT BUTTON CLICK (LIVE PREVIEW) */
/* ======================================================================= */

fontButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    fontButtons.forEach((b) => b.classList.remove("setting__font-option--active"));
    btn.classList.add("setting__font-option--active");

    if (btn.classList.contains("kumbh-sans-font")) previewFont = "kumbh";
    if (btn.classList.contains("roboto-font")) previewFont = "roboto";
    if (btn.classList.contains("space-mono-font")) previewFont = "space";

    applyFont(previewFont);
  });
});

/* ======================================================================= */
/* COLOR BUTTON CLICK (LIVE PREVIEW) */
/* ======================================================================= */

colorOptions.forEach((option) => {
  option.addEventListener("click", () => {
    colorOptions.forEach((c) => c.classList.remove("setting__color-option--active"));
    option.classList.add("setting__color-option--active");

    if (option.classList.contains("color-red")) previewColor = "red";
    if (option.classList.contains("color-cyan")) previewColor = "cyan";
    if (option.classList.contains("color-purple")) previewColor = "purple";

    applyColor(previewColor);
  });
});

/* ======================================================================= */
/* APPLY BUTTON (CONFIRM FONT + COLOR + TIMER DURATION) */
/* ======================================================================= */

applyBtn.addEventListener("click", () => {
  currentFont = previewFont;
  currentColor = previewColor;

  durations.pomodoro = parseInt(pomodoroInput.value, 10) * 60;
  durations.short = parseInt(shortBreakInput.value, 10) * 60;
  durations.long = parseInt(longBreakInput.value, 10) * 60;

  resetTimer();

  localStorage.setItem("selectedFont", currentFont);
  localStorage.setItem("selectedColor", currentColor);
  localStorage.setItem("pomodoroTime", pomodoroInput.value);
  localStorage.setItem("shortTime", shortBreakInput.value);
  localStorage.setItem("longTime", longBreakInput.value);

  mobileSetting.classList.remove("mobile__setting--active");
});

/* ======================================================================= */
/* CLOSE OR CLICK OUTSIDE (REVERT FONT + COLOR) */
/* ======================================================================= */

function revertAllChanges() {
  previewFont = currentFont;
  previewColor = currentColor;

  applyFont(currentFont);
  applyColor(currentColor);
  highlightActiveFont(currentFont);
  highlightActiveColor(currentColor);

  mobileSetting.classList.remove("mobile__setting--active");
}

closeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  revertAllChanges();
});

document.addEventListener("mousedown", (e) => {
  const isModalOpen = mobileSetting.classList.contains("mobile__setting--active");
  const clickedInside = mobileSetting.contains(e.target);
  const clickedSettingBtn = settingBtn.contains(e.target);
  const clickedApplyBtn = applyBtn.contains(e.target);

  if (isModalOpen && !clickedInside && !clickedSettingBtn && !clickedApplyBtn) {
    revertAllChanges();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileSetting.classList.contains("mobile__setting--active")) {
    revertAllChanges();
  }
});

/* ======================================================================= */
/* FONT HELPERS */
/* ======================================================================= */

function applyFont(font) {
  app.classList.remove("font--kumbh", "font--roboto", "font--space");
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

/* ======================================================================= */
/* COLOR HELPERS */
/* ======================================================================= */

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

  // 🟥 Apply color to SVG circle's stroke (not fill)
  if (progressCircle) {
    progressCircle.setAttribute("stroke", colorValue);
  }

  applyBtn.style.backgroundColor = colorValue;

  // Store globally for use in tab highlight
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

/* ======================================================================= */
/* TAB FUNCTIONALITY WITH COLOR + TIMER SUPPORT */
/* ======================================================================= */

const tabOptions = document.querySelectorAll(".tab-options");

tabOptions.forEach((tab) => {
  tab.addEventListener("click", function () {
    tabOptions.forEach((t) => {
      t.classList.remove("active");
      t.style.backgroundColor = "";
      t.style.opacity = "";
    });

    this.classList.add("active");

    if (window.currentThemeColor) {
      this.style.backgroundColor = window.currentThemeColor;
      this.style.opacity = "1";
    }

    if (this.textContent.includes("pomodoro")) currentMode = "pomodoro";
    if (this.textContent.includes("short")) currentMode = "short";
    if (this.textContent.includes("long")) currentMode = "long";

    resetTimer();
  });

  tab.addEventListener("mouseenter", function () {
    if (!this.classList.contains("active") && window.currentThemeColor) {
      this.style.backgroundColor = window.currentThemeColor;
      this.style.opacity = "0.7";
    }
  });

  tab.addEventListener("mouseleave", function () {
    if (!this.classList.contains("active")) {
      this.style.backgroundColor = "";
      this.style.opacity = "";
    }
  });
});

// Initialize first tab as active and red by default
tabOptions[0].classList.add("active");
tabOptions[0].style.backgroundColor = "#F87070";
tabOptions[0].style.opacity = "1";
window.currentThemeColor = "#F87070";

/* ======================================================================= */
/* TIMER FUNCTIONS (START / PAUSE / RESET / PROGRESS ANIMATION) */
/* ======================================================================= */

function resetTimer() {
  clearInterval(countdown);
  isRunning = false;
  isCompleted = false; // Reset completion flag
  pauseBtn.textContent = "Start";

  remainingTime = durations[currentMode];
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timeDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  timerSVG.style.transition = "none";
  timerSVG.style.strokeDashoffset = 0;
  setTimeout(() => (timerSVG.style.transition = "stroke-dashoffset 1s linear"), 0);
}

function startTimer() {
  clearInterval(countdown);
  const startTime = Date.now();
  const endTime = startTime + remainingTime * 1000;

  countdown = setInterval(() => {
    const now = Date.now();
    const timeLeft = Math.max(0, Math.round((endTime - now) / 1000));
    remainingTime = timeLeft;

    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    timeDisplay.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(
      2,
      "0"
    )}`;

    const progress = (1 - timeLeft / durations[currentMode]) * circumference;
    timerSVG.style.strokeDashoffset = progress;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      isRunning = false;
      isCompleted = true; // Set completion flag
      pauseBtn.textContent = "Restart"; // Show "Restart" instead of "Start"
      console.log("⏰ Time's up!");

      // Optional: Play a sound or show a notification here
      // playAlarmSound();
      // showNotification();
    }
  }, 1000);
}

/* ======================================================================= */
/* START / PAUSE / RESTART BUTTON HANDLER (FULLY FUNCTIONAL) */
/* ======================================================================= */

pauseBtn.addEventListener("click", () => {
  // If timer completed, restart it
  if (isCompleted) {
    resetTimer();
    isRunning = true;
    pauseBtn.textContent = "Pause";
    startTimer(); // Start the timer immediately after reset
  }
  // If not running, start/resume timer
  else if (!isRunning) {
    isRunning = true;
    pauseBtn.textContent = "Pause";
    startTimer(); // ▶️ resume timer
  }
  // If running, pause timer
  else {
    isRunning = false;
    pauseBtn.textContent = "Start";
    clearInterval(countdown); // ⏸️ pause timer
  }
});

// Initialize timer and ensure SVG starts red
applyColor("red");
resetTimer();
