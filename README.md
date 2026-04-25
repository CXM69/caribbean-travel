# Caribbean Travel

Simple flight search app built with Node.js and Express. The backend proxies a RapidAPI
Skyscanner-style flight search endpoint and serves a minimal frontend from Express.

## Features

- Search flights by `origin`, `destination`, and `date`
- Normalized results with `airline`, `departure`, `arrival`, `price`, and `deeplink`
- Frontend served by Express
- Error handling for missing input, empty results, and upstream API failures
- No payment processing
- No user data storage

## Project Structure

```text
client/      Frontend assets served by Express
server/      Express backend and API integration
render.yaml  Render deployment config
```

## Local Development

1. Install dependencies:

```bash
npm install --prefix server
```

2. Create a local env file:

```bash
cp server/.env.example server/.env
```

3. Edit `server/.env` and set your real RapidAPI key:

```env
RAPIDAPI_KEY=your_real_key_here
PORT=5050
```

4. Start the app from the repo root:

```bash
npm start
```

5. Open:

```text
http://localhost:5050
```

## GitHub

Create an empty GitHub repository, then from the repo root run:

```bash
git init
git add .
git commit -m "Initial flight search app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/caribbean-travel.git
git push -u origin main
```

## Render Deployment

This repo includes `render.yaml`, so Render can detect the service automatically.

1. Create a new Render `Web Service`
2. Connect the GitHub repository
3. Render will use:
   - Build command: `npm install --prefix server`
   - Start command: `npm --prefix server start`
4. Add environment variable:
   - `RAPIDAPI_KEY=your_real_key_here`
5. Deploy

## Notes

- Keep real keys out of GitHub
- `.gitignore` already excludes `.env` files and `node_modules`
- `flight-search.html` is a standalone local demo and is not part of the deployed Express app
