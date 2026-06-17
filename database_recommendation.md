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
