# ShuttleUp 🏸 — Product Requirements Document

> **Phiên bản:** 1.0  
> **Cập nhật:** Tháng 3, 2026  
> **Tác giả:** Solo Developer  
> **Trạng thái:** Pre-development

---

## Mục lục

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Bối cảnh & Vấn đề](#2-bối-cảnh--vấn-đề)
3. [Người dùng mục tiêu](#3-người-dùng-mục-tiêu)
4. [Tính năng MVP](#4-tính-năng-mvp)
5. [Use Case Diagram](#5-use-case-diagram)
6. [Workflow chính](#6-workflow-chính)
7. [Kiến trúc hệ thống](#7-kiến-trúc-hệ-thống)
8. [Tech Stack](#8-tech-stack)
9. [Database Schema](#9-database-schema)
10. [API Endpoints (tổng quan)](#10-api-endpoints-tổng-quan)
11. [Estimate & Lộ trình](#11-estimate--lộ-trình)
12. [Rủi ro & Mitigation](#12-rủi-ro--mitigation)

---

## 1. Tổng quan dự án

| Mục | Chi tiết |
|-----|----------|
| **Tên sản phẩm** | ShuttleUp |
| **Tagline** | Tìm bạn chơi cầu lông — nhanh, đúng trình, gần nhà |
| **Nền tảng** | Web (Next.js) + Mobile (Flutter) |
| **Phạm vi** | Toàn quốc Việt Nam, bắt đầu từ TP.HCM |
| **Mục tiêu dự án** | Portfolio cá nhân + tiềm năng phát triển thành sản phẩm thật |
| **Kiểu phát triển** | Solo developer với AI support |

---

## 2. Bối cảnh & Vấn đề

### 2.1 Hiện trạng

Cộng đồng cầu lông ở Việt Nam hiện đang tổ chức qua các **Facebook Group phân mảnh** theo từng quận/huyện (nhóm cầu lông Quận 2, Quận 4, Thủ Đức...). Điều này tạo ra hai pain point rõ ràng:

### 2.2 Pain Points

**Góc độ Host (người tổ chức sân):**
- Phải đăng bài lên nhiều group khác nhau thủ công
- Không phải group nào cũng được chấp nhận đăng bài
- Khó quản lý số lượng người đăng ký, dễ bị overbooking
- Không có công cụ tái sử dụng cho lịch cố định hàng tuần

**Góc độ Vãng lai (người tham gia):**
- Phải theo dõi nhiều group → newsfeed cá nhân bị spam
- Thông tin không chuẩn hóa, khó lọc theo trình độ / giờ / khu vực
- Không biết trước trình độ của host/người chơi khác
- Không có cơ chế đặt chỗ chính thức → dễ bị ghost

### 2.3 Giải pháp

ShuttleUp là **nền tảng tập trung duy nhất** kết nối host và vãng lai cầu lông, với tính năng tìm kiếm thông minh, quản lý slot, và thanh toán đặt cọc để loại bỏ ghost.

---

## 3. Người dùng mục tiêu

### Actor 1 — Host
- Người thuê sân cố định hoặc theo buổi
- Cần tuyển thêm người để đủ chi phí sân
- Pain: mất thời gian đăng bài nhiều nơi, khó quản lý đăng ký

### Actor 2 — Vãng lai
- Người muốn chơi cầu lông nhưng không có sân/nhóm cố định
- Tìm buổi chơi theo tiêu chí: khu vực, giờ, trình độ, giá, loại lông
- Pain: thông tin tràn lan, không có chỗ đặt chỗ chính thức

> **Lưu ý quan trọng:** Một tài khoản có thể vừa là host vừa là vãng lai tùy từng buổi. Role được xác định theo context, không cố định.

---

## 4. Tính năng MVP

### Phase 1 — Web MVP Core (Tuần 1–20)

| # | Tính năng | Mô tả | Actor |
|---|-----------|-------|-------|
| F01 | Xác thực người dùng | Đăng ký/đăng nhập qua Google OAuth hoặc SĐT | Cả hai |
| F02 | Hồ sơ & trình độ | Tự chọn trình độ + host xác nhận sau buổi | Cả hai |
| F03 | Đăng buổi chơi | Tạo buổi lẻ: ngày, giờ, sân, số slot, giá, loại lông | Host |
| F04 | Lịch cố định hàng tuần | Tạo lịch lặp lại theo RRULE (thứ/giờ cố định) | Host |
| F05 | Quản lý buổi | Duyệt, hủy, cập nhật thông tin buổi chơi | Host |
| F06 | Tìm kiếm & lọc | Lọc theo khu vực, giờ, trình độ, giá, loại lông, đơn/đôi | Vãng lai |
| F07 | Đăng ký tham gia | 1-tap đăng ký, hỗ trợ duyệt tự động & thủ công | Vãng lai |
| F08 | Thanh toán đặt cọc | VNPay/MoMo, giữ chỗ tạm thời, hoàn cọc tự động khi bị reject | Cả hai |
| F09 | Thông báo real-time | Push notification + Zalo OA khi có người đăng ký/được duyệt | Cả hai |

### Phase 2 — Mobile + Nâng cao (Tuần 21–30)

| # | Tính năng | Mô tả |
|---|-----------|-------|
| F10 | Flutter Mobile App | Toàn bộ flow MVP trên iOS & Android |
| F11 | In-app chat | Nhắn tin giữa host và vãng lai trong buổi |
| F12 | Rating & ELO | Đánh giá sau buổi, tính ELO tích lũy |
| F13 | Bản đồ sân gần tôi | Hiển thị buổi chơi theo vị trí GPS |

### Phase 3 — Scale (Sau tuần 34)

| # | Tính năng |
|---|-----------|
| F14 | Tìm đối / tìm đôi (kết nối 1-1) |
| F15 | Mini giải đấu trong cộng đồng |
| F16 | Đặt sân tích hợp (liên kết hệ thống sân) |
| F17 | Dashboard thống kê cho host |

---

## 5. Use Case Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   ShuttleUp System                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Shared (cả hai actor)                  │    │
│  │  ○ Đăng ký / Đăng nhập                           │    │
│  │  ○ Quản lý hồ sơ & trình độ                     │    │
│  │  ○ Thanh toán / đặt cọc                          │    │
│  │  ○ Nhắn tin trong ứng dụng                      │    │
│  │  ○ Đánh giá sau buổi chơi                       │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────┐    ┌──────────────────────────┐    │
│  │   Host only     │    │      Vãng lai only        │    │
│  │                 │    │                           │    │
│  │ ○ Đăng buổi    │    │ ○ Tìm kiếm & lọc buổi   │    │
│  │ ○ Lịch cố định │    │ ○ Đăng ký tham gia buổi  │    │
│  │ ○ Duyệt/hủy    │    │                           │    │
│  │ ○ Xác nhận     │    │                           │    │
│  │   trình độ     │    │                           │    │
│  └─────────────────┘    └──────────────────────────┘    │
│                                                         │
│  [System] ──── Gửi thông báo tự động (dashed)          │
└─────────────────────────────────────────────────────────┘

[Vãng Lai] ──── Shared + Vãng lai only
[Host]     ──── Shared + Host only
[System]   ──── Notification tự động
```

---

## 6. Workflow chính

### 6.1 Host đăng buổi chơi

```
Host điền thông tin
        │
        ▼
   Buổi lẻ? ──── Cố định (weekly)
        │                │
        ▼                ▼
  Tạo 1 buổi    Tạo lịch RRULE
        │                │
        └────────┬────────┘
                 ▼
          Lưu vào DB
                 │
                 ▼
   System gửi thông báo ──► Push + Zalo OA tới user phù hợp
                 │
                 ▼
   Buổi hiện trên feed / map
                 │
                 ▼
   Vãng lai đăng ký tham gia
                 │
        ┌────────┴────────┐
        ▼                 ▼
  Tự động duyệt     Host duyệt tay
  (slot -1, notify)  (Accept/Reject + notify)
        │                 │
        └────────┬────────┘
                 ▼
   Đủ slot → buổi tự động đóng
```

### 6.2 Vãng lai tìm & tham gia buổi

```
Mở app, nhập bộ lọc
(khu vực, giờ, trình độ, giá, loại lông)
        │
        ▼
Xem danh sách buổi phù hợp
        │
        ▼
Xem chi tiết & chọn buổi
        │
        ▼
  Còn chỗ? ──── Hết chỗ ──► Đặt lịch nhận thông báo
        │
        ▼
Thanh toán đặt cọc (VNPay/MoMo)
        │
        ▼
  Chế độ duyệt?
        │
   ┌────┴────┐
   ▼         ▼
Tự động    Chờ host duyệt
Xác nhận   (tiền giữ tạm)
ngay            │
   │       ┌───┴───┐
   │       ▼       ▼
   │    Accept   Reject
   │       │       │
   │       │    Hoàn cọc
   │       │    tự động
   └───────┤
           ▼
   Tham gia buổi chơi
   (nhận reminder 1h trước)
```

---

## 7. Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Next.js Web  │  │ Flutter App  │  │ Admin Dashboard  │   │
│  │   (Vercel)   │  │ iOS/Android  │  │   (Next.js)      │   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘   │
└─────────┼────────────────┼───────────────────┼─────────────┘
          │          HTTPS / WebSocket          │
          └────────────────┼───────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              NestJS API Gateway (Railway)                    │
│         Auth Guard · Rate Limiting · Routing                 │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND MODULES (Modular Monolith)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌───────────┐  │
│  │Auth/User │ │ Session  │ │   Booking    │ │  Notif.   │  │
│  │JWT·OAuth │ │CRUD·Slot │ │  & Payment   │ │Bull Queue │  │
│  └──────────┘ └──────────┘ └──────────────┘ └───────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐               │
│  │ Search   │ │  Chat    │ │  Rating/ELO  │               │
│  │PostGIS   │ │WebSocket │ │ Post-session │               │
│  └──────────┘ └──────────┘ └──────────────┘               │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ PostgreSQL   │  │    Redis     │  │  Cloudinary/S3   │   │
│  │ Primary DB   │  │ Cache·Lock   │  │  Images/Media    │   │
│  │ Prisma ORM   │  │ Bull Queue   │  │                  │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ VNPay/MoMo   │  │ Zalo OA+FCM  │  │ Google Maps API  │   │
│  │Webhook·Refund│  │Push·Message  │  │Geocoding·Nearby  │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Lý do chọn Modular Monolith

- Solo dev → microservices giết productivity trước khi có user đầu tiên
- NestJS module boundary rõ ràng → tách microservice sau dễ dàng
- Một repo, một deploy, một process — dễ debug và maintain
- Notification module chạy async qua Bull Queue (Redis) → không block main thread

---

## 8. Tech Stack

### Frontend — Web
| Công nghệ | Lý do chọn |
|-----------|------------|
| Next.js 14 (App Router) | SSR cho SEO, dev đã biết, Vercel deploy 1-click |
| TypeScript | Type-safe, giảm bug khi solo dev |
| Tailwind CSS + shadcn/ui | Styling nhanh, design system sẵn có |
| NextAuth.js | Auth dễ setup với Google OAuth |

### Frontend — Mobile
| Công nghệ | Lý do chọn |
|-----------|------------|
| Flutter | Dev đã biết, iOS + Android một codebase |
| Riverpod | State management chuẩn, dễ maintain |
| Dio + Retrofit | HTTP client type-safe cho Flutter |

### Backend
| Công nghệ | Lý do chọn |
|-----------|------------|
| NestJS | TypeScript backend, structure module rõ ràng |
| Prisma ORM | Type-safe query, migration dễ dàng |
| Bull Queue | Async job cho notification, powered by Redis |
| Socket.io | WebSocket cho real-time chat & notification |

### Database & Infrastructure
| Công nghệ | Lý do chọn |
|-----------|------------|
| PostgreSQL + PostGIS | Relational + geo search cho tính năng tìm sân gần |
| Redis | Cache, slot lock atomic, Bull Queue backend |
| Railway | Deploy NestJS + PostgreSQL + Redis, free tier tốt |
| Vercel | Deploy Next.js, CDN global, free tier mạnh |
| GitHub Actions | CI/CD tự động test & deploy mỗi push |
| Sentry | Error monitoring production |

### Third-party (Việt Nam specific)
| Dịch vụ | Mục đích |
|---------|---------|
| VNPay / MoMo | Thanh toán & đặt cọc nội địa |
| Zalo OA API | Notification phù hợp thị trường VN |
| Firebase Cloud Messaging | Push notification cho Flutter |
| Google Maps API | Geocoding + tìm sân gần |

---

## 9. Database Schema

### Các bảng chính

**USERS**
```
id (uuid, PK) | full_name | phone | email | avatar_url
skill_level | elo_score | zalo_id | is_verified | created_at
```

**COURTS**
```
id (uuid, PK) | name | address | lat | lng
district | city | court_type | images | created_at
```

**SESSIONS**
```
id (uuid, PK) | host_id (FK→users) | court_id (FK→courts)
start_time | end_time | total_slots | booked_slots
price_per_person | skill_required | shuttle_type | play_type
status | is_recurring | recurrence_rule (RRULE)
approval_mode (auto/manual) | created_at
```

**BOOKINGS**
```
id (uuid, PK) | session_id (FK) | user_id (FK)
status | amount_paid | booked_at | cancelled_at | cancel_reason
```
> Status flow: `pending_payment` → `pending_approval` → `confirmed` → `attended` / `cancelled`

**PAYMENTS**
```
id (uuid, PK) | booking_id (FK) | provider | provider_tx_id
amount | currency | type (deposit/full/refund)
status | metadata (jsonb) | created_at
```

**PAYMENT_LOGS**
```
id (uuid, PK) | payment_id (FK) | event | payload (jsonb) | logged_at
```

**RATINGS**
```
id (uuid, PK) | session_id (FK) | rater_id (FK) | ratee_id (FK)
score | comment | role_of_rater | created_at
```

**SKILL_CONFIRMATIONS**
```
id (uuid, PK) | session_id (FK) | confirmer_id (FK)
target_user_id (FK) | confirmed_level | created_at
```

**NOTIFICATIONS**
```
id (uuid, PK) | user_id (FK) | type | title | body
data (jsonb) | is_read | channel | sent_at
```

**MESSAGES**
```
id (uuid, PK) | session_id (FK) | sender_id (FK)
content | type | sent_at
```

### Quan hệ chính
```
USERS      ||--o{ SESSIONS           : "hosts"
COURTS     ||--o{ SESSIONS           : "used in"
SESSIONS   ||--o{ BOOKINGS           : "has"
USERS      ||--o{ BOOKINGS           : "makes"
BOOKINGS   ||--o{ PAYMENTS           : "triggers"
PAYMENTS   ||--o{ PAYMENT_LOGS       : "logged in"
SESSIONS   ||--o{ RATINGS            : "after"
SESSIONS   ||--o{ SKILL_CONFIRMATIONS: "source"
SESSIONS   ||--o{ MESSAGES           : "has"
```

### Index quan trọng
```sql
-- Geo search
CREATE INDEX idx_courts_location ON courts USING GIST (ll_to_earth(lat, lng));

-- Feed query
CREATE INDEX idx_sessions_time_status ON sessions (start_time, status);

-- Booking lookup
CREATE INDEX idx_bookings_user ON bookings (user_id, status);

-- Unread notifications
CREATE INDEX idx_notif_unread ON notifications (user_id, is_read)
  WHERE is_read = false;
```

---

## 10. API Endpoints (tổng quan)

### Auth
```
POST /auth/register          Đăng ký tài khoản mới
POST /auth/login             Đăng nhập (SĐT + OTP)
POST /auth/google            Google OAuth callback
POST /auth/refresh           Refresh JWT token
DELETE /auth/logout          Đăng xuất
```

### Users
```
GET  /users/me               Lấy profile hiện tại
PUT  /users/me               Cập nhật profile
GET  /users/:id              Xem profile người khác
GET  /users/:id/sessions     Lịch sử buổi chơi
```

### Courts
```
GET  /courts                 Danh sách sân (có filter)
POST /courts                 Thêm sân mới
GET  /courts/:id             Chi tiết sân
```

### Sessions
```
GET  /sessions               Feed buổi chơi (filter: location, time, skill, price)
POST /sessions               Tạo buổi mới
GET  /sessions/:id           Chi tiết buổi
PUT  /sessions/:id           Cập nhật buổi (host only)
DELETE /sessions/:id         Hủy buổi (host only)
GET  /sessions/nearby        Buổi gần vị trí hiện tại
```

### Bookings
```
POST /bookings               Đăng ký tham gia buổi
GET  /bookings/my            Danh sách booking của tôi
PUT  /bookings/:id/approve   Host duyệt booking
PUT  /bookings/:id/reject    Host từ chối booking
DELETE /bookings/:id         Hủy booking (vãng lai)
```

### Payments
```
POST /payments/initiate      Khởi tạo thanh toán (trả về redirect URL)
POST /payments/webhook       Nhận callback từ VNPay/MoMo
GET  /payments/:id           Chi tiết transaction
POST /payments/:id/refund    Hoàn tiền thủ công (admin)
```

### Notifications
```
GET  /notifications          Danh sách thông báo
PUT  /notifications/:id/read Đánh dấu đã đọc
PUT  /notifications/read-all Đánh dấu tất cả đã đọc
```

### Ratings
```
POST /ratings                Gửi đánh giá sau buổi
GET  /ratings/session/:id    Đánh giá của một buổi
```

---

## 11. Estimate & Lộ trình

### Giả định
- **Thời gian:** 1–2 giờ/ngày (buổi tối sau giờ làm) ≈ 10 giờ/tuần
- **Kinh nghiệm:** Lần đầu làm dự án fullstack cá nhân
- **Mục tiêu UI:** Portfolio-grade, đủ đẹp để xin việc
- **Hỗ trợ:** AI coding assistant

### Breakdown theo module (Phase 1 — Web MVP)

| Module | Giờ ước tính | Tuần |
|--------|-------------|------|
| Project setup & DevOps | 12h | 1–2 |
| Auth & User profile | 16h | 3–4 |
| Database & Prisma schema | 10h | 1–2 |
| Session CRUD + Recurring logic | 24h | 5–7 |
| Search & Filter (PostGIS) | 16h | 8–9 |
| Booking flow + State machine | 20h | 10–11 |
| Payment (VNPay/MoMo + Webhook) | 28h | 12–14 |
| Notification (Bull + FCM + Zalo) | 16h | 15–16 |
| Web UI/UX (portfolio-grade) | 40h | 17–20 |
| Testing & Bug fix | 20h | 17–20 |
| **Subtotal Phase 1** | **202h** | **20 tuần** |

### Phase 2 — Mobile + Nâng cao

| Module | Giờ ước tính | Tuần |
|--------|-------------|------|
| Flutter Mobile App (full MVP flow) | 60h | 21–25 |
| In-app Chat (WebSocket) | 20h | 26–27 |
| Rating & ELO system | 16h | 28–29 |
| Map view + Google Maps | 12h | 29–30 |
| **Subtotal Phase 2** | **108h** | **10 tuần** |

### Phase 3 — Polish & Launch

| Module | Giờ ước tính | Tuần |
|--------|-------------|------|
| Performance & Lighthouse | 8h | 31–32 |
| App Store preparation | 6h | 32–33 |
| Portfolio README & Case study | 10h | 33–34 |
| **Subtotal Phase 3** | **24h** | **4 tuần** |

### Tổng kết

| | Giờ | Thời gian |
|-|-----|-----------|
| **Phase 1 — Web MVP** | 202h | 20 tuần (~5 tháng) |
| **Phase 2 — Mobile** | 108h | 10 tuần (~2.5 tháng) |
| **Phase 3 — Launch** | 24h | 4 tuần (~1 tháng) |
| **TỔNG** | **334h** | **~34 tuần (~8.5 tháng)** |

> ⚠️ Buffer 20% đã tính vào từng module. Con số này thực tế cho solo dev lần đầu, không phải con số lý tưởng.

### Milestones

| Milestone | Thời điểm | Deliverable |
|-----------|-----------|-------------|
| 🏁 M1 — Web MVP live | Tuần 20 | Next.js app deploy, full booking flow |
| 🏁 M2 — Mobile live | Tuần 30 | Flutter app trên TestFlight/Play Store |
| 🏁 M3 — Portfolio launch | Tuần 34 | README, case study, demo video |

---

## 12. Rủi ro & Mitigation

| Rủi ro | Mức độ | Mitigation |
|--------|--------|------------|
| **Payment integration stuck** | Cao | Đăng ký merchant VNPay/MoMo từ tuần 1, song song với setup |
| **Zalo OA approval chậm** | Trung bình | Nộp đơn sớm, dùng FCM làm fallback |
| **Scope creep** | Cao | Mọi feature mới → vào backlog, không vào Phase 1 |
| **Motivation dip (tuần 8–12)** | Trung bình | 1 buổi/tuần làm UI để thấy progress trực quan |
| **Slot overbooking** | Cao | Redis atomic lock + Prisma transaction |
| **Ghost (không đến sau booking)** | Trung bình | Đặt cọc bắt buộc + hoàn cọc có điều kiện |
| **PostGIS geo query chậm** | Thấp | Index GiST từ đầu, cache kết quả nearby 5 phút |

---

## Ghi chú cho Portfolio

Khi dự án hoàn thành, README trên GitHub nên bao gồm:

1. **Problem statement** — tại sao xây dự án này (câu chuyện thực tế)
2. **Architecture diagram** — system architecture với mô tả ngắn gọn
3. **Tech stack** — lý do chọn từng công nghệ
4. **Key challenges** — 3 thách thức kỹ thuật khó nhất và cách giải quyết
5. **Demo** — video walkthrough hoặc link live demo
6. **Lessons learned** — những gì học được khi làm solo fullstack

---

*Tài liệu này được tổng hợp qua 6 sessions phân tích với AI Product Analyst.*  
*Phiên bản tiếp theo sẽ bao gồm: API spec chi tiết, Payment state machine, và UI wireframes.*
