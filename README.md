# 🚀 Exponential Backoff Retry Simulator

An interactive React application that demonstrates how API retry strategies work using **Exponential Backoff, Fixed Retry, and Full Jitter**.

This project is part of my learning series **Code Beyond Code**, where I explore frontend engineering concepts through practical implementations and connect technical learnings with real-world scenarios.

## 🌐 Live Demo

[**Try the Exponential Backoff Simulator →**](https://srilekha-govvala.github.io/react-exponential-backoff-demo/)

## 📌 Project Overview

In real-world applications, API requests can fail due to temporary network issues, server overload, or service unavailability.

Instead of retrying requests immediately, Exponential Backoff progressively increases the waiting time between retry attempts, helping reduce unnecessary server load.

This project provides an interactive simulation to understand and compare different retry strategies.

## ✨ Features

- **Exponential Backoff:** Progressively increases retry delays after consecutive failures.
- **Fixed Retry:** Uses a consistent delay between retry attempts.
- **Configurable Retry Limits:** Set the maximum number of retries.
- **Customizable Delays:** Configure initial delay and maximum delay.
- **Full Jitter:** Introduces randomized retry delays to reduce synchronized requests.
- **Failure Simulation:** Configure the number of simulated API failures.
- **Request Timeline:** Visualize individual attempts, failures, retry delays, and final outcomes.
- **Input Validation:** Prevents invalid retry configurations.
- **Responsive UI:** Designed for different screen sizes.

## 🛠️ Tech Stack

- React.js
- JavaScript (ES6+)
- HTML5
- CSS3
- Vite

## 🧠 Concepts Explored

- Exponential Backoff Algorithm
- Fixed Retry Strategy
- Full Jitter
- JavaScript Promises
- Async/Await
- Error Handling (try/catch/finally)
- React Hooks and State Management
- Dynamic UI Updates

## ⚙️ Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Srilekha-govvala/react-exponential-backoff-demo.git
   ```

2. Navigate to the project directory:

   ```bash
   cd react-exponential-backoff-demo
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

### Production Build

To generate the production build:

```bash
npm run build
```

## 🔍 How to Explore the Simulator

1. Select Exponential Backoff or Fixed Retry.
2. Configure the maximum number of retries.
3. Set the initial delay and maximum delay.
4. Choose the number of simulated failures.
5. Enable Full Jitter to introduce randomized delays.
6. Click **Simulate API Request**.
7. Observe the request timeline and retry behavior.

## 📂 Deployment

The application is hosted using GitHub Pages.

The production build is generated in the `docs` directory and published from the `main` branch.

## ⚠️ Note

This is an educational simulation. API requests and failures are mocked locally to demonstrate retry behavior; the application does not connect to an actual backend API.

## 👩‍💻 Author

**Srilekha Govvala**

Frontend Developer | React.js | JavaScript

[GitHub](https://github.com/Srilekha-govvala)

---

*Code Beyond Code #01 — Exploring engineering concepts beyond the code.*
