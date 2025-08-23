# TutorDeck Website: Technical Architecture & Component Guide

This document provides a comprehensive technical breakdown of the TutorDeck web application and its associated backend services. It is designed for developers and AI assistants to understand the project's structure, data flow, and architecture.

## Table of Contents
1.  [Live Site](#live-site)
2.  [High-Level Architecture](#high-level-architecture)
3.  [Tech Stack](#tech-stack)
4.  [Project Structure](#project-structure)
5.  [Key Data Flows](#key-data-flows)
6.  [How to Update Content](#how-to-update-content)
7.  [Environment Variables & Security](#environment-variables--security)
8.  [Deployment & CI/CD Workflow](#deployment--cicd-workflow)

## Live Site

The frontend website is automatically built and deployed to GitHub Pages.

**URL:** [https://tutordecknt.github.io/tutordeck-website/](https://tutordecknt.github.io/tutordeck-website/)

## High-Level Architecture

TutorDeck operates on a modern, decoupled architecture consisting of two main parts:

1.  **Frontend (This Repository):** A static Single-Page Application (SPA) built with React and Vite. It is responsible for all user interface elements and interactions. It is hosted for free on **GitHub Pages**.
2.  **Backend (Separate Repository):** A lightweight Node.js API server. It is responsible for all secure logic, such as generating official documents and sending emails. It is hosted for free on **Render**.

This separation ensures security (no secret keys are ever exposed to the user's browser) and scalability.

## Tech Stack

### Frontend (tutordeck-website)

| Technology | Role | Reasoning |
| :--- | :--- | :--- |
| **React** | UI Library | Enables building a complex, interactive UI with reusable components and efficient state management. |
| **TypeScript** | Language | Adds static typing to JavaScript, preventing common bugs and improving code quality. |
| **Vite** | Build Tool | Provides an extremely fast development experience and bundles the code into highly optimized static files for production. |
| **Tailwind CSS** | CSS Framework | A utility-first framework that allows for rapid, consistent styling directly within component files. |
| **React Router** | Routing | Manages client-side navigation between pages (`/`, `/about`, `/dashboard`) in the SPA using `HashRouter` for GitHub Pages compatibility. |
| **Firebase Auth**| Authentication | Provides a secure and easy-to-implement Google Sign-In service for user authentication on the client side. |
| **Papa Parse** | CSV Parser | A reliable, pure-JavaScript library to parse volunteer data from a public Google Sheet for display on the dashboard. |
| **GitHub Actions** | CI/CD | Automates the build and deployment process to GitHub Pages. |

### Backend (tutordeck-backend)

| Technology | Role | Reasoning |
| :--- | :--- | :--- |
| **Node.js** | Runtime | A fast and efficient JavaScript runtime for building the server-side API. |
| **Express.js** | API Framework | A minimal and flexible framework for defining the API endpoints (`/generate-transcript`, `/verify`). |
| **Firebase Admin SDK** | Backend Auth | Allows the server to securely verify user identity and interact with Firestore on behalf of the user. |
| **Cloud Firestore** | Database | A NoSQL database used to store metadata ("receipts") for each generated transcript, enabling public verification. |
| **PDFKit** | PDF Generation | A mature and reliable pure-JavaScript library for creating complex PDF documents on the server. |
| **Resend** | Email Service | A transactional email API used to send the generated PDF transcripts directly to users. |
| **Render** | Hosting | A cloud platform that provides a free tier for hosting the Node.js web service. |

## Project Structure

This repository (`tutordeck-website`) contains the frontend application.

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml      # Defines the automated build & deployment process.
├── public/                 # Static assets (images, favicons).
├── src/
│   ├── components/         # Reusable UI components (Header, Footer, Modals, etc.).
│   ├── contexts/
│   │   └── AuthContext.tsx   # Global state provider for authentication.
│   ├── hooks/
│   │   └── useClickOutside.ts# Custom hook for UI interaction.
│   ├── pages/              # Top-level components, each representing a full page.
│   │   ├── DashboardPage.tsx # User's private dashboard.
│   │   ├── VerificationPage.tsx# Public page to verify a transcript's authenticity.
│   │   └── ... (other pages)
│   ├── App.tsx             # Main component that defines all application routes.
│   ├── firebaseConfig.ts   # Initializes the client-side Firebase connection.
│   ├── main.tsx            # The entry point of the application.
│   └── index.css           # Global styles and Tailwind directives.
├── .gitignore
├── index.html              # The HTML shell of the application.
├── package.json            # Frontend dependencies and scripts.
└── ... (config files)
```

## Key Data Flows

### Authentication Flow (Unchanged)

1.  **User Action:** Clicks "Sign In" -> Navigates to `LoginPage`.
2.  **Firebase:** `AuthContext`'s `signInWithGoogle` function is called, opening the Google sign-in popup.
3.  **State Update:** Upon success, Firebase's `onAuthStateChanged` listener in `AuthContext` updates the global `user` state.
4.  **Re-render:** Components like `Header` and `ProtectedRoute` re-render to reflect the logged-in state.

### Verifiable Transcript Generation Flow (New)

1.  **User Action:** A logged-in user on `DashboardPage` clicks "Generate & Email Transcript" and enters a destination email in the `EmailModal`.
2.  **Frontend Request:** The frontend gets the user's Firebase Auth ID Token (a temporary password) and sends it along with the destination email to the backend server's `/generate-transcript` endpoint.
3.  **Backend Verification:** The backend server receives the request. It uses the Firebase Admin SDK to verify the ID Token, confirming the user's identity securely.
4.  **Backend Logic:**
    *   Checks Firestore to ensure the user hasn't generated a transcript in the last 24 hours.
    *   Fetches the user's volunteer data from the public Google Sheet CSV.
    *   Generates a unique ID for the new transcript.
    *   Creates a "receipt" of the transcript (containing user info, date, and all volunteer activities) and saves it to the **Cloud Firestore** `transcripts` collection.
    *   Uses **PDFKit** to generate a PDF document in memory from this data. The PDF includes a QR code that links to the public verification URL (`.../#/verify/{uniqueId}`).
5.  **Email Delivery:** The server uses the **Resend** API to send an email to the user's chosen address, with the newly generated PDF attached directly.
6.  **Frontend Response:** The server sends a success message back to the frontend, which is displayed to the user.

### Public Verification Flow (New)

1.  **User Action:** A third party (e.g., a college admissions officer) scans the QR code in the PDF or clicks a link, navigating to `.../#/verify/{transcriptId}`.
2.  **Frontend Request:** The `VerificationPage` component loads, extracts the `transcriptId` from the URL, and sends a request to the backend server's `/verify/{transcriptId}` endpoint.
3.  **Backend Logic:** The server queries Firestore for a document with the matching `uniqueId`.
4.  **Backend Response:**
    *   If found, it returns the transcript's metadata (Volunteer Name, Date Issued).
    *   If not found, it returns a 404 error.
5.  **Frontend Display:** The `VerificationPage` displays a "Verified" or "Failed" message. If verified, it also presents a "Download Official Document" button, which links to the backend's `/download-transcript/{transcriptId}` endpoint, allowing the third party to download a freshly generated, identical copy of the official document.

## How to Update Content

### To Add a New Chapter or Volunteer Award:
*   Edit the data arrays directly in the relevant component files (e.g., `src/pages/ChaptersPage.tsx`).
*   Commit the change. The website will update automatically.

### To Add Volunteer Hours for a User:
*   **No code changes are needed.**
*   Simply add a new row to the public **Google Sheet**.
*   Ensure the email in the "Email Address" column exactly matches the user's Google account email.
*   The user's dashboard and any future transcripts will automatically include the new data.

## Environment Variables & Security

This project uses two sets of environment variables for its two parts.

### Frontend Secrets (`tutordeck-website` Repository)

These keys are stored as **Repository Secrets** in the `tutordeck-website` GitHub repository settings.

*   `VITE_FIREBASE_API_KEY`: Your Firebase project's public API Key.
*   `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase project's Auth Domain.
*   `VITE_FIREBASE_PROJECT_ID`: Your Firebase project's ID.
*   `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase project's Storage Bucket.
*   `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase project's Messaging Sender ID.
*   `VITE_FIREBASE_APP_ID`: Your Firebase project's App ID.
*   `VITE_RENDER_API_URL`: The public URL of your deployed backend service on Render.

### Backend Secrets (`tutordeck-backend` on Render)

These keys are stored as **Environment Variables** in the Render service settings. **They are never stored in code.**

*   `GOOGLE_APPLICATION_CREDENTIALS_BASE64`: The Base64-encoded version of your Firebase service account's private key JSON file.
*   `RESEND_API_KEY`: Your secret API key from your Resend account.

## Deployment & CI/CD Workflow

The frontend is deployed automatically to GitHub Pages via the workflow defined in `.github/workflows/deploy.yml`.

*   **Trigger:** The workflow runs on any push to the `main` branch.
*   **Process:**
    1.  **Checkout:** Checks out the repository code.
    2.  **Setup Node.js:** Prepares the build environment.
    3.  **Install Dependencies:** Runs `npm install`.
    4.  **Build:** Runs `npm run build`. During this step, the GitHub Actions workflow securely injects the `VITE_` secrets into the build process.
    5.  **Deploy:** Uses a specialized action to push the final static files from the `dist/` folder to the `gh-pages` branch, making the site live.
