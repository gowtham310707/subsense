# SubSense API Contract

All frontend API calls go through `src/services/api.js`.
Base URL is set via `REACT_APP_API_URL` in `.env` (default: `http://localhost:5000/api`).

---

## Auth
All protected routes need: `Authorization: Bearer <token>`

### POST /auth/register
Request:  `{ name, email, password, company? }`
Response: `{ token, user: { _id, name, email, role, company } }`

### POST /auth/login
Request:  `{ email, password }`
Response: `{ token, user: { _id, name, email, role, company } }`

### GET /auth/me
Response: `{ user: { _id, name, email, role, company } }`

---

## Subscriptions

### GET /subscriptions
Response: `{ subscriptions: [ ...Sub ] }`

### GET /subscriptions/stats
Response:
```json
{
  "totalMonthly": 356,
  "totalCount": 8,
  "categoryCount": 5,
  "avgScore": 67,
  "atRisk": 2,
  "renewingSoon": 3,
  "spendChange": "+4% from last month",
  "spendByCategory": [{ "name": "CRM", "amount": 120, "percentage": 34 }],
  "recentActivity": [{ "text": "HubSpot renewal in 3 days", "time": "Just now", "type": "warn" }]
}
```

### GET /subscriptions/:id
Response: `{ subscription: Sub }`

### POST /subscriptions
Request:  Sub object (see below)
Response: `{ subscription: Sub }`

### PUT /subscriptions/:id
Request:  Partial Sub
Response: `{ subscription: Sub }`

### DELETE /subscriptions/:id
Response: `{ message: "Deleted" }`

#### Sub Object Shape:
```json
{
  "_id": "...",
  "name": "Figma",
  "icon": "🎨",
  "category": "Design",
  "cost": 45,
  "currency": "₹ INR",
  "billing": "Monthly",
  "seats": 5,
  "usage": "High",
  "nextRenewal": "2026-06-15T00:00:00.000Z",
  "website": "https://figma.com",
  "notes": "Used by design team",
  "notify": true,
  "status": "active",
  "score": 92
}
```

---

## Admin

### GET /admin/stats
Response:
```json
{
  "totalUsers": 4,
  "activeUsers": 3,
  "totalSubscriptions": 8,
  "monthlyBudgetUsed": 356,
  "budgetBreakdown": [{ "name": "CRM", "spent": 120, "budget": 4000 }],
  "recentActivity": [{ "action": "Added Figma", "user": "Gowtham Kumar", "time": "Today", "type": "add" }]
}
```

### GET /admin/users
Response: `{ users: [ ...User ] }`

#### User Object Shape:
```json
{
  "_id": "...",
  "name": "Gowtham Kumar",
  "email": "gowtham@company.com",
  "role": "Admin",
  "status": "active",
  "createdAt": "2026-01-12T00:00:00.000Z"
}
```

### POST /admin/users/invite
Request:  `{ email, role }`
Response: `{ user: User }`

### PUT /admin/users/:id
Request:  `{ role?, status? }`
Response: `{ user: User }`

### DELETE /admin/users/:id
Response: `{ message: "Removed" }`

### GET /admin/logs
Response: `{ logs: [ ...Log ] }`

#### Log Object Shape:
```json
{
  "_id": "...",
  "action": "Added Figma subscription",
  "user": "Gowtham Kumar",
  "type": "add",
  "createdAt": "2026-06-01T09:41:00.000Z"
}
```

### GET /admin/settings
Response: `{ settings: { emailAlerts, slackAlerts, weeklyReport, twoFactor, dataRetention, currency } }`

### PUT /admin/settings
Request:  Settings object
Response: `{ settings: Settings }`

### GET /admin/export
Response: CSV file download
