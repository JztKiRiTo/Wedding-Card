import { wedding } from "/details.js";

for (const [key, value] of Object.entries(wedding)) {
  document.querySelectorAll(`[data-detail="${key}"]`).forEach((el) => { el.textContent = value; });
}
document.title = `${wedding.nameOne} & ${wedding.nameTwo} — A Wedding Celebration`;
document.querySelector('meta[name="description"]').content = `A wedding celebration for ${wedding.nameOne} and ${wedding.nameTwo}.`;
if (wedding.mapUrl) document.querySelector("[data-map-link]").href = wedding.mapUrl;

const timeline = document.getElementById("timeline");
wedding.schedule.forEach((item) => {
  const row = document.createElement("article"); row.className = "timeline-item";
  const time = document.createElement("time"); time.textContent = item.time;
  const marker = document.createElement("span"); marker.className = "timeline-marker"; marker.setAttribute("aria-hidden", "true"); marker.textContent = "✦";
  const copy = document.createElement("div"); const title = document.createElement("h3"); title.textContent = item.title; const detail = document.createElement("p"); detail.textContent = item.detail; copy.append(title, detail); row.append(time, marker, copy); timeline.append(row);
});

const scene = document.getElementById("openingScene");
const door = document.getElementById("openDoor");
const skip = document.getElementById("skipIntro");
let state = "closed";
let closeTimer;
function revealWebsite() {
  state = "open"; scene.classList.add("is-gone"); document.body.classList.add("invitation-open");
  document.querySelector("main").inert = false;
  video.play().catch(() => video.classList.add("video-unavailable"));
  document.getElementById("home").focus({ preventScroll: true });
}
function openInvitation(skipAnimation = false) {
  if (state !== "closed") return;
  state = "opening"; door.disabled = true; scene.classList.add("is-opening", "doors-opening");
  if (skipAnimation || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    scene.classList.add("doors-opening");
    revealWebsite();
    return;
  }
  // The door leaves swing outward together to reveal the page behind them.
  closeTimer = window.setTimeout(() => {
    revealWebsite();
  }, 2300);
}
door.addEventListener("click", () => openInvitation());
skip.addEventListener("click", () => openInvitation(true));
document.addEventListener("keydown", (event) => {
  if (state === "closed" && (event.key === "Enter" || event.key === " ")) {
    if (event.target === door || door.contains(event.target) || event.target === skip) return;
    event.preventDefault(); openInvitation();
  }
});

const video = document.getElementById("weddingVideo");
video.addEventListener("error", () => video.classList.add("video-unavailable"));
if (video.error) video.classList.add("video-unavailable");
const weddingTime = new Date(wedding.dateISO).getTime();
const countdownFields = ["days", "hours", "minutes", "seconds"].map((id) => document.getElementById(id));
function updateCountdown() {
  let seconds = Math.max(0, Math.floor((weddingTime - Date.now()) / 1000));
  const values = [Math.floor(seconds / 86400), Math.floor((seconds % 86400) / 3600), Math.floor((seconds % 3600) / 60), seconds % 60];
  countdownFields.forEach((field, index) => { field.textContent = String(values[index]).padStart(index ? 2 : 3, "0"); });
}
updateCountdown(); window.setInterval(updateCountdown, 1000);

document.getElementById("rsvpForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget; const note = document.getElementById("formNote");
  if (!form.reportValidity()) return;
  note.textContent = "Thank you for your reply. This demo does not send or store responses yet; connect a backend or form service to receive them.";
  note.classList.add("form-success");
});
