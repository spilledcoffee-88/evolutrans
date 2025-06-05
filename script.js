// ===== GLOBAL STATE ===== //
let roadmapItems = JSON.parse(localStorage.getItem("roadmap")) || [
  { id: 1, text: "Schedule HRT consultation", completed: false },
  { id: 2, text: "Research name change process", completed: false },
  { id: 3, text: "Build support network", completed: false },
  { id: 4, text: "Begin voice training", completed: false },
];

let calendar;

// ===== TAB SWITCHING ===== //
document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-button")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".tab-pane")
      .forEach((pane) => pane.classList.remove("active"));
    button.classList.add("active");
    const tabId = button.getAttribute("data-tab");
    document.getElementById(tabId).classList.add("active");
  });
});

// ===== HOME TAB ===== //
function updateHomeSummary() {
  const lastDose = JSON.parse(localStorage.getItem("hormoneDoses"))?.slice(
    -1
  )[0];
  document.getElementById("last-dose").textContent = lastDose
    ? `${lastDose.type} on ${lastDose.date}`
    : "Not logged";

  const nextAppointment = JSON.parse(localStorage.getItem("appointments"))
    ?.sort((a, b) => new Date(a.date) - new Date(b.date))
    ?.find((appt) => new Date(appt.date) >= new Date());
  document.getElementById("next-appointment").textContent = nextAppointment
    ? `${nextAppointment.title} on ${nextAppointment.date}`
    : "None scheduled";

  const lastMood = JSON.parse(localStorage.getItem("moods"))?.slice(-1)[0];
  document.getElementById("recent-mood").textContent =
    lastMood?.rating || "No data";
}

// ===== HORMONE TRACKER ===== //
const doseDateInput = document.getElementById("dose-date");
const hormoneTypeSelect = document.getElementById("hormone-type");
const logDoseButton = document.getElementById("log-dose-button");
const doseHistoryDiv = document.getElementById("dose-history");

loadDoseHistory();

logDoseButton.addEventListener("click", () => {
  const date = doseDateInput.value;
  const type = hormoneTypeSelect.value;

  if (!date || !type) return alert("Please fill all fields!");

  const newDose = { date, type };
  const savedDoses = JSON.parse(localStorage.getItem("hormoneDoses")) || [];
  savedDoses.push(newDose);
  localStorage.setItem("hormoneDoses", JSON.stringify(savedDoses));

  loadDoseHistory();
  doseDateInput.value = "";
  updateHomeSummary();
});

function loadDoseHistory() {
  const savedDoses = JSON.parse(localStorage.getItem("hormoneDoses")) || [];
  doseHistoryDiv.innerHTML =
    savedDoses.length === 0
      ? '<p class="empty-state">No doses logged yet.</p>'
      : savedDoses
          .map(
            (dose, index) => `
        <div class="card dose-card">
          <p><strong>${dose.type}</strong> on ${dose.date}</p>
          <button onclick="deleteDose(${index})" class="delete-button">×</button>
        </div>
      `
          )
          .join("");
}

function deleteDose(index) {
  const savedDoses = JSON.parse(localStorage.getItem("hormoneDoses"));
  savedDoses.splice(index, 1);
  localStorage.setItem("hormoneDoses", JSON.stringify(savedDoses));
  loadDoseHistory();
  updateHomeSummary();
}

// ===== JOURNAL ===== //
const journalEntryTextarea = document.getElementById("journal-entry");
const saveJournalButton = document.getElementById("save-journal-button");
const journalEntriesDiv = document.getElementById("journal-entries");

loadJournalEntries();

saveJournalButton.addEventListener("click", () => {
  const text = journalEntryTextarea.value.trim();
  if (!text) return alert("Journal entry cannot be empty!");

  const newEntry = { text, date: new Date().toLocaleString() };
  const savedEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
  savedEntries.push(newEntry);
  localStorage.setItem("journalEntries", JSON.stringify(savedEntries));

  loadJournalEntries();
  journalEntryTextarea.value = "";
});

