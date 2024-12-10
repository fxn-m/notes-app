# Youni Notes App 📒

[Link to live application](https://fxn-m.com/notes-app)

In order to sign in, your google account will have to be added to the test users config.
Please [let me know](mailto:fnewportmangell@gmail.com) if you're unable to authenticate with your google account and I'll add you.

*Note: Due to cold starts, please wait a minute the first time you load the app!*

## Intro

This Notes App is a full-stack application that allows users to create and manage notebooks filled with sticky notes. It provides a user-friendly interface with draggable notes, responsive layout, and the ability to create and open notebooks, each containing multiple notes.

**Features**
- Create New Notebooks: Add multiple notebooks to organize your notes by topic or category.
- Sticky Notes: Each notebook supports multiple sticky notes that can be created and moved around.
- Responsive Layout: The UI adapts to various screen sizes, from mobile to desktop.
- PWA: [VitePWA](https://vite-pwa-org.netlify.app/) was used to turn Notes App into a PWA.
- Authentication with Google OAuth

**Technology Stack**
- Frontend: React + TypeScript, Tailwind CSS for styling, Vite for bundling.
- Backend: Node.js/Express + TypeScript with DrizzleORM providing APIs to fetch, create, and manage notebooks and notes.
  - Server hosted on Render. 
  - Database hosted on Supabase.

## Getting Started
### 1.	Clone the Repository:

```bash
git clone https://github.com/fxn-m/notes-app
cd notes-app
```

### 2.	Install Dependencies:

```bash
npm install
```

### 3.	Set Environment Variables (Optional):
**If runing the server locally**, create a .env file in the root directory and specify the server URL :

```bash
VITE_SERVER_URL=http://localhost:3000
```

### 4.	Run the Backend (Optional):

```bash
cd notes-app-server
npm install
npm run dev
```

Make sure it runs on the same URL and port you specified in VITE_SERVER_URL.

### 5.	Run the Frontend:

#### Running development server
```bash
cd notes-app
npm run dev
```

This will start the development server at http://localhost:5173.

#### Running production
```bash
cd notes-app
npm run preview
```