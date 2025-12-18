# API Test URLs

## Menu API Endpoint

### Current Configuration
- **Base URL:** `http://192.168.29.104:8080/api/v1`
- **Menu Endpoint:** `/public/menu`

### Complete URLs for Testing

#### 1. **Menu List (All Categories)**
```
http://192.168.29.104:8080/api/v1/public/menu
```

#### 2. **Specific Menu Item (replace {itemId} with actual ID)**
```
http://192.168.29.104:8080/api/v1/public/menu/items/{itemId}
```

### Test in Browser

**Open in Browser:**
```
http://192.168.29.104:8080/api/v1/public/menu
```

Should return JSON like:
```json
{
  "success": true,
  "message": "Menu retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Chapati's",
      "description": "...",
      "items": [
        {
          "id": 1,
          "name": "Tandoori Chapati",
          "price": 10.0,
          ...
        }
      ]
    }
  ]
}
```

### Test with curl (PowerShell)
```powershell
Invoke-WebRequest -Uri "http://192.168.29.104:8080/api/v1/public/menu" -Method GET | Select-Object StatusCode, Content
```

### Test with curl (Command Prompt)
```cmd
curl http://192.168.29.104:8080/api/v1/public/menu
```

### Test from React Native App
The app automatically calls:
```
GET http://192.168.29.104:8080/api/v1/public/menu
```

### Alternative URLs (if using different setup)

#### Android Emulator:
```
http://10.0.2.2:8080/api/v1/public/menu
```

#### iOS Simulator:
```
http://localhost:8080/api/v1/public/menu
```

#### Physical Device (if IP changed):
1. Find your IP: `ipconfig` (Windows)
2. Replace IP in URL: `http://YOUR_IP:8080/api/v1/public/menu`

## Quick Test Checklist

- [ ] Backend is running on port 8080
- [ ] Backend URL is accessible
- [ ] Menu endpoint returns JSON
- [ ] Response has `success: true`
- [ ] Response `data` contains menu categories
- [ ] Categories have `items` array
- [ ] Items have `name` and `price` fields

## Troubleshooting

### Connection Refused
- Check if backend is running: `netstat -an | findstr :8080`
- Start backend: `cd backend && mvn spring-boot:run`

### Wrong IP Address
- Check your IP: `ipconfig | findstr IPv4`
- Update `src/config/api.js` with correct IP

### CORS Error
- Backend has CORS enabled for `/api/v1/public/**`
- Should work from browser/app

---

**Current API Base URL:** `http://192.168.29.104:8080/api/v1`
**Menu Endpoint:** `http://192.168.29.104:8080/api/v1/public/menu`

