# [What Do You Mean By?](https://what-do-you-mean-by-wxfz.vercel.app/)
<a href= "https://what-do-you-mean-by-wxfz.vercel.app/" target = "_blank"># [What do you mean?]
A full-stack web application that allows users to search for word definitions using the Google Gemini API. The application features user authentication, allowing users to save definitions and view their search history.

## Features

- **Word Definition Lookup**: Get detailed definitions, parts of speech, synonyms, and example sentences for any word.
- **Powered by Gemini**: Utilizes the Google Gemini API for fast and accurate definitions.
- **User Authentication**: Secure sign-up, login, and Google OAuth 2.0 for personalized user experience.
- **Save Words**: Logged-in users can save word definitions to their personal collection.
- **Search History**: Automatically tracks the search history for logged-in users.
- **Responsive Design**: A clean and modern UI that works on all devices.
- **Theming**: Switch between light and dark mode for comfortable viewing.

## Tech Stack

### Frontend

- **Framework**: React (with Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios

### Backend

- **Framework**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (Local and Google OAuth 2.0 strategies), JSON Web Tokens (JWT)
- **Middleware**: CORS, Express Session

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

## Setup and Installation

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/What-Do-You-mean-by.git
cd What-Do-You-mean-by
```

### 2. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd Backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create the environment file:**
    Create a `.env` file in the `Backend` directory and add the following variables:

    ```env
    PORT=3030
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    CLIENT_URL=http://localhost:5173
    ```

    - **`MONGO_URI`**: Your MongoDB connection string.
    - **`JWT_SECRET`**: A long, random string used to sign tokens.
    - **`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`**: Your credentials from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
    - **`CLIENT_URL`**: The URL of the running frontend application.

4.  **Run the backend server:**
    ```bash
    npm run dev
    ```
    The backend server should now be running on the port you specified (e.g., `http://localhost:3030`).

### 3. Frontend Setup

1.  **Navigate to the frontend directory (from the root):**
    ```bash
    cd Frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create the environment file:**
    Create a `.env` file in the `Frontend` directory and add the following variables:

    ```env
    VITE_API_URL=http://localhost:3030/api
    VITE_GEMINI_API_KEY=your_google_gemini_api_key
    ```

    - **`VITE_API_URL`**: The base URL for your backend API.
    - **`VITE_GEMINI_API_KEY`**: Your API key for the Google Gemini API, which can be obtained from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application should now be running on `http://localhost:5173`.

## How to Use

- Open your browser and navigate to `http://localhost:5173`.
- Use the search bar to look up a word.
- Sign up for an account or log in with Google to save words and view your history.
- Use the toggle in the top right to switch between light and dark themes.
- Use the navigation bar at the bottom to switch between Home, Saved Words, History, and your Profile.