function loadJournalEntries() {
  const savedEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
  journalEntriesDiv.innerHTML =
    savedEntries.length === 0
      ? '<p class="empty-state">No journal entries yet.</p>'
      : savedEntries
          .map(
            (entry, index) => `
        <div class="card journal-card">
          <p><strong>${entry.date}</strong></p>
          <p class="editable" data-index="${index}">${entry.text}</p>
          <div class="journal-actions">
            <button onclick="editJournalEntry(${index})" class="action-button small">✏️ Edit</button>
            <button onclick="deleteJournalEntry(${index})" class="delete-button">×</button>
          </div>
        </div>
      `
          )
          .join("");
}

function deleteJournalEntry(index) {
  const savedEntries = JSON.parse(localStorage.getItem("journalEntries"));
  savedEntries.splice(index, 1);
  localStorage.setItem("journalEntries", JSON.stringify(savedEntries));
  loadJournalEntries();
}

function editJournalEntry(index) {
  const savedEntries = JSON.parse(localStorage.getItem("journalEntries"));
  const newText = prompt("Edit your entry:", savedEntries[index].text);
  if (newText !== null) {
    savedEntries[index].text = newText;
    localStorage.setItem("journalEntries", JSON.stringify(savedEntries));
    loadJournalEntries();
  }
}

// ===== MOOD TRACKER ===== //
const moodDateInput = document.getElementById("mood-date");
const moodRatingSelect = document.getElementById("mood-rating");
const logMoodButton = document.getElementById("log-mood-button");
const moodHistoryDiv = document.getElementById("mood-history");

loadMoodHistory();

logMoodButton.addEventListener("click", () => {
  const date = moodDateInput.value || new Date().toISOString().split("T")[0];
  const rating = moodRatingSelect.value;

  const newMood = { date, rating };
  const savedMoods = JSON.parse(localStorage.getItem("moods")) || [];
  savedMoods.push(newMood);
  localStorage.setItem("moods", JSON.stringify(savedMoods));

  loadMoodHistory();
  updateHomeSummary();
});

function loadMoodHistory() {
  const savedMoods = JSON.parse(localStorage.getItem("moods")) || [];
  moodHistoryDiv.innerHTML =
    savedMoods.length === 0
      ? '<p class="empty-state">No mood entries yet.</p>'
      : savedMoods
          .map(
            (mood, index) => `
        <div class="card mood-card">
          <span>${mood.rating} on ${mood.date}</span>
          <button onclick="deleteMood(${index})" class="delete-button">×</button>
        </div>
      `
          )
          .join("");
}

function deleteMood(index) {
  const savedMoods = JSON.parse(localStorage.getItem("moods"));
  savedMoods.splice(index, 1);
  localStorage.setItem("moods", JSON.stringify(savedMoods));
  loadMoodHistory();
  updateHomeSummary();
}

// ===== APPOINTMENTS ===== //
document.addEventListener("DOMContentLoaded", () => {
  if (typeof VanillaCalendar === "function") {
    calendar = new VanillaCalendar("#calendar", {
      settings: {
        selected: {
          dates: getSavedAppointmentDates(),
          highlight: { backgroundColor: "#9F7FDF" },
        },
      },
    });
    calendar.init();
  }

  generateTimeSlots();
});

document.getElementById("save-appointment").addEventListener("click", () => {
  const title = document.getElementById("appointment-title").value.trim();
  const date = document.getElementById("appointment-date").value;
  const time = document.getElementById("appointment-time").value;
  const duration = parseInt(
    document.getElementById("appointment-duration").value
  );
  const category = document.getElementById("appointment-category").value;
  const notes = document.getElementById("appointment-notes").value.trim();

  if (!title || !date || !time)
    return alert("Title, date and time are required!");

  const startDateTime = new Date(`${date}T${time}`);
  if (isNaN(startDateTime.getTime()))
    return alert("Invalid date or time format");

  const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

  const newAppointment = {
    title,
    date,
    time,
    duration,
    start: startDateTime.toISOString(),
    end: endDateTime.toISOString(),
    category,
    notes,
  };

  const savedAppointments =
    JSON.parse(localStorage.getItem("appointments")) || [];
  savedAppointments.push(newAppointment);
  localStorage.setItem("appointments", JSON.stringify(savedAppointments));

  loadAppointments();
  updateCalendarHighlights();
  clearAppointmentForm();
  updateHomeSummary();
});

