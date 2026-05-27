# 🚀 Project Report Generation Prompt

**Instructions for Claude:**
You are a Senior Technical Writer. I will provide you with the full codebase structure and key file contents of my project **ExamNotesAI**. I will also upload a **Project Report Template (PDF/Word/Text)**. Your task is to extract information from the provided context and fill the template to create a high-quality, professional academic/industrial project report.

---

## 🏗️ Project Overview: ExamNotesAI
**ExamNotesAI** is an AI-powered SaaS platform that helps students generate exam-oriented study materials. It uses Google Gemini AI to create structured notes, Mermaid.js for automated flowcharts, and Recharts for data visualization.

### 🛠️ Technical Stack:
- **Frontend:** React 19, Redux Toolkit, Tailwind CSS v4, Framer Motion, Mermaid.js, Recharts.
- **Backend:** Node.js (Express), MongoDB (Mongoose), JWT Auth.
- **AI:** Google Gemini API (gemini-2.0-flash).
- **Payments:** Stripe (Credit-based system).
- **Export:** PDFKit for PDF generation.

---

## 📂 Key File Context (For your reference):
1. **`server/controllers/generate.controller.js`**: Core logic for calling Gemini AI and saving notes.
2. **`server/utils/promptBuilder.js`**: The complex logic that structures AI prompts for Diagrams, Charts, and Revision Mode.
3. **`server/controllers/credits.controller.js`**: Stripe integration and credit management.
4. **`client/src/App.jsx`**: Frontend routing and state initialization.
5. **`server/models/`**: Schema definitions for Users, Notes, and Transactions.

---

## 📋 Your Task:
1. **Analyze the uploaded template:** Understand the sections (Abstract, Introduction, Architecture, Methodology, Future Scope, etc.).
2. **Synthesize Content:** Use the project details provided above to write technical content for each section of the template.
3. **Be Professional:** Use academic and technical language. Ensure consistent formatting.
4. **Specific Details to include:**
   - Explain how the **Credit System** works (Stripe + Database update).
   - Detail the **AI Prompting strategy** (how we ensure valid JSON for diagrams).
   - Describe the **Visualization Layer** (Mermaid and Recharts integration).

---

**[USER NOTE: NOW UPLOAD YOUR TEMPLATE FILE AFTER SENDING THIS PROMPT]**
