# Architecture

## Client Layers

```text
Screens and UI components
        |
        v
Typed domain hooks and services
  |                    |
  v                    v
Realm local database   apiClient.ts
        |                    |
        +---------+----------+
                  v
          Express REST and AI APIs
```

### UI Layer

Screens render data and handle user interaction. They should not call `fetch`, build API URLs, or manage authorization headers. Reusable interaction patterns belong in components such as transaction lists, detail modals, and chart controls.

### API Layer

`src/services/apiClient.ts` is the single frontend network boundary. It exposes typed methods grouped by domain:

- `authApi` for login and registration.
- `aiApi` for chat, transcription, and receipt OCR.
- `expensesApi` for expense synchronization and retrieval.
- `categoriesApi` for category synchronization and retrieval.

### Local Data Layer

Realm stores expenses and categories for offline-first rendering. `src/db/backend/apiCall.ts` coordinates synchronization but delegates all HTTP work to `apiClient.ts`. `useExpenseSync` controls when synchronization runs based on authentication and network state.

### Statistics

Statistics are derived from the authenticated user's Realm records in `src/utils/commonHooks.ts`. Weekly data is grouped Monday through Sunday, monthly data is grouped January through December of the current year, and both series retain the original currency amount without scaling. The statistics screen displays the selected series total and a friendly empty state when the selected period has no activity.

## Data Flow

1. The user signs in through `authApi`.
2. `AuthContext` stores the token and user profile.
3. `useExpenseSync` pushes local unsynced records and pulls remote records.
4. Realm queries update screens reactively.
5. Statistics and transaction views derive their display data from the current user's Realm records.