function loadAppointments() {
  const savedAppointments =
    JSON.parse(localStorage.getItem("appointments")) || [];
  const appointmentsList = document.getElementById("appointments-list");

  appointmentsList.innerHTML =
    savedAppointments.length === 0
      ? '<p class="empty-state">No appointments scheduled.</p>'
      : savedAppointments
          .map(
            (appt, index) => `
        <div class="card appointment-card" data-category="${appt.category}">
          <button onclick="deleteAppointment(${index})" class="delete-button">×</button>
          <p class="appointment-date">${appt.date} at ${appt.time}</p>
          <h3>${appt.title}</h3>
          <p>Duration: ${appt.duration} minutes</p>
          <p>${appt.notes || "No notes"}</p>
        </div>
      `
          )
          .join("");
}

function deleteAppointment(index) {
  const savedAppointments = JSON.parse(localStorage.getItem("appointments"));
  savedAppointments.splice(index, 1);
  localStorage.setItem("appointments", JSON.stringify(savedAppointments));
  loadAppointments();
  updateCalendarHighlights();
  updateHomeSummary();
}

function updateCalendarHighlights() {
  if (!calendar) return;

  const savedAppointments =
    JSON.parse(localStorage.getItem("appointments")) || [];
  calendar.settings.selected.dates = savedAppointments.map((appt) => appt.date);
  calendar.update();
}

function getSavedAppointmentDates() {
  const savedAppointments =
    JSON.parse(localStorage.getItem("appointments")) || [];
  return savedAppointments.map((appt) => appt.date);
}

function clearAppointmentForm() {
  document.getElementById("appointment-title").value = "";
  document.getElementById("appointment-date").value = "";
  document.getElementById("appointment-time").value = "09:00";
  document.getElementById("appointment-notes").value = "";
}

// Calendar View Toggle
document.querySelectorAll(".calendar-view-toggle button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".calendar-view-toggle button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    if (calendar) {
      calendar.settings.visibility.weekNumbers = btn.dataset.view === "week";
      calendar.settings.visibility.months = btn.dataset.view === "month";
      calendar.settings.visibility.year = btn.dataset.view === "month";
      calendar.update();
    }
  });
});

// ===== TIME SLOTS GRID ===== //
function generateTimeSlots() {
  const container = document.getElementById("time-slots-grid");
  if (!container) return;

  container.innerHTML = "";

  const timeSidebar = document.createElement("div");
  timeSidebar.className = "time-slots-sidebar";

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const dayColumns = {};

  days.forEach((day) => {
    const column = document.createElement("div");
    column.className = "day-column";
    column.dataset.day = day;
    dayColumns[day] = column;

    column.addEventListener("dragover", (e) => e.preventDefault());
    column.addEventListener("drop", (e) => {
      e.preventDefault();
      const time = e.target.closest(".day-cell")?.dataset.time;
      const day = e.target.closest(".day-column")?.dataset.day;
      if (time && day) createAppointmentFromDrag(day, time);
    });
  });

  for (let hour = 8; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      const timeSlot = document.createElement("div");
      timeSlot.className = "time-slot";
      timeSlot.textContent = time;
      timeSlot.draggable = true;
      timeSlot.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.textContent);
      });
      timeSidebar.appendChild(timeSlot);

      days.forEach((day) => {
        const cell = document.createElement("div");
        cell.className = "day-cell";
        cell.dataset.time = time;
        cell.dataset.day = day;
        dayColumns[day].appendChild(cell);
      });
    }
  }

  container.appendChild(timeSidebar);
  Object.values(dayColumns).forEach((col) => container.appendChild(col));
  renderAppointmentsOnGrid();
}

function createAppointmentFromDrag(day, time) {
  const date = new Date();
  const dayOffset =
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day) -
    date.getDay();
  date.setDate(date.getDate() + dayOffset);

  document.getElementById("appointment-date").valueAsDate = date;
  document.getElementById("appointment-time").value = time;
  document.getElementById("appointment-title").focus();
}

// ===== VOICE DIARY ===== //
const recordButton = document.getElementById("record-button");
const stopButton = document.getElementById("stop-button");
const visualizer = document.getElementById("visualizer");
const voiceEntries = document.getElementById("voice-entries");

let mediaRecorder;
let audioChunks = [];
let audioContext;
let analyser;

