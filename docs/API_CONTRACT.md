# AgriSphere - API Contract & Endpoints

## 🌐 Base URL
`http://localhost:5000/api/v1`

---

## 1. System Health Endpoint

### `GET /health`
Returns operational status of the REST backend.

#### Request Header
```http
Accept: application/json
```

#### Response Payload (`200 OK`)
```json
{
  "status": "ok",
  "service": "AgriSphere API",
  "version": "1.0.0",
  "timestamp": "2026-09-22T19:30:00.000Z",
  "environment": "development",
  "message": "AgriSphere REST API is operational."
}
```

---

## 2. Standard Error Payload Format

All API errors return a uniform structure:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human readable explanation"
  },
  "timestamp": "2026-09-22T19:30:00.000Z"
}
```

