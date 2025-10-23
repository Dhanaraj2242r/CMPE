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
# campus-market-exchange
