# TutorDeck Website & AI Study Helper

This repository contains the full source code for the official TutorDeck website and the integrated "AI Study Helper" application. The project is built using a modern, professional tech stack designed for performance, scalability, and maintainability.

This document explains the project structure, the technologies used, and the reasoning behind the architectural decisions, enabling developers (and AI assistants) to understand and contribute to the project effectively.

## Table of Contents
1.  [Live Site](#live-site)
2.  [Tech Stack](#tech-stack)
3.  [Project Structure](#project-structure)
4.  [Key Architectural Decisions](#key-architectural-decisions)
5.  [How to Update Content](#how-to-update-content)
6.  [Deployment](#deployment)

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
| **React Router** | Routing | Manages client-side navigation between different pages (`/`, `/about`, `/ai-helper`) in this single-page application (SPA). |
| **GitHub Actions** | CI/CD | Automates the entire build and deployment process, ensuring that any push to the `main` branch results in a fresh, optimized build on GitHub Pages. |
| **Gemini API** | AI Model | Powers the "AI Study Helper" page, providing chat and image analysis capabilities. |
| **Marked & KaTeX** | Content Rendering | Used in the AI Helper to parse Markdown for text formatting and render LaTeX for mathematical equations. |

## Project Structure

The repository is organized as a standard Vite + React project.

```
tutordeck-website/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Action: Automates build & deployment to GitHub Pages.
├── public/
│   └── mascot.avif         # Static assets (images, favicons) that are copied directly to the build output.
├── src/
│   ├── components/         # Reusable React components (Header, Footer, etc.).
│   │   ├── Header.tsx
│   │   └── ...
│   ├── pages/              # Top-level components, each representing a full page.
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   └── ...
│   ├── App.tsx             # Main application component, handles routing.
│   ├── main.tsx            # The entry point of the React application.
│   ├── index.css           # Global styles and Tailwind CSS directives.
│   └── vite-env.d.ts       # TypeScript definitions for Vite's environment variables.
├── .gitignore              # Specifies files for Git to ignore (e.g., node_modules).
├── index.html              # The main HTML shell for the application.
├── package.json            # Defines project dependencies and scripts.
├── tailwind.config.js      # Configuration file for Tailwind CSS.
└── tsconfig.json           # Configuration file for the TypeScript compiler.
```

## Key Architectural Decisions

1.  **Component-Based Architecture:** The UI is broken down into small, reusable components (`src/components/`). This makes the code easier to manage, test, and update. For example, the `Header.tsx` and `Footer.tsx` components are used on every page, ensuring consistency.

2.  **Separation of Data and Presentation:** For content that changes frequently (like the list of chapters or volunteers), the data is stored in a simple array at the top of the relevant page component (e.g., `chapterData` in `ChaptersPage.tsx`). The component then maps over this array to render the UI. This allows non-developers to easily update content without touching complex JSX code.

3.  **Automated CI/CD with GitHub Actions:** The project uses a Git-based workflow. All development happens on the `main` branch. The `.github/workflows/deploy.yml` file defines a process that automatically:
    *   Installs dependencies (`npm install`).
    *   Builds the optimized, production-ready static files (`npm run build`).
    *   Pushes the built files to a separate `gh-pages` branch.
    This ensures the live site is always a reflection of the latest stable code, with no manual deployment steps required.

4.  **Performance Optimization:**
    *   **Code Splitting:** Vite automatically splits the code for each page. Users only download the JavaScript needed for the page they are currently viewing.
    *   **CSS Purging:** Tailwind CSS is configured to scan all `.tsx` files and generate a CSS file containing *only* the utility classes that are actually used, resulting in a very small file size.
    *   **CDN for KaTeX:** To keep the main application bundle small, the KaTeX library (for math rendering) is loaded from a fast, external CDN instead of being bundled with the project's JavaScript. This is defined in `index.html`.

5.  **API Key Security:** The Google Gemini API key is **not** stored in the code. It is stored as a **Repository Secret** in GitHub (`VITE_GEMINI_API_KEY`). The GitHub Actions workflow securely injects this secret as an environment variable during the build process, making it available to the application without exposing it publicly.

## How to Update Content

### To Add a New Chapter:
1.  Edit the file `src/pages/ChaptersPage.tsx`.
2.  Add a new object to the `chapterData` array at the top of the file.
3.  Commit the change. The website will update automatically.

### To Add a New Volunteer to the Carousel:
1.  Edit the file `src/pages/HomePage.tsx`.
2.  Add a new object to the `volunteerData` array at the top of the file.
3.  Commit the change. The website will update automatically.

## Deployment

The site is deployed automatically to GitHub Pages. Any commit pushed to the `main` branch will trigger the deployment workflow defined in `.github/workflows/deploy.yml`. The live site is served from the `gh-pages` branch.
