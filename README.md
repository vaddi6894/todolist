# Todo List App with Calendar Integration

A modern, interactive todo list application with calendar integration, dark/light mode toggle, and date-based task management.

## Features

### �� Core Functionality
- **Task Management**: Add, edit, delete, and mark tasks as complete
- **Date-based Tasks**: Assign tasks to specific dates using the integrated calendar
- **Task Filtering**: Filter tasks by All, Active, or Completed status
- **Persistent Storage**: Tasks are saved locally using localStorage

### 📅 Calendar Integration
- **Interactive Calendar**: Click any date to select it for task management
- **Visual Indicators**: 
  - Today's date is highlighted with a pulsing border and dot indicator
  - Selected date is highlighted with a solid background and glow effect
  - Dates with tasks show a notification badge with task count
- **Date Selection**: Tasks are only added to the selected date
- **Month Navigation**: Navigate between months with arrow buttons

### 🎨 User Interface
- **Floating Design**: Glass-morphism effect with backdrop blur
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Floating container with 3D effects and smooth transitions
- **Modern Styling**: Clean, minimalist design with hover effects

### �� Notifications
- **Browser Notifications**: Get notified about tasks due today
- **Visual Badges**: Calendar icon shows notification count for selected date
- **Task Count Indicators**: See how many tasks are scheduled for each date

## How to Use

### Adding Tasks
1. Open the calendar by clicking the calendar icon
2. Click on any date to select it
3. Type your task in the input field
4. Press Enter or click the add button
5. The task will be saved for the selected date

### Managing Tasks
- **Complete Tasks**: Check the checkbox next to any task
- **Edit Tasks**: Click the edit icon to modify task text
- **Delete Tasks**: Click the trash icon to remove tasks
- **Filter Tasks**: Use the filter buttons to view All, Active, or Completed tasks
- **Clear Completed**: Remove all completed tasks at once

### Calendar Features
- **View Tasks**: Click any date to see tasks for that specific date
- **Task Indicators**: Dates with tasks show a numbered badge
- **Today's Date**: Always highlighted with a special border and animation
- **Date Selection**: Selected date is clearly marked for task management

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)**: Vanilla JavaScript with modern features
- **Font Awesome**: Icons for better user experience

### Key Features
- **Local Storage**: Persistent data storage
- **CSS Variables**: Dynamic theming system
- **Event Delegation**: Efficient event handling
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Keyboard navigation and screen reader support

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Installation

1. Clone or download the repository
2. Open `index.html` in your web browser
3. Start managing your tasks!

## File Structure
```
todolist/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Customization

### Adding Custom Themes
Modify the CSS variables in `styles.css`:
```css
:root {
  --primary-color: #your-color;
  --bg-color: #your-background;
  /* ... other variables */
}
```

### Modifying Animations
Adjust the floating and pulse animations in the CSS file to match your preferences.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this project.

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Enjoy organizing your tasks with this modern, feature-rich todo list application!** 🚀
