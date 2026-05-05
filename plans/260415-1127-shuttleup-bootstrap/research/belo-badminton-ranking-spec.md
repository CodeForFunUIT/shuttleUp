# BELo — Badminton ELO Ranking System
> Hệ thống xếp hạng ELO dành cho người chơi cầu lông phong trào (club, pick-up, nội bộ).
> Tài liệu này mô tả toàn bộ logic nghiệp vụ để tích hợp vào app.

---

## Mục lục

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [ELO đơn (Singles)](#2-elo-đơn-singles)
3. [ELO đôi (Doubles)](#3-elo-đôi-doubles)
4. [Hóa học cặp đôi (Synergy)](#4-hóa-học-cặp-đôi-synergy)
5. [Carry Weight — phân chia điểm trong cặp](#5-carry-weight--phân-chia-điểm-trong-cặp)
6. [K-factor theo kinh nghiệm](#6-k-factor-theo-kinh-nghiệm)
7. [Score Multiplier theo tỉ số trận](#7-score-multiplier-theo-tỉ-số-trận)
8. [Bảng xếp hạng (Tiers)](#8-bảng-xếp-hạng-tiers)
9. [ELO khởi điểm (Placement)](#9-elo-khởi-điểm-placement)
10. [Các nội dung thi đấu (Game Types)](#10-các-nội-dung-thi-đấu-game-types)
11. [Luật đặc biệt](#11-luật-đặc-biệt)
12. [Ràng buộc & validation](#12-ràng-buộc--validation)
13. [Pseudocode tham khảo](#13-pseudocode-tham-khảo)

---

## 1. Tổng quan hệ thống

BELo là hệ thống ELO mở rộng, thiết kế cho cầu lông phong trào với các đặc điểm:

- **Không cần giải đấu chính thức** — mọi trận pick-up đều tính điểm
- **Ba bảng xếp hạng độc lập**: Đơn / Đôi thuần / Đôi hỗn hợp
- **Bonus hóa học** cho cặp đôi chơi cùng nhau lâu dài
- **Carry Weight** để phân chia điểm công bằng khi hai người trong cặp lệch trình
- **Cập nhật tức thì** sau mỗi trận, không cần chờ tổng kết tuần/tháng

---

## 2. ELO đơn (Singles)

### 2.1 Xác suất thắng kỳ vọng

```
E(A) = 1 / (1 + 10 ^ ((R_B - R_A) / 400))
E(B) = 1 - E(A)
```

- `R_A`, `R_B`: ELO hiện tại của người chơi A và B
- Kết quả: số thực trong khoảng (0, 1)

**Ví dụ:**
- A = 1400, B = 1200 → E(A) = 1/(1+10^(-200/400)) = **0.76** (76% cơ hội thắng)

### 2.2 Cập nhật ELO sau trận

```
R'(A) = R(A) + K × (S(A) - E(A))
R'(B) = R(B) + K × (S(B) - E(B))
```

- `K`: hệ số nhạy cảm (xem mục 6)
- `S(A)`: kết quả thực tế — `1` nếu thắng, `0` nếu thua
- Tổng điểm thay đổi của A + B luôn = 0 (zero-sum)

---

## 3. ELO đôi (Doubles)

### 3.1 Tính Pair Rating

Pair Rating là điểm đại diện của một cặp đôi khi tính xác suất thắng thua:

```
R_pair = floor((R_A + R_B) / 2) + synergy_bonus
```

- `R_A`, `R_B`: ELO đơn (cùng game type) của hai thành viên
- `synergy_bonus`: bonus hóa học (xem mục 4)

### 3.2 Xác suất thắng cặp đôi

Dùng công thức ELO tiêu chuẩn với Pair Rating thay cho ELO cá nhân:

```
E(pair1) = 1 / (1 + 10 ^ ((R_pair2 - R_pair1) / 400))
E(pair2) = 1 - E(pair1)
```

### 3.3 Tổng delta của cặp

```
total_delta(pair) = K × (S - E(pair))
```

Delta này sau đó được **phân chia** cho từng thành viên theo Carry Weight (mục 5).

---

## 4. Hóa học cặp đôi (Synergy)

Synergy Bonus được cộng vào Pair Rating, phản ánh mức độ ăn ý khi hai người chơi cùng nhau nhiều:

| Số trận đã đánh cùng nhau | Synergy Bonus |
|--------------------------|---------------|
| 0 – 4 trận               | +0            |
| 5 – 9 trận               | +5            |
| 10 – 19 trận             | +10           |
| 20+ trận                 | +15 (tối đa)  |

**Lưu ý:**
- "Trận đã đánh cùng nhau" = số trận cặp (A, B) cùng đứng chung một đội, tính từ lần đầu ghép cặp
- Pair (A, B) và Pair (B, A) là **cùng một cặp** (không phân biệt thứ tự)
- Synergy được lưu theo cặp `{player_id_1, player_id_2}` (sort ID để chuẩn hóa key)
- Nếu trận có thay người, không cộng trận đó vào lịch sử synergy của cặp gốc

---

## 5. Carry Weight — phân chia điểm trong cặp

Khi hai người trong cặp có ELO chênh nhau, người yếu hơn nhận tỉ lệ điểm lớn hơn (cả khi thắng lẫn khi thua). Điều này ngăn chặn việc "farm điểm" bằng cách ghép người mạnh với người yếu.

### 5.1 Tính carry weight

```
gap = |R_A - R_B| / 400

weight_strong = max(0.35, 0.50 - gap × 0.15)
weight_weak   = 1 - weight_strong
```

Trong đó:
- `weight_strong`: tỉ lệ delta người mạnh hơn nhận
- `weight_weak`: tỉ lệ delta người yếu hơn nhận
- `weight_strong` tối thiểu là **0.35** (người mạnh không nhận dưới 35%)
- Khi hai người bằng nhau (gap=0): mỗi người nhận đúng **50%**

### 5.2 Áp dụng phân chia

```
if R_A >= R_B:
    delta_A = round(total_delta × weight_strong)
    delta_B = round(total_delta × weight_weak)
else:
    delta_A = round(total_delta × weight_weak)
    delta_B = round(total_delta × weight_strong)
```

**Ví dụ:**
- A = 1600, B = 1000 → gap = 600/400 = 1.5
- weight_strong = max(0.35, 0.50 - 1.5×0.15) = max(0.35, 0.275) = **0.35**
- weight_weak = **0.65**
- Nếu total_delta = +20: A nhận +7, B nhận +13

### 5.3 Cảnh báo lệch trình

Hiển thị cảnh báo trên UI khi:

| Chênh lệch ELO | Mức độ | Hành động gợi ý |
|----------------|--------|-----------------|
| ≤ 200          | Bình thường | Không cảnh báo |
| 201 – 400      | Lệch nhẹ | Hiển thị badge vàng |
| > 400          | Lệch nặng | Hiển thị badge đỏ, gợi ý đổi cặp |

---

## 6. K-factor theo kinh nghiệm

K-factor quyết định mức độ thay đổi ELO sau mỗi trận. Người mới có K cao để nhanh tìm đúng ngưỡng, người kỳ cựu có K thấp để điểm ổn định hơn:

| K-factor | Điều kiện áp dụng |
|----------|-------------------|
| **32**   | Người chơi mới (< 20 trận tổng) |
| **24**   | Người chơi thường (20 – 100 trận) |
| **16**   | Kỳ cựu (> 100 trận tổng) |

**Lưu ý:**
- "Tổng trận" = tổng tất cả các nội dung (đơn + đôi + hỗn hợp)
- K-factor của một trận = K-factor của **người có K thấp hơn** trong hai bên (để bảo vệ kỳ cựu khỏi biến động lớn)
- Với trận đôi: lấy K-factor nhỏ nhất trong 4 người chơi

---

## 7. Score Multiplier — ĐÃ LOẠI BỎ (v1.1)

> **Lý do:** Score Multiplier dựa trên format best-of-3 sets (2-0 / 2-1).
> Trong pick-up badminton (đánh vãng lai), mỗi trận chỉ đánh 1 set → multiplier không áp dụng.
> Công thức ELO sử dụng K-factor, Carry Weight, và Synergy là đủ.
> Có thể bổ sung lại ở v2 với Score Gap Multiplier (dựa trên chênh lệch điểm) nếu cần.

---

## 8. Bảng xếp hạng (Tiers)

| Tier | ELO | Ước tính phân bổ |
|------|-----|-----------------|
| Kim Cương | ≥ 2000 | Top ~1% |
| Vàng | 1700 – 1999 | Top ~5% |
| Bạc | 1400 – 1699 | Top ~15% |
| Đồng | 1100 – 1399 | Đa số người chơi |
| Sắt | 800 – 1099 | Mới bắt đầu |
| Nhập môn | < 800 | Lần đầu chơi |

**Lưu ý:** Tier được xác định **riêng biệt** cho từng game type (đơn / đôi thuần / đôi hỗn hợp).

---

## 9. ELO khởi điểm (Placement)

### 9.1 Tự đánh giá khi đăng ký

Nếu app có bước onboarding, cho phép người chơi tự chọn mức khởi điểm:

| Mô tả tự đánh giá | ELO khởi điểm |
|-------------------|---------------|
| Chưa biết chơi / mới bắt đầu | 800 |
| Chơi được, hiểu luật cơ bản | 1000 |
| Chơi thường xuyên, có kỹ thuật | 1200 |
| Chơi giải địa phương / club mạnh | 1400 |
| Từng thi đấu giải tỉnh trở lên | 1600 |

### 9.2 Placement matches (khuyến nghị)

- Trong **5 trận đầu tiên**, dùng K = 32 bất kể số trận lịch sử
- ELO chỉ nên hiển thị công khai sau khi hoàn thành ≥ 5 trận ("đang calibrating")

---

## 10. Các nội dung thi đấu (Game Types)

Mỗi người chơi có **3 chỉ số ELO độc lập**:

| Game Type | Mã | Mô tả |
|-----------|----|-------|
| Đơn nam / đơn nữ | `singles` | 1v1 |
| Đôi thuần (nam đôi / nữ đôi) | `doubles` | 2v2 cùng giới |
| Đôi hỗn hợp | `mixed` | 2v2, mỗi cặp 1 nam 1 nữ |

**Nguyên tắc:**
- Kết quả ở một game type **không ảnh hưởng** sang game type khác
- Synergy bonus cũng tính riêng theo từng game type
- Pair Rating tính từ ELO cùng game type

---

## 11. Luật đặc biệt

### 11.1 Thay người giữa buổi

Khi một thành viên bị thay thế (chấn thương, việc đột xuất):

- Người thay thế dùng ELO của mình để tính Pair Rating cho trận đó
- Cả người thay và người bị thay chỉ nhận **50% delta** so với bình thường
- Synergy bonus bị **vô hiệu hóa** cho trận đó (kể cả cặp gốc)
- Trận đó **không cộng** vào lịch sử "chơi cùng nhau" của bất kỳ cặp nào

```
delta_substitute = round(delta_normal × 0.5)
delta_replaced   = round(delta_normal × 0.5)
synergy_bonus    = 0  (override)
```

### 11.2 ELO tối thiểu

ELO không được phép xuống dưới **100** ở bất kỳ game type nào:

```
R'(player) = max(100, R(player) + delta)
```

### 11.3 Trận không hợp lệ

Các trận sau **không được tính điểm**:

- Trận tập không có đối thủ thực (đánh solo, đánh máy)
- Trận do hai bên thỏa thuận kết quả trước (phát hiện qua pattern bất thường)
- Trận bị hủy giữa chừng trước khi hoàn thành set 1

### 11.4 Không hoạt động (Inactivity decay) — tùy chọn

Nếu club muốn áp dụng: sau **60 ngày** không thi đấu, ELO giảm nhẹ mỗi tuần:

```
decay_per_week = 2  (điểm)
max_decay      = 50 (tối đa trừ 50 điểm từ lần cuối thi đấu)
```

Decay chỉ áp dụng cho ELO **trên 1000**. Dưới 1000 không decay.

---

## 12. Ràng buộc & validation

### 12.1 Dữ liệu đầu vào bắt buộc

| Trường | Kiểu | Ghi chú |
|--------|------|---------|
| `player_id` | string/uuid | Định danh người chơi |
| `game_type` | enum: `singles`, `doubles`, `mixed` | |
| `winner` | player_id hoặc pair_id | |
| `loser` | player_id hoặc pair_id | |
| `played_at` | timestamp | |

### 12.2 Validation logic

```
// Với trận đôi:
assert pair1.player_ids.length == 2
assert pair2.player_ids.length == 2
assert intersection(pair1.player_ids, pair2.player_ids) == []

// Với đôi hỗn hợp:
assert pair1 có đúng 1 nam + 1 nữ
assert pair2 có đúng 1 nam + 1 nữ

// Không được tự đánh với chính mình:
assert all 4 player_ids là duy nhất (với trận đôi)
assert 2 player_ids là duy nhất (với trận đơn)
```

### 12.3 Thứ tự xử lý khi ghi nhận kết quả

1. Validate input
2. Load ELO hiện tại của tất cả người chơi liên quan (theo đúng game type)
3. Load synergy count của cặp (nếu là trận đôi)
4. Tính K-factor (nhỏ nhất trong các người chơi)
5. Tính Pair Rating (nếu đôi) với synergy bonus
6. Tính E (xác suất kỳ vọng)
7. Tính total_delta cho từng đội
8. Phân chia delta theo carry weight (nếu đôi)
9. Áp dụng luật đặc biệt nếu có (thay người, v.v.)
10. Clamp ELO tối thiểu 100
11. Lưu ELO mới, cập nhật synergy count (+1 nếu hợp lệ)
12. Ghi log lịch sử trận

---

## 13. Pseudocode tham khảo

### Hàm tính ELO đơn

```python
def calculate_singles(elo_a, elo_b, winner, total_games_a=50, total_games_b=50):
    # K-factor
    k_a = get_k_factor(total_games_a)
    k_b = get_k_factor(total_games_b)
    k = min(k_a, k_b)

    # Xác suất kỳ vọng
    e_a = 1 / (1 + 10 ** ((elo_b - elo_a) / 400))
    e_b = 1 - e_a

    # Kết quả thực tế
    s_a = 1 if winner == 'A' else 0
    s_b = 1 - s_a

    # Delta
    delta_a = round(k * (s_a - e_a))
    delta_b = round(k * (s_b - e_b))

    return max(100, elo_a + delta_a), max(100, elo_b + delta_b)


def get_k_factor(total_games):
    if total_games < 20:
        return 32
    elif total_games < 100:
        return 24
    else:
        return 16
```

### Hàm tính ELO đôi

```python
def calculate_doubles(p1a, p1b, p2a, p2b, games_p1, games_p2, winner, all_game_counts):
    # Synergy
    syn1 = synergy_bonus(games_p1)
    syn2 = synergy_bonus(games_p2)

    # Pair Rating
    r_pair1 = (p1a + p1b) // 2 + syn1
    r_pair2 = (p2a + p2b) // 2 + syn2

    # K-factor: nhỏ nhất trong 4 người
    k = min(get_k_factor(n) for n in all_game_counts)

    # Xác suất
    e1 = 1 / (1 + 10 ** ((r_pair2 - r_pair1) / 400))
    e2 = 1 - e1

    s1 = 1 if winner == 'pair1' else 0
    s2 = 1 - s1

    total_delta1 = k * (s1 - e1)
    total_delta2 = k * (s2 - e2)

    # Carry weight
    w1a, w1b = carry_weights(p1a, p1b)
    w2a, w2b = carry_weights(p2a, p2b)

    d_p1a = round(total_delta1 * w1a)
    d_p1b = round(total_delta1 * w1b)
    d_p2a = round(total_delta2 * w2a)
    d_p2b = round(total_delta2 * w2b)

    return (
        max(100, p1a + d_p1a),
        max(100, p1b + d_p1b),
        max(100, p2a + d_p2a),
        max(100, p2b + d_p2b),
    )


def synergy_bonus(games_together):
    if games_together >= 20: return 15
    if games_together >= 10: return 10
    if games_together >= 5:  return 5
    return 0


def carry_weights(r_a, r_b):
    gap = abs(r_a - r_b) / 400
    w_strong = max(0.35, 0.50 - gap * 0.15)
    w_weak = 1 - w_strong
    if r_a >= r_b:
        return w_strong, w_weak
    else:
        return w_weak, w_strong
```

---

*BELo Spec v1.1 — thiết kế cho cầu lông phong trào, club, và pick-up games.*
*v1.1: Loại bỏ Score Multiplier — đơn giản hóa cho pick-up games (1 set/trận).*
*Hệ thống có thể mở rộng thêm: decay, seasonal reset, leaderboard theo club.*
