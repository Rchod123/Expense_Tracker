# API Integration

The React Native app keeps all HTTP communication in `src/services/apiClient.ts`. Screens and contexts call typed domain methods instead of constructing URLs, headers, or `fetch` requests themselves.

## API Modules

### `authApi`

Used by `AuthContext` for account registration and login.

- `authApi.register(name, email, password)` calls `POST /api/auth/register`.
- `authApi.login(email, password)` calls `POST /api/auth/login`.

Both methods return the authentication token and user profile. The context stores those values through `authStorage`.

### `aiApi`

Used by `ChatScreen` and `AddTransactionScreen` for AI-assisted features.

- `aiApi.chat(payload)` calls `POST /ai/chat` for finance questions.
- `aiApi.transcribe(formData)` calls `POST /ai/transcribe` for recorded voice input.
- `aiApi.ocrReceipt(formData)` calls `POST /ai/ocr-receipt` to extract receipt details.

Multipart requests intentionally do not set `Content-Type` manually. React Native supplies the correct multipart boundary.

### `expensesApi`

Used by the Realm sync orchestration in `src/db/backend/apiCall.ts`.

- `expensesApi.sync(expenses)` calls authenticated `POST /api/expenses/sync`.
- `expensesApi.list()` calls authenticated `GET /api/expenses`.

Realm remains the local source of truth for screens. The sync layer pushes unsynced records and then pulls remote records into Realm.

### `categoriesApi`

Used by category synchronization and the add-transaction category loader.

- `categoriesApi.sync(categories)` calls authenticated `POST /api/categories/sync`.
- `categoriesApi.list()` calls `GET /api/categories`.

## Request Behavior

`apiClient.request` centralizes JSON parsing, authorization headers, content-type handling, and non-2xx error conversion. Stored authentication tokens are loaded only by authenticated API methods, so UI components do not need to manage tokens.

## Configuration

Base URLs are defined in `src/config/api.ts`:

- `API_ENDPOINT`: REST API base URL.
- `AI_API_ENDPOINT`: AI service base URL.

For a physical device, replace `localhost` with the development machine's LAN address.
