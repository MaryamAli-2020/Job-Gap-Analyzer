# Career Compass: Your AI-Powered Career Navigator

Career Compass is a modern web application built with Next.js and powered by Google's Gemini AI. It helps you navigate your career path by analyzing your resume, matching you with relevant job opportunities, identifying skill gaps against job descriptions, and recommending personalized learning resources to help you land your dream job.

![Career Compass Screenshot](https://placehold.co/800x450.png?text=Career+Compass+UI)
*This is a placeholder image. A real screenshot of the application should be placed here.*

## ✨ Features

- **📄 Smart Resume Parsing:** Upload your resume (PDF, DOCX) and let the AI extract your name, contact info, skills, work experience, and education in seconds.
- **🤖 AI-Powered Job Matching:** Get a list of job openings that are highly relevant to your profile, powered by a dynamic job search tool.
- **📊 In-Depth Skill Gap Analysis:** Select a job you're interested in and get a detailed breakdown of which skills you have (Matched Skills), which ones you're missing (Missing Skills), and which ones you might want to highlight from your resume (Suggested Skills).
- **📚 Personalized Learning Recommendations:** Based on your skill gaps for a target job, the app provides a curated list of online courses, articles, and tutorials to help you upskill.
- **🔄 Dynamic & Responsive:** Refresh job listings on the fly and enjoy a seamless experience on any device.

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **AI & Generative Backend:** [Firebase Genkit](https://firebase.google.com/docs/genkit), [Google Gemini](https://deepmind.google/technologies/gemini/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A Google AI API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/career-compass.git
    cd career-compass
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of your project and add your Google AI API key:
    ```env
    GOOGLE_API_KEY=your_google_api_key_here
    ```

4.  **Run the development server:**
    The application consists of the Next.js frontend and the Genkit backend. Run them concurrently in separate terminals.

    *   **Terminal 1: Start the Next.js app:**
        ```bash
        npm run dev
        ```
        Your application should now be running at [http://localhost:9002](http://localhost:9002).

    *   **Terminal 2: Start the Genkit development server:**
        ```bash
        npm run genkit:dev
        ```
        This starts the Genkit flows and makes them available for your Next.js application to call.

## ⚙️ How It Works

The application's logic is orchestrated through a series of AI flows defined with Genkit:

1.  **Resume Upload (`/components/app/resume-upload.tsx`):** The user uploads their resume file. The file is converted to a Base64 data URI.
2.  **Resume Parsing (`/ai/flows/resume-parser.ts`):** The data URI is sent to the `parseResume` flow. Gemini's multimodal capabilities are used to read the document and extract structured JSON data (name, skills, experience, etc.).
3.  **Job Matching (`/ai/flows/job-matcher.ts`):** The extracted resume data is passed to the `jobMatcher` flow. This flow uses an AI-powered `searchJobsTool` (`/ai/tools/job-search.ts`) to formulate a search query based on the user's profile and find relevant job listings.
4.  **Skill Gap Analysis (`/ai/flows/skill-gap-analyzer.ts`):** When the user clicks "Analyze Skill Gap" for a specific job, the `analyzeSkillGaps` flow is invoked. It compares the text from the resume against the job description to identify matches, gaps, and suggestions.
5.  **Resource Recommendation (`/ai/flows/resource-recommender.ts`):** The summary from the skill gap analysis is then passed to the `recommendResources` flow, which suggests targeted learning materials to help the user become a stronger candidate.
