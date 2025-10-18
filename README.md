Dynamic Data Table Manager (Next.js, Redux, MUI)
This project is the completed solution for the Frontend Interview Task, demonstrating proficiency in building dynamic user interfaces, managing complex state, and integrating modern features like importing, exporting, and inline editing.

🚀 Key Features Implemented
The application fully satisfies all core requirements and includes the optional bonus features:


Core Functionality: Implements sorting (ASC/DESC), global search, and client-side pagination (10 rows per page).


Dynamic Columns: Users can show/hide existing columns and add new custom fields directly within the "Manage Columns" modal. Column visibility settings are persisted using Redux Persist/localStorage.


Data I/O: Features functional Import CSV (parsed via PapaParse) and Export CSV (includes only visible columns).

Bonus Features:


Inline Editing: Double-click any field to edit its value directly, with input validation (e.g., age must be a number).


Row Actions: Dedicated buttons for Edit and Delete (with confirmation).


Theming: Theme toggle for Light/Dark mode using MUI theming.


Responsiveness: Fully responsive design ensures proper display and horizontal scrolling on smaller screens.
