# Taskflow Web API

Backend API server for reading from the Taskflow SQLite database.

## Installation

```bash
npm install
```

## Database

The API connects to `~/.taskflow/taskflow.db` by default. You can override this with the `DB_PATH` environment variable.

## Development

Start the development server:

```bash
npm run dev
```

Start the API server:

```bash
npm run server
```

The API will be available at `http://localhost:3001`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id/features` | Get features for a project |
| GET | `/api/features/:id/tasks` | Get tasks for a feature |
| GET | `/api/tasks/:id` | Get full task details |
| GET | `/api/tasks/:id/history` | Get task history |
| GET | `/api/inbox` | Get inbox items |

## API Documentation

Visit `/api/docs` for interactive API documentation.

## Build

```bash
npm run build
npm run server:build
```