loadVoiceEntries();

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    visualizeAudio();

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    recordButton.disabled = true;
    stopButton.disabled = false;
    visualizer.innerHTML = "<p>Recording...</p>";
    visualizer.classList.add("recording");
  } catch (err) {
    alert("Could not access microphone: " + err.message);
  }
}

function stopRecording() {
  mediaRecorder.stop();
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
    saveVoiceEntry(audioBlob);
    audioChunks = [];
    recordButton.disabled = false;
    stopButton.disabled = true;
    visualizer.classList.remove("recording");
  };

  if (audioContext) {
    audioContext.close();
  }
}

function visualizeAudio() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    if (!analyser) return;

    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / bufferLength;

    visualizer.innerHTML = `
      <div style="width:100%; height:100%; background:linear-gradient(90deg, 
      var(--primary) 0%, var(--secondary) ${average}%, transparent ${average}%)">
      </div>
    `;

    if (mediaRecorder.state === "recording") {
      requestAnimationFrame(draw);
    }
  }

  draw();
}

function saveVoiceEntry(blob) {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => {
    const base64data = reader.result;
    const newEntry = {
      date: new Date().toLocaleString(),
      audio: base64data,
    };

    const savedEntries = JSON.parse(localStorage.getItem("voiceEntries")) || [];
    savedEntries.push(newEntry);
    localStorage.setItem("voiceEntries", JSON.stringify(savedEntries));

    loadVoiceEntries();
  };
}

function loadVoiceEntries() {
  const savedEntries = JSON.parse(localStorage.getItem("voiceEntries")) || [];
  voiceEntries.innerHTML =
    savedEntries.length === 0
      ? '<p class="empty-state">No voice entries yet. Record your first one!</p>'
      : savedEntries
          .map(
            (entry, index) => `
        <div class="card voice-entry">
          <audio controls src="${entry.audio}"></audio>
          <div class="voice-entry-footer">
            <span>${entry.date}</span>
            <button onclick="deleteVoiceEntry(${index})" class="delete-button">×</button>
          </div>
        </div>
      `
          )
          .join("");
}

function deleteVoiceEntry(index) {
  const savedEntries = JSON.parse(localStorage.getItem("voiceEntries"));
  savedEntries.splice(index, 1);
  localStorage.setItem("voiceEntries", JSON.stringify(savedEntries));
  loadVoiceEntries();
}

// ===== TRANSITION ROADMAP ===== //
function renderRoadmap() {
  const container = document.getElementById("roadmap-items");
  container.innerHTML = "";

  const completedCount = roadmapItems.filter((item) => item.completed).length;
  const progress = Math.round((completedCount / roadmapItems.length) * 100);

  document.getElementById("progress-bar").style.width = `${progress}%`;
  document.getElementById(
    "progress-text"
  ).textContent = `${progress}% Complete`;

  roadmapItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = "roadmap-item";
    li.innerHTML = `
      <input type="checkbox" id="item-${item.id}" ${
      item.completed ? "checked" : ""
    }>
      <label for="item-${item.id}">${item.text}</label>
    `;
    li.querySelector("input").addEventListener("change", (e) => {
      item.completed = e.target.checked;
      localStorage.setItem("roadmap", JSON.stringify(roadmapItems));
      renderRoadmap();
    });
    container.appendChild(li);
  });
}

document.getElementById("add-roadmap-item").addEventListener("click", () => {
  const input = document.getElementById("new-roadmap-item");
  const text = input.value.trim();
  if (!text) return;

  const newItem = {
    id: Date.now(),
    text,
    completed: false,
  };

  roadmapItems.push(newItem);
  localStorage.setItem("roadmap", JSON.stringify(roadmapItems));
  renderRoadmap();
  input.value = "";
});

document.getElementById("clear-roadmap").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all roadmap items?")) {
    roadmapItems = [];
    localStorage.setItem("roadmap", JSON.stringify(roadmapItems));
    renderRoadmap();
  }
});

