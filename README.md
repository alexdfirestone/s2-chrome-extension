# AdviserGPT Chrome Extension

<p align="center">
   <video src="demo/demo.mp4" controls></video>
   <img src="demo/demo.png" height="300" alt="AdviserGPT Logo"/>
</p>

<p align="center">
  <em>This is a boilerplate and starter for a Chrome browser extension, built with Wxt, React, Tailwind CSS, Shadcn UI, and TypeScript. Support for dark mode and localization is included.</em>
</p>

<p align="center">
    <img alt="Node version" src="https://img.shields.io/static/v1?label=node&message=%20%3E=18&logo=node.js&color=2334D058" />
    <a href="#"><img src="https://img.shields.io/badge/lang-English-blue.svg" alt="English"></a>
    <a href="#"><img src="https://img.shields.io/badge/lang-简体中文-red.svg" alt="简体中文"></a>
</p>

<p align="center">
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://www.linkedin.com/in/alexfirestone/" target="_blank">🐦 About Me</a>
</p>

---

## 📋 Table of Contents
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Tech Stack](#-tech-stack)
- [Usage](#-usage)

## 🔐 Prerequisites
Before you get started, please ensure you have the following installed:
- **Node.js** (>=18)
- **An Editor** (e.g., [VSCode](https://code.visualstudio.com/download), WebStorm, etc.)
- **Git** ([Download Git](https://git-scm.com/downloads))

## 🗂️ Getting Started
1. **Open your Editor**
   - Launch your preferred editor (e.g., VS Code).
   
2. **Open the Terminal**
   - Use the shortcut `Ctrl + ~` (Windows) or `Control + ~` (macOS) in VS Code.

3. **Clone the Repository & Install Dependencies**
   ```bash
   git clone git@github.com:YOUR_USERNAME/s2-chrome-extension.git
   cd s2-chrome-extension
   npm install
   npm run dev
   ```
   After the build process completes, a development server will start automatically.

4. **Load the Extension in Chrome**
   - Open `chrome://extensions` in your Chrome browser.
   - Enable **Developer mode** (toggle in the top-right corner).
   - Click **“Load unpacked”** and select the `dist` folder generated by `npm run dev`.

5. **Verify the Extension**
   - Once loaded, you should see the AdviserGPT icon. Click it to open the side panel or content scripts. You can now interact with the extension.

## ⚙️ Tech Stack
- **Wxt**: Streamlines building Chrome extensions with modern tooling.
- **React**: Declarative UI library.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Shadcn UI**: Prebuilt, accessible, and customizable components.

## 🛠️ Usage
- **Authentication**: Upon opening the side panel, you’ll be prompted to log in if not already authenticated.
- **Smart Assistant**: Once authenticated, use the text input to ask questions. AdviserGPT fetches relevant data and suggests the best answers.
- **Suggested Questions**: Click on any suggested question to see relevant context from your knowledge vault.
- **Generate Answer**: Select relevant context, then click **“Generate Answer”** to see AI-powered responses.

---

Enjoy using AdviserGPT! Feel free to contribute or open issues if you encounter any problems!