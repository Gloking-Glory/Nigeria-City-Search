# Nigeria City Search

A responsive typeahead/autocomplete search for discovering cities and settlements across Nigeria.

Built as a frontend technical assessment using **Next.js, React, TypeScript, Tailwind CSS, React Hook Form, TanStack Query, and Open-Meteo**.

## Live Demo

[View Live Demo](https://nigeria-city-search.vercel.app/)

## Features

* Typeahead search for Nigerian cities
* 500ms debounced search
* Minimum 3-character search
* Loading, empty, and error states
* Mouse and keyboard navigation
* `ArrowUp` / `ArrowDown` navigation with scroll support
* `Enter` to select a result
* `Escape` to close
* Click-away dropdown handling
* Scrollable results
* Selected city details
* Accessible combobox/listbox semantics
* Request cancellation and query caching
* Responsive UI

## Tech Stack

* **Next.js** — application framework
* **React + TypeScript** — UI and type safety
* **Tailwind CSS** — styling and responsive design
* **React Hook Form** — form and input handling
* **TanStack Query** — server state, caching, and request lifecycle
* **Open-Meteo Geocoding API** — location search data
* **Vercel** — deployment

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
Open-Meteo Geocoding API
    ↓
Display results
    ↓
Select city
    ↓
Show city details
```

TanStack Query uses the search term as part of the query key and passes an `AbortSignal` to the API request. This allows previous requests to be cancelled when appropriate while keeping each search associated with its own query state.

## Tradeoffs, Scaling & Testing

I intentionally kept the implementation lightweight and focused on the assessment requirements rather than introducing unnecessary abstractions or dependencies. A 500ms debounce and minimum three-character search threshold reduce unnecessary API requests while keeping the search responsive. TanStack Query provides caching, query lifecycle management, and request cancellation through `AbortSignal`.

For higher traffic, I would move the geocoding request behind a server-side endpoint. This would provide better control over rate limiting, caching, request validation, timeouts, monitoring, and upstream API usage. Frequently searched locations could also be cached at the server or CDN level. At significantly higher scale, I would consider a dedicated geocoding provider or an indexed location database.

For testing, I would use Jest and React Testing Library to cover debounce behaviour, minimum search length, loading, empty and error states, keyboard navigation, result selection, Escape handling, click-away behaviour, and stale-response scenarios. I would also add an end-to-end test covering the main search flow.

## Running Locally

```bash
git clone https://github.com/Gloking-Glory/Nigeria-City-Search.git

cd Nigeria-City-Search

npm install

npm run dev
```

Open `http://localhost:3000`.

To verify the production build:

```bash
npm run build
```

## API

This project uses the public **Open-Meteo Geocoding API** to search for locations in Nigeria.

The API does not require an API key for the use case covered by this assessment.

For a production application with significantly higher traffic, I would introduce a server-side integration with appropriate caching, rate limiting, monitoring, and timeout handling, or use a geocoding provider designed for the expected production workload.

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
