# Medico Overseas Backend Setup

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### 1. Submit Callback Request
**POST** `/api/callback`
```json
{
  "fullName": "Student Name",
  "phone": "+91XXXXXXXXXX",
  "email": "student@example.com",
  "city": "Mumbai",
  "country": "Russia",
  "neetScore": "650",
  "message": "Interested in MBBS abroad"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Callback request received successfully",
  "id": 1
}
```

### 2. Get All Callbacks
**GET** `/api/callbacks`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "callbacks": [
    {
      "id": 1,
      "fullName": "Student Name",
      "phone": "+91XXXXXXXXXX",
      "email": "student@example.com",
      "city": "Mumbai",
      "country": "Russia",
      "neetScore": "650",
      "message": "Interested in MBBS abroad",
      "createdAt": "2024-01-15 10:30:00",
      "status": "new"
    }
  ]
}
```

### 3. Update Callback Status
**PUT** `/api/callbacks/:id`
```json
{
  "status": "contacted"
}
```

**Status options:** `new`, `contacted`, `completed`, `rejected`

### 4. Health Check
**GET** `/api/health`

## Database

SQLite database file: `backend/callbacks.db`

**Table Schema:**
- `id` - Unique identifier
- `fullName` - Student/Parent name
- `phone` - Phone number
- `email` - Email address
- `city` - City name
- `country` - Country interested in
- `neetScore` - NEET score
- `message` - Additional message
- `createdAt` - Request timestamp
- `status` - Request status (new/contacted/completed/rejected)

## Environment Variables

Create a `.env` file in the `backend` directory:

```
PORT=3001
NODE_ENV=development
DATABASE_PATH=./callbacks.db
```

## Testing

Use Postman or curl to test endpoints:

```bash
# Test callback submission
curl -X POST http://localhost:3001/api/callback \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phone": "+919876543210",
    "email": "john@example.com",
    "city": "Delhi",
    "country": "Russia",
    "neetScore": "650",
    "message": "Interested in MBBS"
  }'

# Get all callbacks
curl http://localhost:3001/api/callbacks

# Test health
curl http://localhost:3001/api/health
```

## Troubleshooting

### Port already in use
Change the PORT in `.env` file to another port (e.g., 3002)

### Module not found
Make sure you ran `npm install` in the backend directory

### Database errors
Delete `callbacks.db` file and restart the server to recreate it

## Next Steps

1. Connect this backend to a frontend dashboard to manage callbacks
2. Add email notifications when callback requests arrive
3. Add authentication for admin dashboard
4. Integrate with CRM or email service
5. Add data export functionality (CSV/Excel)

---
For support or issues, contact the development team.
