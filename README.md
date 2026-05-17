# 🌵 Cactus Learning Portal

Welcome to the **Cactus Learning Portal**—a specialized, full-stack English language learning platform designed by collectors, for collectors. By blending structured language acquisition with cactus botany and taxonomy, this application creates a highly contextual, engaging environment for botanical enthusiasts to master English.

## 📖 Core Philosophy
* **Contextual Learning:** Vocabulary and grammar are taught through the lens of Genus, Species, and Field Numbers (e.g., L 450).
* **Minimalist Aesthetic:** A clean, card-based UI utilizing a nature-inspired palette to keep the focus on the content.
* **Modular Architecture:** A decentralized "folder-per-feature" frontend supported by a centralized Node.js/SQLite backend.

### 📋 Project Status & Stack Architecture

The **Cactus Learning Portal** has successfully transitioned from a localized mockup framework to a distributed cloud architecture. The platform decouples user interface delivery from data persistence to guarantee that student archives and taxonomical database records are accessible globally.


## 🛠 Tech Stack

* **Frontend Environment:** Semantic HTML5, CSS3 (Grid/Flexbox layout systems), and Vanilla JavaScript utilizing the asynchronous **Fetch API**. \

* **Database Infrastructure:** Hosted relational PostgreSQL schema managed entirely via **Supabase cloud endpoints**, bypassing the legacy local SQLite (cactus.db) deployment stack. \

* **Global Layout Control:** Centralized component modules (/js/nav.js and /styles/main.css) apply relative path mapping (../) across all folder-per-feature routes. \

## 📂 File Architecture
To facilitate rapid remote debugging and feature modularity, components follow a strict **folder-per-feature** pattern, isolating global shared engine logic from standalone application views:


    Plaintext

/root \
├── index.html              # Application core landing page \
├── landing.html            # Public entryway and Contact form hub \
├── /dashboard              # Student Homework & Lesson Summary system \
│   └── index.html           \
├── /search                 # Taxon Deep-Dive and Filtering Archive \
│   ├── index.html          # 4-way filter search interface \
│   └── detail.html         # Specimen detail view via parameter injection \
├── /admin                  # Teacher Input & CRUD Administrative panel \
│   └── index.html           \
├── /styles                 # Centralized CSS Design Tokens \
│   ├── main.css            # Base layouts, nature-palette tokens, CSS grid schedules \
│   └── [feature].css       # Explicit UI overrides scoped to feature folders[cite: 1] \
└── /js                     # Centralized Client-Side Script Engine[cite: 1] \
    ├── nav.js              # Relative path injection framework[cite: 1] \
    ├── contact.js          # Formspree asynchronous hijack scripts[cite: 1] \
    └── search.js           # Supabase Cloud REST API integration logic[cite: 1] \

### ---🔄 Decoupled Client-to-Cloud Data Flow

    Plaintext

[ Client Browser UI ] ───( Direct HTTPS / Fetch API )───> [ Supabase REST Gateways ] ───> [ Live PostgreSQL Instance ] \


By querying Supabase directly from the frontend, application runtime speed is enhanced. Data management is handled cleanly without maintaining an active local Express server connection on your workstation while you are out.


## 🗄 Database Schema

Cacti Platform inclues tables:

* **cacti**: `id`, `field_number`, `genus`, `species`, `origin`, `description`,`created_at`,`notes`,`exact_location`.

planning for `homework` and `lessons`.

## 🚀 Key Functionalities

Here is the targeted **Key Functionalities** section for your `README.md`. It highlights what is already running smoothly under the hood and outlines the exact layout and data mechanics you've built into the system.

---

## 🚀 Key Functionalities

### 🗺️ Dynamic Path-Calculating Navigation

* **User Feature:** Injects a consistent, mobile-friendly navigation header across all contexts, complete with an expandable **"English Learning" dropdown menu** for quick resource pivoting.


### 🔍 4-Way Taxon Filtering Grid (`/search`)

* **Botanical Context:** Cactus collectors analyze specimens using cross-referenced data points: Field Numbers (the collector's specific expedition code, e.g., *L 450*), Genus, Species, and Geographic Origin.

* **Data Engine:** Powered by client-side event listeners that intercept search inputs and instantly update a clean, CSS Grid-based card interface.

* **Asynchronous Processing:** Queries are fired directly to the database layer via asynchronous `fetch()` architecture, ensuring instant lookups without page refreshes.


### ✉️ Non-Disruptive Form Hijacking (`landing.html`)

* **User Feature:** The UI instantly transitions to display a seamless "Success" micro-interaction on-screen, keeping the language learner or cactus collector grounded on the landing page.


