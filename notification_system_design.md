# Notification System Design

## Overview

This document defines the REST API contract and structure for a notification platform that displays notifications to authenticated users in real time.


---

# Supported actions.

1. Create Notification
2. Get User Notifications
3. Get Notification by ID
4. Mark Notification as Read
5. Mark All Notifications as Read
6. Delete Notification
7. Get Unread Notification Count
8. Real-Time Notification Delivery

---

# Base URL

```http
/api/v1
```

---

# Authentication

All endpoints require authentication.

## Request Header

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
```

---

# Notification Object Schema

```json
{
  "id": "notif_123456",
  "userId": "user_101",
  "title": "Appointment Reminder",
  "message": "Your appointment is scheduled for tomorrow at 10:00 AM.",
  "type": "REMINDER",
  "priority": "MEDIUM",
  "isRead": false,
  "createdAt": "2026-06-17T10:30:00Z",
  "readAt": null,
  "metadata": {
    "appointmentId": "appt_001"
  }
}
```

---

# 1. Create Notification

Used by internal services to generate notifications.

## Endpoint

```http
POST /api/v1/notifications
```

## Request Body

```json
{
  "userId": "user_101",
  "title": "Prescription Refill Reminder",
  "message": "Your prescription refill is due in 3 days.",
  "type": "REMINDER",
  "priority": "HIGH",
  "metadata": {
    "prescriptionId": "pres_1001"
  }
}
```

## Success Response

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "notif_123456",
    "userId": "user_101",
    "title": "Prescription Refill Reminder",
    "message": "Your prescription refill is due in 3 days.",
    "type": "REMINDER",
    "priority": "HIGH",
    "isRead": false,
    "createdAt": "2026-06-17T10:30:00Z"
  }
}
```

---

# 2. Get User Notifications

Returns  notifications for the logged-in user.

## Endpoint

```http
GET /api/v1/notifications
```

## Query Parameters

```http
?page=1
&limit=20
&isRead=false
&type=REMINDER
```

## Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "page": 1,
  "limit": 20,
  "total": 125,
  "data": [
    {
      "id": "notif_123456",
      "title": "Prescription Refill Reminder",
      "message": "Your prescription refill is due in 3 days.",
      "type": "REMINDER",
      "priority": "HIGH",
      "isRead": false,
      "createdAt": "2026-06-17T10:30:00Z"
    }
  ]
}
```

---

# 3. Get Notification By ID

## Endpoint

```http
GET /api/v1/notifications/{notificationId}
```

## Example

```http
GET /api/v1/notifications/notif_123456
```

## Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "notif_123456",
    "title": "Prescription Refill Reminder",
    "message": "Your prescription refill is due in 3 days.",
    "type": "REMINDER",
    "priority": "HIGH",
    "isRead": false,
    "createdAt": "2026-06-17T10:30:00Z"
  }
}
```

---

# 4. Mark Notification As Read

## Endpoint

```http
PATCH /api/v1/notifications/{notificationId}/read
```

## Request Body

```json
{}
```

## Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

# 5. Mark All Notifications As Read

## Endpoint

```http
PATCH /api/v1/notifications/read-all
```

## Request Body

```json
{}
```

## Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

# 6. Delete Notification

## Endpoint

```http
DELETE /api/v1/notifications/{notificationId}
```

## Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

# 7. Get Unread Notification Count

Used to display badge counts in the UI.

## Endpoint

```http
GET /api/v1/notifications/unread-count
```

## Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "count": 7
}
```

---

# Error Response Format

All APIs return errors in a consistent structure.

## Example

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Required field userId is missing"
  }
}
```

---

# Real-Time Notification Mechanism

To provide instant updates without page refreshes, the system uses WebSockets.

## Connection Endpoint

```http
GET /api/v1/notifications/stream
```

### WebSocket Headers

```http
Authorization: Bearer <jwt_token>
```

### Event Structure

```json
{
  "event": "notification.created",
  "data": {
    "id": "notif_123456",
    "title": "Prescription Refill Reminder",
    "message": "Your prescription refill is due in 3 days.",
    "type": "REMINDER",
    "priority": "HIGH",
    "createdAt": "2026-06-17T10:30:00Z"
  }
}
```

