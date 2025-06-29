// DOM Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const tasksLeft = document.getElementById("tasksLeft");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");

// State
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Theme toggle functionality
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i");
  icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

// Calendar functionality
const calendarToggle = document.getElementById("calendarToggle");
const calendarDropdown = document.getElementById("calendarDropdown");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const currentMonthEl = document.getElementById("currentMonth");
const calendarDays = document.getElementById("calendarDays");
const notificationBadge = document.getElementById("notificationBadge");

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate = null;

// Check for notifications every minute
setInterval(checkNotifications, 60000);

// Toggle calendar dropdown
calendarToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  calendarDropdown.classList.toggle("active");
  if (calendarDropdown.classList.contains("active")) {
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    renderCalendar();
  } else {
    // Don't reset selectedDate when closing calendar
    renderTasks();
  }
});

// Close calendar when clicking outside
document.addEventListener("click", (e) => {
  if (
    !calendarToggle.contains(e.target) &&
    !calendarDropdown.contains(e.target)
  ) {
    calendarDropdown.classList.remove("active");
    // Don't reset selectedDate when clicking outside
    removeTaskListHeader();
    renderTasks();
  }
});

// Navigation buttons
prevMonthBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

nextMonthBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

// Render calendar
function renderCalendar() {
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startingDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  currentMonthEl.textContent = `${firstDay.toLocaleString("default", {
    month: "long",
  })} ${currentYear}`;

  calendarDays.innerHTML = "";

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "day empty";
    calendarDays.appendChild(emptyDay);
  }

  // Add days of the month
  for (let day = 1; day <= totalDays; day++) {
    const dayElement = document.createElement("div");
    dayElement.className = "day";
    dayElement.textContent = day;

    const date = new Date(currentYear, currentMonth, day);
    const dateString = getLocalDateString(date);

    // Check if it's today
    if (isToday(date)) {
      dayElement.classList.add("today");
    }

    // Check if it's selected date
    if (selectedDate && isSameDay(date, selectedDate)) {
      dayElement.classList.add("selected");
    }

    // Get all tasks for this date
    const dayTasks = tasks.filter((task) => task.date === dateString);

    if (dayTasks.length > 0) {
      dayElement.classList.add("has-tasks");
      const taskCount = document.createElement("span");
      taskCount.className = "task-count";
      taskCount.textContent = dayTasks.length;
      dayElement.appendChild(taskCount);
    }

    // Add click event listener
    dayElement.addEventListener("click", (e) => {
      e.stopPropagation();
      handleDateClick(date, dayElement);
    });

    calendarDays.appendChild(dayElement);
  }

  // Only update notification badge for selected date or today
  if (selectedDate) {
    updateNotificationBadge(selectedDate);
  } else {
    updateNotificationBadge(new Date());
  }
}

// Handle date click
function handleDateClick(date, dayElement) {
  selectedDate = date;
  document
    .querySelectorAll(".day")
    .forEach((day) => day.classList.remove("selected"));
  dayElement.classList.add("selected");

  showTaskInputForDate(date);
  filterTasksByDate(date);
  updateNotificationBadge(date);
}

// Show task input for selected date
function showTaskInputForDate(date) {
  const dateString = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Update task input placeholder with a more descriptive message
  taskInput.placeholder = `Add task for ${dateString}...`;

  // Focus the input
  taskInput.focus();
}

// Get tasks for a specific date
function getTasksForDate(date) {
  const dateString = getLocalDateString(date);
  return tasks.filter((task) => task.date === dateString);
}

// Check if two dates are the same day
function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

// Check if a date is today
function isToday(date) {
  const today = new Date();
  return isSameDay(date, today);
}

// Filter tasks by date
function filterTasksByDate(date) {
  const dateString = getLocalDateString(date);

  // Update task list header
  const taskListHeader = document.createElement("div");
  taskListHeader.className = "task-list-header";
  taskListHeader.innerHTML = `
    <h3>Tasks for ${dateString}</h3>
    <span class="task-count">${getTasksForDate(date).length} tasks</span>
  `;

  // Replace existing header if any
  const existingHeader = document.querySelector(".task-list-header");
  if (existingHeader) {
    existingHeader.remove();
  }
  taskList.insertBefore(taskListHeader, taskList.firstChild);

  // Filter and render tasks
  const filteredTasks = getTasksForDate(date);
  renderTasks(filteredTasks);
}

