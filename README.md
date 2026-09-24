# Nigeria City Search

A responsive typeahead/autocomplete search for discovering cities and settlements across Nigeria.

Built for a frontend technical assessment using **Next.js, React, TypeScript, Tailwind CSS, React Hook Form, TanStack Query, and Nominatim/OpenStreetMap**.

## Live Demo

[View Live Demo](https://nigeria-city-search.vercel.app/)

## Features

* Typeahead search for Nigerian cities
* 500ms debounced search
* Minimum 3-character search
* Loading, empty, and error states
* Mouse and keyboard navigation
* `ArrowUp` / `ArrowDown` navigation
* `Enter` to select a result
* `Escape` to close
* Click-away dropdown handling
* Scrollable results
* Selected city details
* Accessible combobox/listbox semantics
* Request cancellation and query caching

## Tech Stack

* **Next.js** – application framework
* **React + TypeScript** – UI and type safety
* **Tailwind CSS** – styling and responsive design
* **React Hook Form** – input handling
* **TanStack Query** – server state, caching and request lifecycle
* **Nominatim/OpenStreetMap** – location search data
* **Vercel** – deployment

## How It Works

```text
User types
    ↓
3+ characters
    ↓
500ms debounce
    ↓
TanStack Query
    ↓
Nominatim API
    ↓
Display results
    ↓
Select city
    ↓
Show city details
```

TanStack Query uses the search term as part of the query key and passes an `AbortSignal` to the API request. This helps manage asynchronous requests and prevents obsolete requests from unnecessarily continuing.

## Tradeoffs, Scaling & Testing

I intentionally kept the implementation lightweight and focused on the assessment requirements rather than introducing unnecessary abstractions or dependencies. I used Next.js, TypeScript, React Hook Form, and TanStack Query, with Nominatim providing the location data. A 500ms debounce and a minimum three-character search threshold reduce unnecessary requests while keeping the search responsive. TanStack Query also provides caching and request cancellation through its `AbortSignal`, which helps prevent stale requests from interfering with newer searches.

For higher traffic, I would move the geocoding request behind a server-side endpoint rather than calling the external service directly from the browser. This would provide better control over rate limiting, caching, request validation, timeouts, monitoring, and upstream API usage. Frequently searched locations could be cached at the server or CDN level. At significantly higher scale, I would consider a dedicated geocoding provider or an indexed location database.

For testing, I would use Jest and React Testing Library to cover debounce behaviour, the minimum search length, loading, empty and error states, keyboard navigation, result selection, Escape handling, click-away behaviour, and stale-response scenarios. I would also add an end-to-end test covering the main search flow.

## Running Locally

```bash
git clone https://github.com/Gloking-Glory/Nigeria-City-Search
cd nigeria-city-search
npm install
npm run dev
```

Open `http://localhost:3000`.

To verify the production build:

```bash
npm run build
```

## API

This project uses the public **Nominatim API** with OpenStreetMap data.

For a production application, I would use a server-side integration with appropriate caching and rate limiting, or a geocoding provider designed for the expected traffic and autocomplete use case.

Nominatim usage policy:

https://operations.osmfoundation.org/policies/nominatim/

## Project Structure

```text
src/
├── app/
├── components/
│   ├── search/
│   └── utilities/
├── hooks/
├── providers/
└── services/
```

## Author

**Glory Ayanwola**

[LinkedIn](https://linkedin.com/in/ayanwola-glory) · [GitHub](https://github.com/Gloking-Glory)