### Frontend Flow

1. User logs in.
2. Frontend opens WebSocket connection.
3. Backend authenticates token.
4. New notifications are pushed instantly.
5. UI updates notification list and unread badge count in real time.

---

# Recommended Database Schema

```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "message": "string",
  "type": "string",
  "priority": "LOW | MEDIUM | HIGH",
  "isRead": "boolean",
  "createdAt": "datetime",
  "readAt": "datetime",
  "metadata": "json"
}
```

---

# API Naming Conventions

| Action              | Method    | Endpoint                    |
| ------------------- | --------- | --------------------------- |
| Create Notification | POST      | /notifications              |
| Get Notifications   | GET       | /notifications              |
| Get Notification    | GET       | /notifications/{id}         |
| Mark Read           | PATCH     | /notifications/{id}/read    |
| Mark All Read       | PATCH     | /notifications/read-all     |
| Delete Notification | DELETE    | /notifications/{id}         |
| Unread Count        | GET       | /notifications/unread-count |
| Real-Time Stream    | WebSocket | /notifications/stream       |

---


# Stage 2

## Database Choice

PostgreSQL is the recommended database for this notification platform.

### Why PostgreSQL?

* Notifications have a structured schema.
* PostgreSQL provides ACID compliance for reliable data storage.
* Supports indexing for fast notification retrieval.
* Supports JSONB fields for flexible metadata storage.
* Can scale using partitioning and read replicas.

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Indexes

```sql
CREATE INDEX idx_notifications_user
ON notifications(user_id);

CREATE INDEX idx_notifications_user_read
ON notifications(user_id, is_read);

CREATE INDEX idx_notifications_created
ON notifications(created_at DESC);
```

---

## SQL Queries for Stage 1 APIs

### Create Notification

```sql
INSERT INTO notifications (
    id,
    user_id,
    title,
    message,
    type,
    priority,
    metadata
)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
);
```

### Get User Notifications

```sql
SELECT *
FROM notifications
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2
OFFSET $3;
```

### Get Notification By ID

```sql
SELECT *
FROM notifications
WHERE id = $1;
```

### Mark Notification As Read

```sql
UPDATE notifications
SET
    is_read = TRUE,
    read_at = CURRENT_TIMESTAMP
WHERE id = $1;
```

### Mark All Notifications As Read

```sql
UPDATE notifications
SET
    is_read = TRUE,
    read_at = CURRENT_TIMESTAMP
WHERE user_id = $1
AND is_read = FALSE;
```

### Delete Notification

```sql
DELETE FROM notifications
WHERE id = $1;
```

### Get Unread Notification Count

```sql
SELECT COUNT(*) AS unread_count
FROM notifications
WHERE user_id = $1
AND is_read = FALSE;
```

---

## Scaling Challenges and Solutions

### 1. Large Notification Volume

**Problem:** Millions of notifications can slow down queries.

**Solution:**

* Create indexes on frequently searched columns.
* Use pagination.
* Archive old notifications.

### 2. Slow Read Performance

**Problem:** Frequent notification requests increase database load.

**Solution:**

* Use Redis caching.
* Use read replicas.

### 3. Large Table Size

**Problem:** Notification tables become extremely large over time.

**Solution:**

* Partition tables by month or year.

Example:

```sql
CREATE TABLE notifications_2026
PARTITION OF notifications
FOR VALUES FROM ('2026-01-01')
TO ('2027-01-01');
```

### 4. Real-Time Delivery Load

**Problem:** Constant polling creates unnecessary traffic.

**Solution:**

* Use WebSockets for push-based notifications.

### 5. High Availability

**Problem:** Database failure causes downtime.

**Solution:**

* Configure replication.
* Maintain automated backups.
* Use failover servers.

---

## Conclusion

PostgreSQL is the preferred database because it provides reliability, strong consistency, indexing support, JSON storage capabilities, and scalability. With indexing, caching, partitioning, and WebSocket-based delivery, the notification system can efficiently support large numbers of users and notifications.
