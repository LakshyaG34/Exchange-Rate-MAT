# Exchange Rate Desk

The project compares two exchange-rate sources through a React/Vite frontend and an Express API.

## Configuration

Copy the backend example and add the provider key:

```sh
cd backend
cp .env.example .env
```

Set `EXCHANGE_RATE_API_KEY` in `backend/.env`. Keep this credential on the backend; variables prefixed with `VITE_` are bundled into browser code and must not contain secrets. `PORT` defaults to `4000`.

The frontend can use a separate API origin in production by setting `VITE_API_BASE_URL` in `frontend/.env.local` before building, for example `https://api.example.com`. Set the backend's `FRONTEND_ORIGIN` to the deployed frontend origin (or a comma-separated list of origins) to allow browser requests. Leave `VITE_API_BASE_URL` blank when the frontend and API share an origin. For local development, Vite proxies `/api` to `VITE_BACKEND_URL`, which defaults to `http://localhost:4000`.

## Start the backend

Install packages once in both `backend/` and `frontend/` with `npm install`. Then, in one terminal:

```sh
cd backend
npm run dev
```

The API listens on the configured port. Its routes are organized under `backend/routes/`; provider requests remain in the backend service modules.

## Start the frontend

In another terminal:

```sh
cd frontend
npm run dev
```

Open the Vite URL printed in the terminal. Page-level UI lives under `frontend/src/pages/`, shared and feature components under `frontend/src/components/`, and API calls and formatting helpers under `services/` and `utils/`.

## API routes

- `GET /api/rbi/rates?from=YYYY-MM-DD&to=YYYY-MM-DD` fetches RBI archive reference rates for a date range.
- `GET /api/exchange-rate/latest?base=USD` fetches the latest rates for a selected base currency.
- `GET /api/health` checks whether the Express server is running.

Run the standalone ExchangeRate-API provider check from `backend/` with `npm run test:exchange-rate`.
