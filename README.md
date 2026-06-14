# Idea Hub (Ideahub) Frontend

Ideahub (also referenced internally as IdeaNexus) is a modern, collaborative web application that allows users to create, share, edit, and explore business and technical ideas. This repository contains the React + TypeScript frontend codebase, styled dynamically with Ant Design and custom Sass stylesheets, and compiled using Vite.

---

## Key Features

- **💡 Idea Sharing & Management**: Users can create, update, delete, and view comprehensive details of business and technical ideas.
- **🔍 Advanced Search & Tag Filtering**: Real-time searching and filtering of ideas based on user-defined tags and target business departments/verticals.
- **🛡️ Protected Client-Side Routing**: Route guard logic (`ProtectedRoute`) verifying authentication tokens in `localStorage` to restrict access to authenticated views.
- **👑 Administrative Dashboard**: Specialized `/admin` panel enabling administrators to manage user accounts, toggle moderator status, and delete profiles.
- **📊 Dynamic Micro-Animations**: Page view improvements including counts that animate on load (`react-countup`/`countup.js`).
- **📱 Fully Responsive Design**: Built on Ant Design's grid system (`Row`, `Col`) and customized SASS styles to ensure seamless experience across desktop, tablet, and mobile screens.
- **🌐 REST API Integration**: Clean abstraction for backend requests (`axios` interceptor) that automatically propagates authorization headers.

---

## Repository Structure

```text
idea-hub-frontend/
├── public/                       # Static public assets
│   ├── Idea-nexus.png            # Main logo used in Navbar
│   ├── login.jpg                 # Background banner for login page
│   └── vite.svg                  # Vite framework logo
├── src/                          # Application source code
│   ├── assets/                   # Compiled assets
│   │   └── react.svg
│   ├── components/               # Reusable UI components
│   │   ├── CountUpOnLoad.tsx     # Stat counters with loading animations
│   │   ├── navBar.tsx            # Navigation bar (includes logo, search, and action buttons)
│   │   ├── navbar.scss           # SASS styling for Navbar component
│   │   ├── PostCard.tsx          # Card displaying summary of an individual idea
│   │   ├── PostCard.scss         # SASS styling for PostCard component
│   │   ├── PostDetailPopup.tsx   # Detailed modal dialog showing full post info
│   │   ├── PostDetailPopup.scss  # SASS styling for PostDetailPopup component
│   │   ├── PostFilter.tsx        # Filter sidebar panel for tag and business category filters
│   │   ├── PostFilter.scss       # SASS styling for PostFilter component
│   │   └── ProtectedRoute.tsx    # Higher-order component enforcing authentication
│   ├── pages/                    # Router view components
│   │   ├── Admin.tsx             # User management dashboard (Admin only)
│   │   ├── createPost.tsx        # Form page to publish new ideas
│   │   ├── EditPost.tsx          # Form page to update existing ideas
│   │   ├── EditProfile.tsx       # User profile details editor
│   │   ├── home.tsx              # Main dashboard displaying all idea posts
│   │   ├── login.tsx             # Sign in form
│   │   ├── signup.tsx            # Register form
│   │   ├── page404.tsx           # Page not found error display
│   │   └── auth.scss             # SASS styles shared across authentication views
│   ├── types/                    # TypeScript type declarations
│   │   └── Post.ts               # Shape of Post/Idea data structures
│   ├── utils/                    # Utility scripts
│   │   ├── postActions.ts        # Operations like search matching
│   │   └── utils.ts              # Common date formatting and localStorage helpers
│   ├── api.js                    # Axios instance with interceptor to attach JWT token
│   ├── App.tsx                   # Core App element mapping pages to paths via React Router
│   ├── index.scss                # Global styles
│   └── main.tsx                  # React entrypoint attaching app to HTML root
├── .gitignore                    # Version control exclusions
├── .netlify.toml                 # Netlify deployment rules (redirects all paths to index.html)
├── eslint.config.js              # ESLint rules and settings
├── index.html                    # Single Page Application HTML shell
├── package.json                  # Dependencies, devDependencies, and run scripts
├── package-lock.json             # Locked dependency tree
└── vite.config.js                # Vite build and server settings
```

---

## Prerequisites

To run this application, make sure you have the following installed:

- **Node.js**: `v18.0.0` or higher (Vite 5 recommends `v18+` or `v20+`)
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/soniakshat/idea-hub-frontend.git
   cd idea-hub-frontend
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory if you wish to configure local development options. By default, the application is configured to request data from the live API at `https://api.techqubits.com`. 
   
   *(See the Next Steps section on how to parameterize the API URL using Vite environment variables).*

---

## How to Run

### Development Mode
Runs the local dev server on port `3205` with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to [http://localhost:3205](http://localhost:3205).

### Production Build
1. Build the production application (outputs optimized files into the `dist/` directory):
   ```bash
   npm run build
   ```

2. Preview the production build locally (spins up a server pointing to the built bundle):
   ```bash
   npm run preview
   ```

---

## Running Tests

There are currently no unit or integration tests configured in this workspace. 

To introduce testing to the workspace (e.g., using **Vitest** for unit/integration tests and **Playwright** or **Cypress** for end-to-end user flows), refer to the recommendations in the **Next Steps** section below.
