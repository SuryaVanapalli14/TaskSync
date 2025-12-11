# TaskSync

TaskSync is a modern, full-stack application that serves as a marketplace to connect users who need tasks completed with skilled helpers ready to take on jobs. It features AI-powered price suggestions, a user-friendly interface, and a robust backend built on Firebase.

## ✨ Features

- **Vibrant Marketplace**: Users can post tasks they need help with or browse and apply for existing tasks.
- **AI-Powered Pricing**: Utilizes Genkit to provide intelligent price suggestions for tasks based on description, location, and time.
- **User Authentication**: Secure login and registration functionality using Firebase Authentication.
- **Task Management**: Create, view, and manage tasks seamlessly.
- **Analytics Dashboard**: A comprehensive dashboard for users to track their earnings, completed tasks, and ratings.
- **Responsive Design**: A beautiful and consistent UI across all devices, built with ShadCN UI and Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI/Generative**: [Genkit](https://firebase.google.com/docs/genkit)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (or another package manager like yarn or pnpm)

### Installation

1. **Clone the repository:**
   If you have git installed, you can clone the project repository. If not, you can download the source code.
   ```bash
   git clone <your-repository-url>
   cd <project-directory>
   ```

2. **Install dependencies:**
   This will install all the necessary packages for the project to run.
   ```bash
   npm install
   ```

### Firebase Configuration

This project uses Firebase for its backend services. You'll need to create a Firebase project and set up a web app to get your configuration keys.

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (or use an existing one).
3. In your project, create a new Web App.
4. Firebase will provide you with a `firebaseConfig` object. Copy the keys from this object.
5. Create a new file named `.env.local` in the root of your project.
6. Add your Firebase keys to the `.env.local` file, making sure to prefix them with `NEXT_PUBLIC_`:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"
   ```

### Running the Development Server

Once the dependencies are installed and your Firebase configuration is set up, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result. You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.
