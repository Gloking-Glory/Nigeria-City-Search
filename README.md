# Nigeria City Search

A responsive web application for searching and exploring cities and settlements across Nigeria.

Nigeria City Search provides a typeahead search experience that helps users find locations, browse matching results, and view details about selected cities. It uses the Open-Meteo Geocoding API for location data and TanStack Query to manage API requests, caching, and loading states.

## Live Demo

[View Live Demo](https://nigeria-city-search.vercel.app/)

## Features

- Search for cities and settlements across Nigeria.
- Typeahead search with a 500ms debounce.
- Minimum three-character search requirement.
- Loading, empty, and error states.
- Keyboard and mouse navigation through search results.
- `ArrowUp` and `ArrowDown` navigation with automatic scrolling.
- `Enter` to select a search result.
- `Escape` to close the dropdown or selected city details.
- Click-away handling to close the search dropdown.
- Scrollable search results.
- Detailed information for selected locations.
- Accessible combobox and listbox interactions.
- Request cancellation and query caching.
- Responsive layouts for different screen sizes.

## Tech Stack

- **Next.js** – application framework.
- **React** – component-based user interface.
- **TypeScript** – static typing and type safety.
- **Tailwind CSS** – styling and responsive layouts.
- **React Hook Form** – form and search input management.
- **TanStack Query** – server state, caching, and request lifecycle management.
- **Open-Meteo Geocoding API** – location search data.
- **Jest and React Testing Library** – unit and component testing.
- **Vercel** – deployment.

## How It Works

The search process follows this flow:

```text
User enters a search term
          ↓
Validate minimum 3 characters
          ↓
Wait 500ms (debounce)
          ↓
TanStack Query
          ↓
Open-Meteo Geocoding API
          ↓
Display matching locations
          ↓
User selects a result
          ↓
Display selected city details
```

The search input is managed with React Hook Form, while TanStack Query handles API requests and server state.

The search term is included in the TanStack Query key, keeping results associated with their respective searches and allowing previously fetched results to be cached.

An `AbortSignal` is passed from the query function to the API request. This supports cancellation when a query is no longer needed, helping avoid unnecessary network requests as users change their search terms.

## Implementation Decisions

The application uses a 500ms debounce and a minimum three-character search threshold to reduce unnecessary API requests while keeping the search experience responsive.

TanStack Query handles caching, query state, and request cancellation, avoiding the need to manage these concerns manually.

The Open-Meteo Geocoding API was selected because it provides searchable location information without requiring an API key for this use case. Requests are filtered to Nigeria, and the returned data includes available location details such as city name, state, and administrative areas.

The application is intentionally focused on the search experience without introducing unnecessary dependencies or abstractions.

For a higher-traffic production application, I would consider introducing a server-side API layer to provide better control over rate limiting, caching, request validation, timeouts, monitoring, and upstream API usage.

Other possible improvements include:

- Server-side or CDN caching for frequently searched locations.
- More detailed location information.
- A dedicated geocoding provider or indexed location database if usage grows significantly.

## Testing

The project uses Jest and React Testing Library to test application behaviour and user interactions.

The search component tests cover:

- Initial rendering and input validation.
- Minimum search length and debounce behaviour.
- Cancellation of pending debounced searches.
- Loading, empty, and error states.
- Displaying search results.
- Mouse selection and keyboard navigation.
- Arrow key navigation and result highlighting.
- Escape key handling.
- Dropdown visibility and click-away behaviour.
- Selected city details and closing interactions.
- Switching between search terms.
- Preventing stale or previous results from being selected during a new search.
- Loading and error states when previous results exist.

The API service and custom search hook also have separate tests covering request parameters, response transformation, error handling, and query behaviour.

## Running Locally

Clone the repository:

```bash
git clone https://github.com/Gloking-Glory/Nigeria-City-Search.git
```

Navigate into the project directory:

```bash
cd Nigeria-City-Search
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To verify the production build:

```bash
npm run build
```

## API

This project uses the public [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) to retrieve location search results.

The API request uses the Nigeria country filter and returns available location information, including city names, states, and administrative areas.

No API key is required for the functionality used in this project.

For applications with higher traffic or more demanding production requirements, a server-side integration with appropriate caching, rate limiting, monitoring, and timeout handling would provide greater control over API usage.

## Project Structure

```text
src/
├── app/
|   |── search/
├── components/
│   ├── search/
│   └── utilities/
├── hooks/
├── providers/
└── services/
```

## Author

**Glory Ayanwola**

[LinkedIn](https://linkedin.com/in/ayanwola-glory) · [GitHub](https://github.com/Gloking-Glory) · [Email](mailto:ayanwolaglory@gmail.com)