# Chorely  

Chorely is a web-based tool designed to help roommates fairly distribute and track household tasks. By providing a clear, centralized schedule, it reduces miscommunication and ensures that responsibilities are shared equitably. Users can customize tasks, set up rotating assignments, and adjust preferences to accommodate different schedules and needs.  

With Chorely, managing chores becomes more organized, reducing frustration, and making shared living spaces run more smoothly.

Within this application, I began with standard HTML/CSS for the the initial layout and design, and integrated React and Tailwind for more responsive design.

---

## Features  

### Header Component Overview
The Header component provides site-wide navigation and theme control for Chorely. It includes the application’s logo, a dark mode toggle, and navigation links for seamless user interaction.

#### Key Features:
- **Navigation Bar** - Displays the Chorely logo and provides quick access to the Homepage and Profile pages.
- **Dark Mode Toggle** - Allows users to switch between light and dark themes for a personalized viewing experience.
- **Responsive Design** - Ensures usability across different screen sizes with a clean, accessible layout.
This component serves as a persistent, user-friendly navigation bar, making it easy to move through the application while maintaining a visually cohesive experience.


### Sidebar Manager  
The Sidebar Manager serves as the control panel for managing household tasks and roommates. It provides an intuitive interface for adding, editing, and removing tasks or participants.  

- **Task Management** – Users can add new chores, mark them as completed, and delete tasks when necessary.  
- **Roommate List** – A dedicated section for adding and managing roommates, ensuring everyone is included in the chore rotation.  
- **Task Completion Tracking** – Users can toggle task completion status to keep track of responsibilities.  
- **Calendar Toggle** – A quick-access button to view the Calendar View, allowing users to see upcoming schedules.  


### Schedule Viewer  
The Schedule Viewer provides a dynamic, week-by-week breakdown of assigned chores, ensuring every roommate knows their responsibilities. Tasks are fairly rotated among participants, adjusting to changes in group size and task preferences.  

- **Weekly Task Display** – Shows the current week's chore assignments, with each roommate’s name and their designated tasks.  
- **Task Rotation Algorithm** – Automatically distributes chores based on the week, ensuring fairness over time.  
- **Navigation Controls** – Users can navigate between past and future weeks to review or plan upcoming assignments.  
- **Customization & Preferences** – Adjustments can be made to exclude certain roommates from specific tasks.  
- **Dark Mode Support** – Adapts styling based on user preferences for a more comfortable viewing experience.


### Profile Page Overview
The Profile Page provides a structured layout for displaying user information. Currently, it features placeholder content, including a default profile picture and sample user details. The design ensures a clean and organized presentation, with responsive styling for a seamless experience across different screen sizes.

Moving forward, the vision for this page includes expanded customization options, allowing users to edit their profile details, upload a custom profile picture, and personalize their information. Future enhancements may also include additional fields, preferences, and integrations to make the profile experience more dynamic and user-driven.

### Currently version follows the initial MVP format, more features coming soon.

---

## How to Run  

### 1. Clone the Repository  
Open your terminal and run:  
```bash
git clone https://github.com/yourusername/chorely.git
cd chorely
```

### 2. Install Dependencies
Run the following command to install required packages:
```
npm install
```

### 3. Install React Router
Since Chorely uses React Router for navigation, install it with:
```
npm install react-router
```

### 4. Start the Development Server
Run the following command to start the application:
```
npm run dev
```
