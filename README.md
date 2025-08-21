# TutorDeck Website: Technical Architecture & Component Guide

This document provides a comprehensive technical breakdown of the TutorDeck web application. It is designed for developers and AI assistants to understand the project's structure, data flow, and component architecture.

## Table of Contents
1.  [Live Site](#live-site)
2.  [Tech Stack](#tech-stack)
3.  [Project Structure](#project-structure)
4.  [Key Architectural Decisions](#key-architectural-decisions)
5.  [Key Data Flows](#key-data-flows)
6.  [How to Update Content](#how-to-update-content)
7.  [Environment Variables & Security](#environment-variables--security)
8.  [Deployment & CI/CD Workflow](#deployment--cicd-workflow)

## Live Site

The website is automatically built and deployed to GitHub Pages.

**URL:** [https://tutordecknt.github.io/tutordeck-website/](https://tutordecknt.github.io/tutordeck-website/)

## Tech Stack

| Technology | Role | Reasoning |
| :--- | :--- | :--- |
| **React** | UI Library | Enables building a complex, interactive UI with reusable components and efficient state management. |
| **TypeScript** | Language | Adds static typing to JavaScript, preventing common bugs and improving code quality and maintainability. |
| **Vite** | Build Tool | Provides an extremely fast development experience and bundles the code into highly optimized, production-ready static files. |
| **Tailwind CSS** | CSS Framework | A utility-first framework that allows for rapid, consistent styling directly in the component files without writing custom CSS. |
| **React Router** | Routing | Manages client-side navigation between different pages (`/`, `/about`, `/dashboard`) in this single-page application (SPA). |
| **Firebase Auth**| Authentication | Provides a secure and easy-to-implement Google Sign-In service for user authentication. |
| **Papa Parse** | CSV Parser | A reliable, pure-JavaScript library to parse volunteer data from a Google Sheet. |
| **GitHub Actions** | CI/CD | Automates the entire build and deployment process, ensuring that any push to the `main` branch results in a fresh, optimized build on GitHub Pages. |
| **Gemini API** | AI Model | Powers the "AI Study Helper" page, providing chat and image analysis capabilities. |
| **Marked & KaTeX** | Content Rendering | Used in the AI Helper to parse Markdown for text formatting and render LaTeX for mathematical equations. |

## Project Structure

The codebase is organized in a standard Vite + React + TypeScript structure.
```
/
├── .github/
│   └── workflows/
│       └── deploy.yml      # Defines the automated build & deployment process.
├── public/                 # Static assets (images, favicons).
├── src/
│   ├── components/         # Reusable UI components used across multiple pages.
│   │   ├── AnimatedStat.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Reveal.tsx
│   │   └── VolunteerCarousel.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx   # Global state provider for authentication.
│   ├── hooks/
│   │   └── useClickOutside.ts# Custom hook for UI interaction (closing dropdowns).
│   ├── pages/              # Top-level components, each representing a full page.
│   │   ├── AboutPage.tsx
│   │   ├── AIHelperPage.tsx
│   │   ├── ChaptersPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── GetInvolvedPage.tsx
│   │   ├── HomePage.tsx
│   │   └── LoginPage.tsx
│   ├── App.tsx             # Main component that defines all application routes.
│   ├── firebaseConfig.ts   # Initializes and configures the Firebase connection.
│   ├── main.tsx            # The entry point of the application.
│   └── index.css           # Global styles and Tailwind directives.
├── .gitignore
├── index.html              # The HTML shell of the application.
├── package.json            # Project dependencies and scripts.
├── tailwind.config.js      # Tailwind CSS configuration.
└── tsconfig.json           # TypeScript compiler configuration.
```

## Key Architectural Decisions

1.  **Component-Based Architecture:** The UI is broken down into small, reusable components. This makes the code easier to manage, test, and update.

2.  **Centralized Authentication State:** A React Context (`src/contexts/AuthContext.tsx`) provides the user's authentication status throughout the application. This avoids prop-drilling and allows any component to easily access the current user's state.

3.  **Protected Routes:** The user dashboard is a protected route. A wrapper component (`src/components/ProtectedRoute.tsx`) checks for an active user session before rendering the page, redirecting to the login page if the user is not authenticated.

4.  **Data Decoupling:** The volunteer data is fetched from a public Google Sheet CSV. This is a powerful pattern that allows non-developers to update the data source (by adding rows to the Google Sheet) without needing to touch the codebase. The application simply re-fetches the data on the next visit.

## Key Data Flows

### Authentication Flow

1.  **User Action:** Clicks "Sign In" button on `Header` -> Navigates to `LoginPage`.
2.  **Login:** Clicks "Sign in with Google" button on `LoginPage`.
3.  **Firebase:** `AuthContext`'s `signInWithGoogle` function is called, which opens the Firebase Google sign-in popup.
4.  **State Update:** Upon successful login, Firebase's `onAuthStateChanged` listener in `AuthContext` fires. The `user` state in the context is updated with the user's information.
5.  **Re-render:** All components subscribed to `AuthContext` (like `Header` and `ProtectedRoute`) re-render. The `Header` now shows the profile picture, and the user can access the dashboard.

### Dashboard Data Flow

1.  **Navigation:** A logged-in user navigates to the `/dashboard` URL.
2.  **Guard:** `ProtectedRoute` checks `AuthContext`, sees a valid user, and allows `DashboardPage` to render.
3.  **Fetch:** `DashboardPage`'s `useEffect` hook runs. It calls `fetch()` on the Google Sheet CSV URL.
4.  **Parse:** The response text is passed to `Papa.parse()`.
5.  **Filter:** The parsed data array is filtered to keep only the rows where the "Email Address" column matches the `user.email` from `AuthContext`.
6.  **State Update:** The filtered array is stored in the `activities` state using `useState`.
7.  **Render:** The component re-renders, using the `activities` state to calculate and display the total hours and the detailed transcript table.

## How to Update Content

### To Add a New Chapter or Volunteer:
*   Edit the data arrays in `src/pages/ChaptersPage.tsx` or `src/pages/HomePage.tsx`.
*   Commit the change. The website will update automatically.

### To Add Volunteer Hours for a User:
*   Simply add a new row to the Google Sheet that is linked in `src/pages/DashboardPage.tsx`.
*   Ensure the email in the "Email Address" column matches the user's Google account email.
*   The user's dashboard will automatically reflect the new data the next time they visit.

## Environment Variables & Security

The application requires several secret keys to function, which are managed via environment variables.

**Required Variables:**
*   `VITE_GEMINI_API_KEY`: For the AI Helper page.
*   `VITE_FIREBASE_API_KEY`: Your Firebase project's API Key.
*   `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase project's Auth Domain.
*   `VITE_FIREBASE_PROJECT_ID`: Your Firebase project's ID.
*   `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase project's Storage Bucket.
*   `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase project's Messaging Sender ID.
*   `VITE_FIREBASE_APP_ID`: Your Firebase project's App ID.

These keys are **not** stored in the code. They must be stored as **Repository Secrets** in your GitHub project settings. The GitHub Actions workflow securely injects these secrets during the build process.

## Deployment & CI/CD Workflow

The site is deployed automatically to GitHub Pages via the workflow defined in `.github/workflows/deploy.yml`. This process is broken down into several key stages:

### 1. Workflow Triggers (`on`)
The deployment process is automatically triggered by two events:
*   `push: branches: [ main ]`: Any time new code is pushed to the `main` branch.
*   `workflow_dispatch`: Allows for manual triggering of the workflow from the GitHub Actions tab.

### 2. Job Configuration (`jobs`)
The workflow runs a single job called `build-and-deploy` on a virtual machine specified by `runs-on: ubuntu-latest`.

### 3. Step-by-Step Execution (`steps`)
The job executes the following steps in sequence:

*   **`name: Checkout`**
    *   **Action:** `uses: actions/checkout@v4`
    *   **Purpose:** This step securely checks out the repository's code onto the virtual machine, so the subsequent steps have access to the files.

*   **`name: Set up Node.js`**
    *   **Action:** `uses: actions/setup-node@v4`
    *   **Purpose:** Installs the specified version of Node.js (version 18) on the virtual machine, which is required to run the build commands.

*   **`name: Install dependencies`**
    *   **Action:** `run: npm install`
    *   **Purpose:** Reads the `package.json` and `package-lock.json` files and downloads all the necessary libraries and tools (React, Vite, Tailwind, etc.) required to build the project.

*   **`name: Build`**
    *   **Action:** `run: npm run build`
    *   **Purpose:** Executes the `build` script defined in `package.json` (`tsc && vite build`). This command first runs the TypeScript compiler (`tsc`) to check for type errors and then uses Vite (`vite build`) to bundle all the code into highly optimized, static HTML, CSS, and JavaScript files.
    *   **`env:` Block:** This is the critical security step. It maps the GitHub Repository Secrets (e.g., `secrets.VITE_FIREBASE_API_KEY`) to environment variables that are available *only* during the build process. Vite is configured to find variables prefixed with `VITE_` and embed them securely into the final built files.

*   **`name: Deploy`**
    *   **Action:** `uses: peaceiris/actions-gh-pages@v4`
    *   **Purpose:** This specialized action handles the deployment to GitHub Pages. It takes the output of the `Build` step (located in the `./dist` directory), commits it to a special branch named `gh-pages`, and pushes it to the repository. GitHub Pages is configured to serve the live website directly from this `gh-pages` branch.