// ===== RESOURCES ===== //
const resources = [
  {
    category: "Medical",
    items: [
      {
        name: "WPATH Standards of Care",
        url: "https://www.wpath.org/publications/soc",
      },
      {
        name: "Planned Parenthood HRT Info",
        url: "https://www.plannedparenthood.org/learn/health-and-wellness/trans-and-gender-nonconforming-identities/hormone-therapy",
      },
    ],
  },
  {
    category: "Legal",
    items: [
      { name: "Name Change Guide", url: "https://www.namechangeproject.org" },
      {
        name: "Transgender Law Center",
        url: "https://transgenderlawcenter.org",
      },
    ],
  },
  {
    category: "Support",
    items: [
      { name: "The Trevor Project", url: "https://www.thetrevorproject.org" },
      { name: "Trans Lifeline", url: "https://www.translifeline.org" },
    ],
  },
];

function renderResources() {
  const container = document.getElementById("resources-container");
  container.innerHTML = resources
    .map(
      (category) => `
    <div class="resource-category">
      <h3>${category.category}</h3>
      <ul>
        ${category.items
          .map(
            (item) => `
          <li>
            <a href="${item.url}" target="_blank" rel="noopener noreferrer">
              ${item.name}
            </a>
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
  `
    )
    .join("");
}

// ===== INITIALIZATION ===== //
function initApp() {
  updateHomeSummary();
  renderRoadmap();
  renderResources();
  loadAppointments();

  // Set default date values to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dose-date").value = today;
  document.getElementById("mood-date").value = today;
  document.getElementById("appointment-date").value = today;

  // Show home tab by default
  document.querySelector('.tab-button[data-tab="home"]').click();
}

// Initialize the app when DOM is loaded
if (document.readyState !== "loading") {
  initApp();
} else {
  document.addEventListener("DOMContentLoaded", initApp);
}

// ===== UTILITY FUNCTIONS ===== //
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function renderAppointmentsOnGrid() {
  const savedAppointments =
    JSON.parse(localStorage.getItem("appointments")) || [];
  const dayColumns = document.querySelectorAll(".day-column");

  dayColumns.forEach((column) => {
    const day = column.dataset.day;
    const appointmentsForDay = savedAppointments.filter((appt) => {
      const apptDate = new Date(appt.start);
      return (
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][apptDate.getDay()] ===
        day
      );
    });

    appointmentsForDay.forEach((appt) => {
      const time = appt.time;
      const cell = column.querySelector(`.day-cell[data-time="${time}"]`);
      if (cell) {
        const appointmentElement = document.createElement("div");
        appointmentElement.className = "grid-appointment";
        appointmentElement.style.height = `${(appt.duration / 30) * 25}px`;
        appointmentElement.innerHTML = `
          <strong>${appt.title}</strong>
          <small>${appt.time}</small>
        `;
        cell.appendChild(appointmentElement);
      }
    });
  });
}

// ===== EXPORT DATA ===== //
document.getElementById("export-data").addEventListener("click", () => {
  const data = {
    roadmap: JSON.parse(localStorage.getItem("roadmap")),
    hormoneDoses: JSON.parse(localStorage.getItem("hormoneDoses")),
    journalEntries: JSON.parse(localStorage.getItem("journalEntries")),
    moods: JSON.parse(localStorage.getItem("moods")),
    appointments: JSON.parse(localStorage.getItem("appointments")),
    voiceEntries: JSON.parse(localStorage.getItem("voiceEntries")),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `trans-journey-data-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ===== IMPORT DATA ===== //
document.getElementById("import-data").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);

      if (data.roadmap)
        localStorage.setItem("roadmap", JSON.stringify(data.roadmap));
      if (data.hormoneDoses)
        localStorage.setItem("hormoneDoses", JSON.stringify(data.hormoneDoses));
      if (data.journalEntries)
        localStorage.setItem(
          "journalEntries",
          JSON.stringify(data.journalEntries)
        );
      if (data.moods) localStorage.setItem("moods", JSON.stringify(data.moods));
      if (data.appointments)
        localStorage.setItem("appointments", JSON.stringify(data.appointments));
      if (data.voiceEntries)
        localStorage.setItem("voiceEntries", JSON.stringify(data.voiceEntries));

      alert("Data imported successfully!");
      initApp(); // Refresh all views
    } catch (err) {
      alert("Error importing data: " + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = ""; // Reset file input
});

// ===== THEME TOGGLER ===== //
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem(
    "darkTheme",
    document.body.classList.contains("dark-theme")
  );
});

// Check for saved theme preference
if (localStorage.getItem("darkTheme") === "true") {
  document.body.classList.add("dark-theme");
}
