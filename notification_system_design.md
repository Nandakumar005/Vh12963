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


