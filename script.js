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

// 3️⃣ Close the modal when clicking outside the modal content

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

/*
This runs first when the page loads,
- it calls handleHold for each up and down arrow,
- this forEach basically calls the functiion three times as follows:

handleHold(upArrow1, increment)

handleHold(upArrow2, increment)

handleHold(upArrow3, increment)

- so at the end we have these attached, meaning the functions are called.
*/

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

upArrows.forEach((arrow) => handleHold(arrow, increment));
downArrows.forEach((arrow) => handleHold(arrow, decrement));

/* ======================================================================= */
/* FONT + COLOR SETTING LOGIC */
/* ======================================================================= */

const fontButtons = document.querySelectorAll(".setting__font-option");
const applyBtn = document.querySelector(".apply-btn");
const app = document.querySelector("body");
