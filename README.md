# GeoSick: AI-Powered Environmental Health Intelligence

**Translating complex environmental data into clear, actionable health intelligence to empower communities and preempt public health threats.**

---

## 🌍 Overview

GeoSick is a sophisticated, AI-driven web application designed to bridge the critical gap between environmental factors and public health. By leveraging Google's **Gemini 2.5 Flash** and **Imagen 3/4** models, GeoSick provides users with real-time, location-specific health insights, proactive hazard detection, and personalized wellness tools.

The platform operates on a "Simulated Backend" architecture using local storage, making it a privacy-focused, zero-setup demonstration of how Generative AI can revolutionize preventive healthcare.

---

## 🚀 Key Features

### 1. Interactive 3D Globe Explorer
*   **Visual Exploration:** A high-fidelity 3D globe (`react-globe.gl`) allowing users to explore any point on Earth.
*   **City Health Snapshots:** Click on major cities to generate a real-time public health report derived from current web data (using Gemini Search Grounding). Includes disease trends, case estimates, and summaries.
*   **Location Analysis:** Click any coordinate to generate a localized environmental hazard report and a synthetic satellite visualization of that specific biome using **Imagen 4.0**.
*   **Geocoding:** Integrated search bar to fly to specific locations instantly.

### 2. AI Analysis Suite
*   **📸 Area Scan (Image Analysis):** Upload photos of your surroundings. The AI identifies potential health hazards (e.g., stagnant water, pollution) and suggests preventive measures.
*   **📜 Prescription Reader:** Upload a doctor's prescription. The AI extracts medicine names, dosages, and precautions into a legible summary and helps find nearby pharmacies.
*   **🩺 Symptom Checker:** Voice-enabled interface allowing users to describe symptoms naturally. The AI provides a cautious triage recommendation, potential conditions, and next steps.
*   **🧠 Mental Wellness Check-in:** A compassionate, confidential questionnaire that provides a supportive reflection and coping strategies based on user responses.

### 3. Real-Time Health Intelligence
*   **HealthCast:** A daily, location-based health forecast analyzing risk factors like Air Quality, UV Index, Pollen, and Vector activity.
*   **Live Health Alerts:** Aggregates and displays significant global and local disease outbreaks or environmental threats using Google Search Grounding.
*   **Facility Finder:** Automatically locates nearby Hospitals, Clinics, and Pharmacies based on the user's GPS coordinates.

### 4. Personal Health Utilities
*   **💧 Water Log:** A hydration tracker with customizable goals and browser-based push notifications for drink reminders.
*   **Activity History:** A local log of all AI analyses performed by the user for future reference.
*   **Profile Management:** Manage personal details and change passwords locally.

### 5. Advanced UI/UX
*   **AI Chatbot:** A persistent, voice-capable assistant that can answer health questions and **navigate the app** via voice commands (e.g., "Take me to the symptom checker").
*   **Admin Dashboard:** A hidden dashboard for viewing all registered users and global activity logs.
*   **Multilingual Support:** Full UI and AI response support for **15+ languages**, including major Indic languages (Hindi, Telugu, Bengali, Tamil, etc.).

---

## 🛠 Technical Architecture

GeoSick is built with a modern, performance-oriented stack:

*   **Frontend Framework:** React 19 with TypeScript.
*   **Build Tool:** Vite.
*   **Styling:** Tailwind CSS with custom animations.
*   **Artificial Intelligence:**
    *   **SDK:** `@google/genai`
    *   **Text & Multimodal:** `gemini-2.5-flash` (Used for analysis, chat, and search grounding).
    *   **Image Generation:** `imagen-4.0-generate-001` (Used for location visualization).
    *   **Search Grounding:** Integrated for retrieving real-time world events and health data.
*   **Visualization:** `react-globe.gl` and `three.js`.
*   **Data Persistence:** `localStorage` (Acts as a client-side database for User Auth, Activity Logs, and Settings).
*   **Browser APIs:** Web Speech API (Voice Input/Output), Geolocation API, Notification API.

---

## 📦 Installation & Setup

Follow these steps to run GeoSick locally.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   A Google Gemini API Key

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/geosick.git
    cd geosick
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your API key.
    ```env
    API_KEY=your_actual_google_gemini_api_key
    ```
    *Note: Ensure your API key has access to Gemini Flash and Imagen models via Google AI Studio.*

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

---

## 🔐 User & Admin Access (Demo Mode)

Since the app uses local storage, you can create any account you like.

**Default Admin Account (Auto-created on first load):**
*   **Email:** `nookanikshithllpsdsnr@gmail.com`
*   **Password:** `nooka@nikki123`

*Log in with these credentials to access the **Admin Dashboard** in the sidebar.*

---

## ⚠️ Medical Disclaimer

**GeoSick is an informational tool powered by Artificial Intelligence.**

*   It is **NOT** a substitute for professional medical advice, diagnosis, or treatment.
*   Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
*   Never disregard professional medical advice or delay in seeking it because of something you have read on this application.
*   In case of a medical emergency, call your local emergency services immediately.

---

## 📄 License

This project is open-source and available under the **MIT License**.
