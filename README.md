# TSE App — Local Setup & MongoDB

This project uses MongoDB via mongoose. Follow these steps to run locally:

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file

Copy `.env.example` to `.env` and adjust `MONGODB_URI` if needed.

3. Start MongoDB locally (if you plan to use the default URI)

macOS using Homebrew:

```bash
brew services start mongodb-community@6.0
```

Or run a Docker container:

```bash
docker run -d -p 27017:27017 --name mongo mongo:6.0
```

4. Run the app

```bash
npm start
```

Notes
- The app will use `MONGODB_URI` from environment if set, otherwise it falls back to `mongodb://127.0.0.1:27017/tse4`.
- The connection is initialized in `models/db.js` and required early from `app.js`.
# Deploy to Render

You can host this app on Render using the GitHub repository. Follow these steps:

1. Push your code to GitHub (already done):

```bash
git push origin main
```

2. Go to https://dashboard.render.com and create a new "Web Service".

3. Connect your GitHub account and select the `Dongarilingababu/campus-market-exchange` repository.

4. When configuring the service, Render will detect `render.yaml` in the repo and use it. If you prefer manual setup, set:
	- Build command: `npm install`
	- Start command: `npm start`
	- Environment: `Node`

5. Important: Add environment variables in the Render dashboard:
	- `MONGODB_URI` — your MongoDB connection string (e.g., from MongoDB Atlas)
	- `NODE_ENV=production` (optional)

6. Deploy. Render will build and start your app. Check logs on the Render dashboard for any runtime errors.

Notes
- Keep secrets like `MONGODB_URI` in Render's environment variables (not committed to the repo).
- If your app expects a specific port, Render provides the `PORT` env var which Express uses by default when `process.env.PORT` is read.
# campus-market-exchange
