
Production Branch : main [auto deploys on Vercel]
Development Branch : develop



# 🏫 Merouni.com — Frontend

This is the frontend codebase for [Merouni](https://merouni.com/), an education discovery platform connecting students with colleges, universities, and academic resources in Nepal.

The project is built using **Next.js 15 (App Router)** with a clean, maintainable architecture. It supports authenticated routing, role-based access, and follows modern best practices for frontend development.

---

## 📦 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Language:** JavaScript (ES6+)
- **Routing:** App Router
- **Styling:** Tailwind CSS
- **Auth:** JWT + Middleware
- **State Management:** useState / Context API
- **Deployment:** Vercel or Node environment

---

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- npm ≥ 9.x
- Git

### Installation

Here's a detailed explanation of these commands, written professionally for inclusion in your `README.md`, under a **“Local Development”** or **“Getting Started”** section:

---

## 🧑‍💻 Local Development Setup

Follow these steps to run the Merouni frontend application locally using **Node.js** and **Next.js 15**:

### 1. Clone the Repository

```bash
git clone git@github.com:your-org/merouni-frontend.git
cd merouni-frontend
```

- This downloads the project from GitHub to your local machine.
- Make sure you have SSH access to the repository (i.e., your SSH key is added to GitHub).

---

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

- This creates a `.env` file from the example template.
- The `.env` file contains environment-specific variables such as API URLs and secrets.
- You should review and edit this file as needed before running the app.

> 🚨 Do **not** commit `.env` — it is git-ignored for security.

---

### 3. Install Dependencies

```bash
npm install
```

- Installs all required packages listed in `package.json`.
- Run this command anytime dependencies are added or updated.

---

### 4. Start the Development Server

```bash
npm run dev
```

- This starts the Next.js development server with hot reloading.
- By default, it runs on [http://localhost:3000](http://localhost:3000).

> ✅ You should now be able to navigate to `http://localhost:3000` and view the app locally.

[Hosted on Vercel]

..