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



# Stage 3

## Analysis of Existing Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

### Is the Query Correct?

Yes. The query correctly retrieves all unread notifications for a specific student and sorts them by creation time.

### Why is it Slow?

The system contains approximately:

* 50,000 students
* 5,000,000 notifications

Without proper indexing, the database performs a full table scan to locate matching records. This requires examining a large number of rows before filtering by studentID and isRead.

The ORDER BY clause can further increase execution time because matching rows must be sorted before returning results.

### Estimated Computation Cost

Without indexes:

```text
Time Complexity: O(N)
```

Where:

```text
N = 5,000,000 notifications
```

The database may need to scan most or all rows.

---

## Optimized Solution

Create a composite index:

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

Optimized query:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

With the composite index, the database can directly locate unread notifications for the student and return them in sorted order.

### Expected Computation Cost

With indexing:

```text
Time Complexity: O(log N + K)
```

Where:

* N = total notifications
* K = notifications returned

This is significantly faster than a full table scan.

---

## Should We Add Indexes on Every Column?

No.

Adding indexes on every column is not a good practice.

### Problems with Excessive Indexing

1. Increased storage consumption.
2. Slower INSERT operations.
3. Slower UPDATE operations.
4. Slower DELETE operations.
5. Increased index maintenance overhead.

Indexes should only be created on:

* Frequently filtered columns.
* Frequently sorted columns.
* Columns used in JOIN conditions.

For this notification system, useful indexes include:

```sql
CREATE INDEX idx_notifications_student
ON notifications(studentID);

CREATE INDEX idx_notifications_student_read
ON notifications(studentID, isRead);

CREATE INDEX idx_notifications_created
ON notifications(createdAt);
```

---

## Query to Find Students Who Received Placement Notifications in the Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= CURRENT_DATE - INTERVAL '7 days';
```

### Explanation

* Filters only Placement notifications.
* Retrieves notifications created within the last 7 days.
* DISTINCT ensures each student appears only once.

### Recommended Index

```sql
CREATE INDEX idx_notifications_type_date
ON notifications(notificationType, createdAt);
```

This allows the database to efficiently filter by notification type and date range.

---

## Conclusion

The original query is logically correct but can become slow at scale because of full table scans and sorting overhead. A composite index on (studentID, isRead, createdAt) significantly improves performance by reducing lookup and sorting costs. Creating indexes on every column is not recommended because it increases storage requirements and slows write operations. Properly designed indexes should target commonly filtered and sorted columns only.



# Stage 4

## Problem Statement

Currently, notifications are fetched from the database every time a student loads a page. As the number of students and notifications increases, the database receives a large number of repeated read requests, resulting in higher latency, increased server load, and poor user experience.

---

## Proposed Solutions

### 1. Redis Caching

Store frequently accessed notifications and unread counts in Redis.

#### Flow

1. User requests notifications.
2. Application checks Redis cache.
3. If data exists, return cached result.
4. If data is not found, fetch from PostgreSQL and store in Redis.

#### Benefits

* Significantly reduces database load.
* Faster response times.
* Improves user experience.

#### Trade-offs

* Additional infrastructure required.
* Cache invalidation must be handled correctly.
* Slight increase in memory usage.

---

### 2. WebSockets for Real-Time Notifications

Instead of requesting notifications on every page load, maintain a persistent WebSocket connection.

#### Flow

1. User connects through WebSocket.
2. New notifications are pushed instantly.
3. Frontend updates the notification list without polling.

#### Benefits

* Eliminates repeated API calls.
* Provides real-time updates.
* Reduces unnecessary database traffic.

#### Trade-offs

* More complex implementation.
* Requires connection management.
* Increased server memory for active connections.

---

### 3. Pagination

Fetch notifications in smaller batches.

Example:

```http
GET /api/v1/notifications?page=1&limit=20
```

#### Benefits

* Reduces data transferred per request.
* Faster query execution.
* Lower memory consumption.

#### Trade-offs

* Users must load additional pages for older notifications.

---

### 4. Read Replicas

Use read replicas to distribute read traffic.

#### Benefits

* Reduces load on the primary database.
* Improves scalability.
* Better performance during peak usage.

#### Trade-offs

* Additional infrastructure cost.
* Replication lag may occur.

---

### 5. Notification Archiving

Move old notifications to archive tables.

#### Benefits

* Keeps active tables small.
* Improves query performance.
* Reduces index size.

#### Trade-offs

* Archived data retrieval becomes slightly slower.

---

## Recommended Architecture

The most effective solution is a combination of:

1. PostgreSQL as the primary database.
2. Redis for caching notifications and unread counts.
3. WebSockets for real-time delivery.
4. Pagination for notification history.
5. Read replicas for large-scale deployments.

This approach minimizes database load, improves response times, supports real-time updates, and provides a scalable architecture capable of handling millions of notifications and thousands of concurrent users.

---

## Conclusion

Fetching notifications on every page load is inefficient and does not scale well. By combining Redis caching, WebSockets, pagination, read replicas, and notification archiving, the platform can significantly reduce database load while providing a fast and responsive user experience.

