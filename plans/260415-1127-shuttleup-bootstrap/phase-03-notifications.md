# Phase 3 — Notifications

## Priority: 🟡 High

## Overview

Async notification system using Bull Queue (Redis) with email and FCM push notification channels.

## Channels

| Channel | Target | Use Case |
|---------|--------|----------|
| Email (Resend/Nodemailer) | Hosts + registered users | Booking confirmations, session reminders |
| FCM Push | Mobile app users | Real-time booking alerts, reminders |
| Local Push | Web (Service Worker) | Browser notifications for web users |
| In-app | All | Notification center (bell icon) |

## Implementation Steps

1. Setup Bull Queue with Redis connection
2. Create NotificationModule with queue producer/consumer
3. Implement email channel (Resend API or Nodemailer + SMTP)
4. Implement FCM channel (Firebase Admin SDK)
5. Create notification templates
6. Implement in-app notification storage + read/unread
7. Add 1-hour-before reminder cron job

## Notification Events

| Event | Recipients | Channels |
|-------|-----------|----------|
| `booking.created` | Host | Email + Push + In-app |
| `booking.confirmed` | Booker | Email + Push |
| `booking.cancelled` | Host + Booker | Email + In-app |
| `session.reminder` | All participants | Push + Email |
| `session.cancelled` | All participants | Email + Push |
| `session.full` | Host | In-app |

## Todo

- [x] Bull Queue setup
- [x] NotificationModule (producer/consumer)
- [x] Email channel
- [x] FCM channel
- [x] Notification templates
- [x] In-app notifications (DB storage)
- [x] Reminder cron job

## Success Criteria

- Booking triggers email to host
- FCM push works on mobile
- In-app notifications with read/unread
- Async processing doesn't block API response
