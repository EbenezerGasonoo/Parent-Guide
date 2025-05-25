# Parent's Guide Backend

This is the Node.js + Express backend for the Parent's Guide application.

## Setup

1. Navigate to the `server/` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file with the following content:
   ```
   PORT=5000
   ```
4. Create an `uploads/` directory in the `server/` directory to store uploaded videos.

## Running the Server

Navigate to the `server/` directory and run:

```bash
node server.js
```

The server will run on http://localhost:5000.

## Endpoints

- `POST /upload`: Upload a video file (uses `multer`). Expects a file with the field name `video`.
- `GET /videos`: Lists the URLs of all uploaded `.mp4` videos.
- `GET /uploads/:filename`: Serves the uploaded video files statically. 