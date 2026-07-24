
```markdown
# 🔭 SectorScout-Lead-Compiler

## 🔗 Explore the App

[**Click here to explore SectorScout-Lead-Compiler**](https://zfryrgnci.github.io/SectorScout-Lead-Compiler)


A robust cross-platform research tool for gathering company intelligence and compiling actionable leads. This project integrates directly with research workflows to deliver structured market insights.

## 🚀 Features

*   **Company Research**: Automates the collection of industry data.
*   **Lead Identification**: Compiles potential leads from public data sources.
*   **Multi-Platform Support**: Optimized for Windows and mobile environments.
*   **Data Aggregation**: Centralizes insights into a single dashboard.

## 🛠 Tech Stack

*   **Language**: TypeScript
*   **Architecture**: Cross-platform (Windows / Android integration)
*   **AI Engine**: Google Gemini API

## 📦 Getting Started

### Installation

1. Clone the repo:
   ```bash
   git clone [https://github.com/zfryrgnci/SectorScout-Lead-Compiler.git](https://github.com/zfryrgnci/SectorScout-Lead-Compiler.git)

```

2. Install dependencies:
```bash
npm install

```



### Configuration

* Set your environment variables in `.env.local`:
`GEMINI_API_KEY=your_api_key_here`

## 🚀 Running the App

```bash
npm run dev

```

```

***

### 2. `setup.sh`
Copy and paste this into a file named `setup.sh` in your root directory:

```bash
#!/bin/bash

# SectorScout-Lead-Compiler Setup and Run Script

echo "Starting setup for SectorScout-Lead-Compiler..."

# 1. Install dependencies
echo "Installing dependencies..."
npm install

# 2. Check for .env.local file
if [ ! -f .env.local ]; then
    echo ".env.local not found. Creating from template..."
    echo "GEMINI_API_KEY=your_api_key_here" > .env.local
    echo "Please update .env.local with your actual Gemini API Key."
else
    echo ".env.local already exists."
fi

# 3. Run the development server
echo "Starting development server..."
npm run dev

```