// Update notification badge
function updateNotificationBadge(date) {
  const notificationBadge = document.getElementById("notificationBadge");
  if (!date) {
    notificationBadge.style.display = "none";
    return;
  }
  const tasksForDate = getTasksForDate(date);
  if (tasksForDate.length > 0) {
    notificationBadge.textContent = tasksForDate.length;
    notificationBadge.style.display = "block";
  } else {
    notificationBadge.style.display = "none";
  }
}

// Add task with date
function addTask() {
  const taskText = taskInput.value.trim();

  if (!taskText) return;

  if (!selectedDate) {
    // Show a message to select a date first
    const taskInputContainer = document.querySelector(".todo-input");
    const dateIndicator = document.createElement("div");
    dateIndicator.className = "date-indicator error";
    dateIndicator.textContent = "Please select a date from the calendar first";

    // Remove any existing date indicator
    const existingIndicator = document.querySelector(".date-indicator");
    if (existingIndicator) {
      existingIndicator.remove();
    }

    taskInputContainer.insertBefore(dateIndicator, taskInput);

    // Remove the error message after 3 seconds
    setTimeout(() => {
      dateIndicator.remove();
    }, 3000);

    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    date: getLocalDateString(selectedDate),
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  updateTasksLeft();

  // Update notification badge for the selected date
  updateNotificationBadge(selectedDate);

  taskInput.value = "";

  if (calendarDropdown.classList.contains("active")) {
    renderCalendar();
  }
}

// Check for notifications
function checkNotifications() {
  const today = new Date();
  const todayString = getLocalDateString(today);

  const todayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.date);
    return getLocalDateString(taskDate) === todayString;
  });

  if (todayTasks.length > 0) {
    showNotification(todayTasks.length);
  }
}

// Show notification
function showNotification(taskCount) {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification("Tasks Due Today", {
        body: `You have ${taskCount} task${
          taskCount > 1 ? "s" : ""
        } due today!`,
        icon: "path/to/icon.png", // Add your icon path here
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          showNotification(taskCount);
        }
      });
    }
  }
}

// Request notification permission on page load
document.addEventListener("DOMContentLoaded", () => {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
});

// Initialize the app
function init() {
  renderTasks();
  updateTasksLeft();
  addEventListeners();
}

// Add event listeners
function addEventListeners() {
  // Add task
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  // Clear completed tasks
  clearCompletedBtn.addEventListener("click", clearCompleted);

  // Filter tasks
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.dataset.filter;
      renderTasks();
    });
  });
}

// Render tasks based on current filter
function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = `task-item ${task.completed ? "completed" : ""}`;
    taskItem.dataset.id = task.id;

    taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${
              task.completed ? "checked" : ""
            }>
            <span class="task-text">${task.text}</span>
            <input type="text" class="edit-input" value="${task.text}">
            <div class="task-actions">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;

    // Add event listeners for task actions
    const checkbox = taskItem.querySelector(".task-checkbox");
    const editBtn = taskItem.querySelector(".edit-btn");
    const deleteBtn = taskItem.querySelector(".delete-btn");
    const editInput = taskItem.querySelector(".edit-input");
    const taskText = taskItem.querySelector(".task-text");

    checkbox.addEventListener("change", () => toggleTask(task.id));
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    editBtn.addEventListener("click", () => {
      taskItem.classList.add("editing");
      editInput.focus();
    });

    editInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const newText = editInput.value.trim();
        if (newText) {
          editTask(task.id, newText);
          taskItem.classList.remove("editing");
        }
      }
    });

    editInput.addEventListener("blur", () => {
      const newText = editInput.value.trim();
      if (newText) {
        editTask(task.id, newText);
      }
      taskItem.classList.remove("editing");
    });

    taskList.appendChild(taskItem);
  });
}

// Toggle task completion
function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
  updateTasksLeft();
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
  updateTasksLeft();
}

// Edit a task
function editTask(id, newText) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, text: newText };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

// Clear completed tasks
function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

// Update tasks left counter
function updateTasksLeft() {
  const activeTasks = tasks.filter((task) => !task.completed).length;
  tasksLeft.textContent = `${activeTasks} task${
    activeTasks !== 1 ? "s" : ""
  } left`;
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initialize the app
init();

// Initialize calendar
renderCalendar();

// Add helper function to remove task list header
function removeTaskListHeader() {
  const existingHeader = document.querySelector(".task-list-header");
  if (existingHeader) existingHeader.remove();
}

function getLocalDateString(date) {
  // Returns YYYY-MM-DD in local time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
