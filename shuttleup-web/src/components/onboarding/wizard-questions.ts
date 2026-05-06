/**
 * Wizard question config — data-driven, shared weight tables with backend.
 * Weight indices MUST match ONBOARDING_WEIGHTS in users.service.ts exactly.
 */

export interface WizardOption {
  label: string;
  labelVi: string;
  weight: number;
}

export interface WizardQuestion {
  id: string;
  title: string;
  titleVi: string;
  subtitle: string;
  subtitleVi: string;
  icon: string;
  options: WizardOption[];
}

export const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: "experience",
    title: "How long have you played badminton?",
    titleVi: "Bạn đã chơi cầu lông bao lâu?",
    subtitle: "Your experience helps us find the right starting point",
    subtitleVi: "Kinh nghiệm giúp xác định điểm xuất phát phù hợp",
    icon: "🏸",
    options: [
      { label: "Just started", labelVi: "Mới bắt đầu", weight: 0 },
      { label: "Less than 1 year", labelVi: "Dưới 1 năm", weight: 50 },
      { label: "1–3 years", labelVi: "1–3 năm", weight: 100 },
      { label: "3–5 years", labelVi: "3–5 năm", weight: 150 },
      { label: "More than 5 years", labelVi: "Trên 5 năm", weight: 200 },
    ],
  },
  {
    id: "frequency",
    title: "How often do you play?",
    titleVi: "Bạn chơi thường xuyên như thế nào?",
    subtitle: "Regular practice keeps your skills sharp",
    subtitleVi: "Tập luyện đều đặn giúp nâng cao kỹ năng",
    icon: "📅",
    options: [
      { label: "Rarely (few times a month)", labelVi: "Hiếm khi (vài lần/tháng)", weight: 0 },
      { label: "1–2 times per week", labelVi: "1–2 lần/tuần", weight: 30 },
      { label: "3–4 times per week", labelVi: "3–4 lần/tuần", weight: 60 },
      { label: "Almost daily (5+)", labelVi: "Gần như mỗi ngày (5+)", weight: 80 },
    ],
  },
  {
    id: "tournament",
    title: "Have you competed in any tournament?",
    titleVi: "Bạn đã thi đấu giải nào chưa?",
    subtitle: "Tournament experience shows competitive readiness",
    subtitleVi: "Kinh nghiệm giải đấu thể hiện khả năng thi đấu",
    icon: "🏆",
    options: [
      { label: "Never", labelVi: "Chưa bao giờ", weight: 0 },
      { label: "Local / club level", labelVi: "Cấp CLB / địa phương", weight: 50 },
      { label: "District / city level", labelVi: "Cấp quận / thành phố", weight: 100 },
      { label: "Provincial or higher", labelVi: "Cấp tỉnh trở lên", weight: 150 },
    ],
  },
  {
    id: "gameStyle",
    title: "How would you describe your playing style?",
    titleVi: "Phong cách chơi của bạn như thế nào?",
    subtitle: "This helps us understand your competitive mindset",
    subtitleVi: "Giúp hiểu tinh thần thi đấu của bạn",
    icon: "⚡",
    options: [
      { label: "Casual rallies for fun", labelVi: "Đánh vui, giao lưu", weight: 0 },
      { label: "Competitive but friendly", labelVi: "Thi đấu nhưng vui vẻ", weight: 30 },
      { label: "I play to win", labelVi: "Chơi là phải thắng", weight: 50 },
    ],
  },
  {
    id: "technique",
    title: "Can you perform a clear, smash, and drop shot consistently?",
    titleVi: "Bạn có thể đánh clear, smash và drop ổn định không?",
    subtitle: "Technical consistency is a key skill indicator",
    subtitleVi: "Kỹ thuật ổn định là chỉ số quan trọng",
    icon: "🎯",
    options: [
      { label: "Not yet learning", labelVi: "Chưa biết / đang học", weight: 0 },
      { label: "Sometimes", labelVi: "Thỉnh thoảng được", weight: 30 },
      { label: "Most of the time", labelVi: "Đa số ổn định", weight: 60 },
      { label: "Always, with control", labelVi: "Luôn ổn định, có kiểm soát", weight: 80 },
    ],
  },
  {
    id: "training",
    title: "What's your training background?",
    titleVi: "Nền tảng tập luyện của bạn?",
    subtitle: "Formal training accelerates skill development",
    subtitleVi: "Được huấn luyện bài bản giúp phát triển nhanh hơn",
    icon: "🎓",
    options: [
      { label: "Self-taught", labelVi: "Tự học", weight: 0 },
      { label: "Learned from videos/friends", labelVi: "Học qua video / bạn bè", weight: 15 },
      { label: "Had formal lessons or club coaching", labelVi: "Đã học lớp / CLB", weight: 40 },
      { label: "Currently training with a coach", labelVi: "Đang tập với HLV", weight: 60 },
    ],
  },
  {
    id: "selfRating",
    title: "How would you rate your overall skill?",
    titleVi: "Bạn tự đánh giá trình độ của mình thế nào?",
    subtitle: "Be honest — your rating will calibrate after a few games",
    subtitleVi: "Hãy trung thực — BELo sẽ tự điều chỉnh sau vài trận",
    icon: "⭐",
    options: [
      { label: "Complete beginner", labelVi: "Mới chơi hoàn toàn", weight: 0 },
      { label: "Below average", labelVi: "Dưới trung bình", weight: 30 },
      { label: "Average", labelVi: "Trung bình", weight: 60 },
      { label: "Above average", labelVi: "Trên trung bình", weight: 90 },
      { label: "Expert / competitive", labelVi: "Giỏi / thi đấu", weight: 120 },
    ],
  },
];

export const BASE_ELO = 1200;

/** Client-side ELO preview calculation (mirrors backend logic) */
export function calculateClientElo(answers: Record<string, number>): number {
  let bonus = 0;
  for (const q of WIZARD_QUESTIONS) {
    const idx = answers[q.id];
    if (idx !== undefined && idx >= 0 && idx < q.options.length) {
      bonus += q.options[idx].weight;
    }
  }
  return BASE_ELO + bonus;
}
