# 🌵 Cactus Learning Portal

## 📖 Project Overview

Cactus Learning Portal to platforma edukacyjna do nauki języka angielskiego, osadzona w kontekście botaniki i taksonomii kaktusów. System integruje pasję do kolekcjonowania roślin z nauką języka, oferując unikalne podejście oparte na autentycznych danych (np. numery polowe, pochodzenie, rodzaje).

Platforma obsługuje trzy konteksty użytkowników:

1. **Publiczny:** Strona lądowania i formularz kontaktowy.
2. **Student:** Dashboard z archiwum lekcji i prac domowych.
3. **Nauczyciel:** Panel administracyjny do zarządzania danymi.

## 🛠 Tech Stack

* **Frontend:** HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript.
* **Backend:** Node.js z frameworkiem **Express.js**.
* **Database:** **SQLite** (zarządzana przez sterownik `sqlite3`).
* **Komunikacja:** Fetch API (AJAX), CORS, Formspree.io (obsługa kontaktu).

## 📂 File Architecture

Projekt stosuje architekturę modułową (folder-per-feature). Globalne zasoby są współdzielone i linkowane relatywnie.

```plaintext
/root
├── server.js            # Serwer Express i API
├── cactus.db            # Baza danych SQLite
├── landing.html         # Strona główna
├── /dashboard           # Widok studenta (zadania, podsumowania)
│   └── index.html
├── /search              # Archiwum kaktusów (filtrowanie 4-kierunkowe)
│   ├── index.html
│   └── detail.html      # Szczegóły konkretnego okazu
├── /admin               # Panel nauczyciela (formularze wprowadzania)
│   └── index.html
├── /styles              # Scentralizowane arkusze stylów
└── /js                  # Logika (nav.js, search.js, contact.js)

```

## 🗄 Database Schema

Baza danych `cactus.db` zawiera obecnie tabelę:

* **cacti**: `id`, `field_number`, `genus`, `species`, `origin`, `description`.

*W planach:* Tabele `homework` (zadania studentów) oraz `lessons` (dziennik lekcji).

## 🚀 Key Functionalities

* **Dynamiczna nawigacja:** Skrypt `nav.js` automatycznie wstrzykuje menu i oblicza ścieżki relatywne (`../`) zależnie od poziomu zagnieżdżenia strony.
* **API Endpoints:**
* `GET /api/cacti`: Pobieranie pełnego archiwum.
* `GET /api/cacti/:field_number`: Szczegółowe dane taksonomiczne okazu.


* **Asynchroniczna obsługa:** Formularze działają bez przeładowania strony, informując o sukcesie poprzez DOM.
* **Zaawansowany Layout:** Grafik zajęć zbudowany na CSS Grid z obsługą nakładających się bloków czasowych.

## 🛠 Next Steps

1. **CRUD Expansion:** Implementacja tras `POST` i `PUT` dla panelu administratora.
2. **Authentication:** Zabezpieczenie folderu `/admin` prostym systemem logowania.
3. **Data Persistence:** Przeniesienie danych "Lesson Summary" z `localStorage` do bazy SQLite.
4. **Dynamic Detail View:** Obsługa parametrów URL (np. `?field=L450`) w celu dynamicznego generowania strony detali kaktusa.

---

### 💡 Mała sugestia techniczna (Candor Check):

Zauważyłem w Twojej strukturze plików, że niektóre pliki w `/js` mają literówki (np. `dahboard.js` zamiast `dashboard.js`). Warto to poprawić teraz, zanim backend mocno się rozrośnie, aby uniknąć błędów 404 przy ładowaniu skryptów.

Czy chciałbyś, abym pomógł Ci teraz przygotować kod dla jednego z punktów z "Next Steps", np. trasę `POST` do zapisywania kaktusów w bazie?
