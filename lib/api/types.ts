export type Role = "user" | "admin";
export type PlanKey = "free" | "pro" | "pro_plus";
export type Difficulty = "easy" | "medium" | "hard";
export type PaymentStatus = "pending" | "approved" | "rejected";

export type SessionUser = {
  id: string;
  phone: string;
  fullName: string;
  role: Role;
  avatarUrl?: string;
};

export type AuthSession = {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
};

export type AuthMe = {
  sub: string;
  phone: string;
  fullName: string;
  role: Role;
  deviceId?: string;
};

export type AdminUser = {
  id: string;
  phone: string;
  fullName: string;
  role: Role;
  plan: PlanKey;
  isPhoneVerified: boolean;
  boundDeviceId: string | null;
  boundDeviceName: string | null;
  deviceBoundAt: string | null;
  createdAt: string;
  avatarUrl: string | null;
};

export type PlanCatalogItem = {
  key: PlanKey;
  label: string;
  price: number;
  rank: number;
  features: string[];
};

export type PlanPayment = {
  id: string;
  userId: string;
  plan: Exclude<PlanKey, "free">;
  amount: number;
  status: PaymentStatus;
  proofUrl: string | null;
  transactionRef: string | null;
  transactionRefKey?: string | null;
  receiptReference?: string | null;
  receiptProvider?: string | null;
  verificationMethod?: string | null;
  verifiedAt?: string | null;
  note: string | null;
  reviewedBy: string | null;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PlanMe = {
  plan: PlanKey;
  planLabel: string;
  planActivatedAt: string | null;
  planExpiresAt: string | null;
  latestPayment: PlanPayment | null;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  iconName: string | null;
  accentColor: string | null;
  displayOrder: number | null;
  topicCount?: number;
};

export type Topic = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  accentColor: string | null;
  displayOrder: number | null;
  setCount?: number;
};

export type TopicStats = {
  accuracy: number;
  questionsAnswered: number;
  correctCount: number;
  timeSpentSeconds: number;
  completedSets?: number;
  totalSets?: number;
};

export type PracticeSet = {
  id: string;
  topicId: string;
  title: string;
  description: string | null;
  difficulty: Difficulty | null;
  estimatedTimeMinutes: number | null;
  iconName: string | null;
  iconColor: string | null;
  iconBackground: string | null;
  orderIndex: number | null;
  questionCount?: number;
  completionPercentage?: number;
};

export type QuestionOption = {
  label: string;
  text: string;
};

export type Question = {
  id: string;
  practiceSetId?: string;
  questionText: string;
  options: QuestionOption[];
  correctOption?: string;
  explanation?: string | null;
  orderIndex?: number | null;
};

export type SubmitAnswerResult = {
  isCorrect: boolean;
  correctOption: string;
  explanation: string | null;
};

export type Exam = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: Difficulty | null;
  questionCount: number;
  durationMinutes: number;
  isPremium: boolean;
  isSaved?: boolean;
  attemptCount?: number;
  bestScore?: number | null;
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  score: number;
  timeSpentSeconds: number;
};

export type Leaderboard = {
  entries: LeaderboardEntry[];
  total: number;
};

export type ExamAttempt = {
  attemptId: string;
  examId: string;
  timeLeftSeconds: number;
};

export type ExamAnswer = {
  questionId: string;
  selectedOption: string | null;
  isFlagged: boolean;
  timeSpentSeconds: number;
};

export type ExamReport = {
  attemptId: string;
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  timeSpentSeconds: number;
  topicBreakdown: { topic: string; accuracy: number; total: number }[];
  questions: {
    questionId: string;
    questionText: string;
    options: QuestionOption[];
    selectedOption: string | null;
    correctOption: string;
    isCorrect: boolean;
    explanation: string | null;
  }[];
};

export type Course = {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  materialCount: number;
  isLocked: boolean;
  progressPercentage?: number;
};

export type CourseMaterial = {
  id: string;
  courseId: string;
  title: string;
  type: "video" | "pdf" | "reading";
  content: string | null;
  url: string | null;
  durationSeconds: number | null;
  isLocked: boolean;
  progressPercentage?: number;
  orderIndex?: number;
};

export type TutorMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type TutorSession = {
  messages: TutorMessage[];
};

export type Note = {
  id: string;
  title: string | null;
  description: string | null;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string | null;
  createdAt: string;
};

export type StreakSummary = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  todayCompleted: boolean;
};

export type WeeklyStreak = {
  days: { date: string; questionsAnswered: number; active: boolean }[];
};

export type AnalyticsOverview = {
  accuracy: number;
  questionsSolved: number;
  rank: number | null;
  examsTaken: number;
  studyTimeSeconds: number;
};

export type AnalyticsDashboard = {
  accuracyOverTime: { date: string; accuracy: number }[];
  timePerTopic: { topic: string; minutes: number }[];
  questionsPerDay: { date: string; count: number }[];
  topicMastery: { topic: string; mastery: number }[];
};

export type ScoreCalculatorResult = {
  netScore: number;
  esslceScore?: number;
  uatScore?: number;
};

export type Profile = {
  id: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  school: string | null;
  town: string | null;
  region: string | null;
  stream: string | null;
  grade: string | null;
};

export type Settings = {
  notificationsEnabled: boolean;
  emailUpdates: boolean;
  darkMode: boolean;
};
