# 📚 ExamNotes AI

**ExamNotes AI** is an intelligent, AI-powered study platform designed to help students generate exam-focused notes, interactive flowcharts, and data visualizations in seconds. Powered by Google Gemini AI, it transforms complex topics into structured, easy-to-learn study materials.

---

## 🚀 Features

-   **AI Note Generation**: Generate detailed, exam-oriented notes for any topic.
-   **Revision Mode**: Toggle "Revision Mode" for concise, bullet-pointed summaries—perfect for last-minute prep.
-   **Automated Flowcharts**: Built-in integration with **Mermaid.js** to generate visual process diagrams and flowcharts automatically.
-   **Data Visualization**: Uses **Recharts** to provide visual charts (Bar, Pie, Line) for topic weightage and key statistics.
-   **Stripe Credit System**: A professional payment gateway integration where 1 Credit = 1 AI Generation.
-   **History Management**: Track all your previous generations in a dedicated history tab.
-   **PDF Export**: Download your generated notes and diagrams as high-quality PDFs for offline study.
-   **Modern UI/UX**: Built with **React 19**, **Tailwind CSS v4**, and **Framer Motion** for a smooth, responsive experience.

---

## 🛠️ Tech Stack

### Frontend
-   **React 19 (Vite)**
-   **Redux Toolkit** (State Management)
-   **Tailwind CSS v4** (Modern Styling)
-   **Mermaid.js** (Flowcharts)
-   **Recharts** (Interactive Charts)
-   **Framer Motion** (Animations)

### Backend
-   **Node.js & Express.js**
-   **MongoDB & Mongoose** (Database)
-   **Google Gemini AI API** (AI Engine)
-   **Stripe API** (Payments)
-   **PDFKit** (PDF Generation)
-   **JWT & Firebase** (Authentication)

---

## ⚙️ Installation & Setup

### Prerequisites
-   Node.js (v18 or higher)
-   MongoDB Atlas account
-   Stripe Account (for API keys)
-   Google AI Studio Key (for Gemini API)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ExamNotesAI.git
cd ExamNotesAI
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
CLIENT_URL=http://localhost:5173
```
Run the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file in the `client` folder:
```env
VITE_SERVER_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_pub_key
```
Run the client:
```bash
npm run dev
```

---

## 📸 Screenshots
*(Add your project screenshots here)*

---

## 📄 License
This project is licensed under the **ISC License**.

## 👨‍💻 Author
**Manish Kumar**
-   Email: [kumarmanis552@gmail.com](mailto:kumarmanis552@gmail.com)
-   GitHub: [@manishkumar](https://github.com/your-username)

---

*Made with ❤️ for Students.*
