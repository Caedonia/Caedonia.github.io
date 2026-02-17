# 🌵 Cactus Learning Portal & Archive

A comprehensive educational platform for cactus enthusiasts and english students. This project has evolved from a simple landing page into a full-scale mockup including a student portal, a teacher admin command center, and a scientific field-number archive.

## 📂 Final Project Architecture

The repository is structured to separate user roles and data types:

* **`/` (Root):** Main entry point (`landing.html`).
* **`/dashboard`:** Student-facing portal with homework and lesson summaries.
* **`/plan`:** Interactive class timetable with grid-spanning technology.
* **`/cacti`:** * `start.html`: Multi-filter search for Field Numbers, Genus, and Origin.
    * `detail.html`: Deep-dive scientific view for specific specimens.
* **`/teacher_panel`:** Teacher control panel for updating portal content.
* **`/styles`:** Centralized CSS (Main, Dashboard, Schedule, Search, Admin).
* **`/js`:** JavaScript modules for form handling and data filtering.
* **`/assets`:** High-resolution cactus photography and branding.

## 🚀 Key Modules

### 🔬 Scientific Archive (New!)
* **Multi-Filter Search:** Separate inputs for Field Number, Genus, Name, and Country.
* **Specimen Detail View:** A dedicated layout for taxonomical data and collection history (e.g., Alfred Lau/Walter Rausch field records).
* **Responsive Photo Galleries:** Optimized viewing for habitat and flower macro shots.

### 👩‍🏫 Teacher Admin Panel
* **Content Management:** Forms to instantly update the Student Dashboard.
* **Local Persistence:** Uses Browser LocalStorage to simulate database updates without a backend.

### 📩 Contact & Communication
* **Formspree Integration:** Real-time email delivery with AJAX "hijacking" to maintain a seamless UX.

## 🛠️ Technical Implementation

### Path Navigation
Due to the nested folder structure, this project relies heavily on **Relative Pathing**:
* Use `../` to move up to the root from subfolders.
* Use `../../` if deep-nesting components.



### Grid & Layout
The project utilizes **CSS Grid** for two primary purposes:
1. **The Schedule:** Vertical pillar spanning using `grid-row`.
2. **The Archive:** Auto-responsive card layouts using `repeat(auto-fill, minmax(280px, 1fr))`.



## 📝 Future Roadmap
- [ ] Connect a real database (Firebase/Supabase) to replace LocalStorage.
- [ ] create a backend connecting the app and turning it into a working tool

---
*Maintained by the Cactus Learning Team. Grow your knowledge!* 🌵