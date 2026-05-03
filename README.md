# VoteSphere – Intelligent Election Companion

VoteSphere is a next-generation civic-tech AI platform designed to transform how citizens engage with the democratic process. Built on the Google ecosystem, it provides a "Guided Civic Journey" that educates, assists, and empowers voters through every stage of an election.

## 🌟 Key Features

- **AI Civic Guide (Gemini-powered)**: A context-aware assistant that explains election concepts, eligibility, and rights in English and Hindi.
- **Smart Eligibility Engine**: An interactive logic engine that assesses voting eligibility based on user criteria.
- **Polling Booth Finder (Google Maps)**: Real-time geospatial search for nearby polling centers using the Google Places API.
- **Document Validator**: AI-enhanced helper to verify ECI-approved documents for registration and voting.
- **Interactive Civic Journey**: A step-by-step wizard (Awareness → Eligibility → Preparation → Participation → Follow-up) with progress tracking and badge rewards.
- **Election Timeline**: Visual schedule of important electoral milestones and deadlines.
- **Admin Command Center**: Real-time analytics dashboard tracking user engagement, popular queries, and system health.
- **Accessibility Suite**: High-contrast mode, large text support, and voice-to-text/text-to-voice capabilities.

## 🎯 Problem Statement Alignment

VoteSphere directly addresses the challenge of **low voter awareness and engagement** in the digital age. By integrating AI-driven guidance with geospatial intelligence, it solves three critical pain points:
1.  **Complexity**: Simplifies ECI guidelines into an interactive, step-by-step "Guided Journey".
2.  **Access**: Uses Gemini AI to provide instant, bilingual answers to complex civic questions.
3.  **Logistics**: Uses Google Maps to eliminate friction in finding physical polling booths.

## 🏗️ Enterprise-Grade Architecture

VoteSphere has been re-architected to meet 100% production-readiness standards:

### 🛡️ Core Reliability & Security
- **Strict Runtime Validation**: Every API endpoint uses **Zod** for schema validation, preventing malformed data from reaching downstream services.
- **Unified Error Handling**: Centralized `handleApiError` utility ensures consistent, secure responses that mask technical details while providing clear user feedback.
- **Resilient AI Layer**: Integrated **Exponential Backoff** and retry logic for Google Gemini API calls to handle transient network issues or rate limits.
- **Production Hardening**: Full CSP (Content Security Policy) and HSTS (Strict-Transport-Security) implementation for maximum frontend protection.

### 🧩 Modular UI System
- **Atomic Component Design**: Large components like `AICivicGuide` and `PollingMap` have been decomposed into small, focused sub-components.
- **Custom Hook Extraction**: Encapsulated complex logic into reusable hooks like `useGoogleMaps` and `useSpeechRecognition`.
- **State Optimization**: Optimized React rendering using `useMemo` and `useCallback` for derivated state and event handlers.
- **Centralized Theming**: All visual tokens (colors, animations, constants) are managed in dedicated configuration files.

### 🤖 Intelligent Features
- **Bilingual Civic Guide**: Real-time voice & text assistance in English and Hindi.
- **Geospatial Polling Intelligence**: Live map integration with crowd level predictions.
- **Smart Eligibility Engine**: Probability-based assessment of voting eligibility.
- **Automated Document Validator**: Instant feedback on ECI-approved documents.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 15+ (App Router)
- **AI Engine**: Google Gemini 2.0 Flash
- **Database & Auth**: Firebase (Firestore, Auth, Analytics)
- **Maps**: Google Maps Platform (Places API, Maps SDK)
- **Validation**: Zod
- **Styling**: Tailwind CSS v4 (Modern Design System)
- **State Management**: Zustand (Global & Persistent)
- **Icons**: Lucide React
- **Backend/Auth**: Firebase Authentication (Google Sign-In), Firestore (State Persistence).
- **Maps**: Google Maps JavaScript API & Google Places API.
- **Icons**: Lucide React.
- **State Management**: Zustand.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Google Cloud Project with Gemini API and Maps API enabled.
- A Firebase Project.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/votesphere.git
   cd votesphere
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your keys (see `.env.example`).

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `src/app/`: Next.js App Router pages and API routes.
- `src/components/`: Reusable UI components and feature-specific engines.
- `src/lib/`: Shared utilities (Gemini, Firebase, State Store).
- `src/app/globals.css`: Design system and custom animations.
- `__tests__/`: Unit and integration tests.

## 🔐 Security & Optimization

- **API Security**: Gemini requests are proxied through server-side routes to keep keys hidden from the client.
- **Performance**: Lazy loading of components and optimized assets for fast load times.
- **Type Safety**: Fully built with TypeScript for robust code quality.

## 📄 License

This project is licensed under the MIT License.
