export type Role = "user" | "admin";
export type PlanKey = "free" | "pro" | "pro_plus";
export type Difficulty = "easy" | "medium" | "hard";
export type PaymentStatus = "pending" | "approved" | "rejected";
export type QuestionReportStatus =
  | "open"
  | "reviewing"
  | "resolved"
  | "dismissed";

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

export type ReferralPayout = {
  id: string;
  userId: string;
  userPhone: string;
  userFullName: string;
  referralCount: number;
  amount: number;
  status: "requested" | "approved" | "paid";
  payoutMethod: string | null;
  payoutAccount: string | null;
  note: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type PlanMe = {
  plan: PlanKey;
  planLabel: string;
  planActivatedAt: string | null;
  planExpiresAt: string | null;
  latestPayment: PlanPayment | null;
  availableUpgrades: {
    plan: Exclude<PlanKey, "free">;
    label: string;
    price: number;
    upgradePrice: number;
  }[];
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
  grouping: "verbal" | "quantitative" | "analytical";
  name: string;
  description: string | null;
  imageUrl: string | null;
  accentColor: string | null;
  displayOrder: number | null;
  setCount?: number;
  totalSets?: number;
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
  text?: string;
  questionText: string;
  options: QuestionOption[];
  correctOption?: string;
  explanation?: string | null;
  orderIndex?: number | null;
};

export type QuestionReport = {
  id: string;
  userId: string;
  questionId: string;
  reason: string;
  comment: string | null;
  status: QuestionReportStatus;
  createdAt: string;
  updatedAt: string;
  userFullName: string | null;
  userPhone: string | null;
  questionText: string;
  correctOption: string;
  explanation: string | null;
  practiceSetId: string;
};

export type SubmitAnswerResult = {
  isCorrect?: boolean;
  correctOption?: string;
  explanation?: string | null;
  /** True when the viewer is on a free plan and results are withheld. */
  gated?: boolean;
};

export type Exam = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: Difficulty | null;
  questionCount: number;
  questionsCount?: number;
  totalQuestions?: number;
  durationMinutes: number;
  isPremium: boolean;
  isLocked?: boolean;
  isSaved?: boolean;
  attemptCount?: number;
  bestScore?: number | null;
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  fullName: string;
  username?: string;
  avatarUrl: string | null;
  score: number;
  timeSpentSeconds: number;
  timeTakenSeconds?: number;
};

export type Leaderboard = {
  entries: LeaderboardEntry[];
  total: number;
  leaderboard?: LeaderboardEntry[];
  totalParticipants?: number;
};

export type ExamAttempt = {
  id?: string;
  attemptId?: string;
  examId: string;
  timeLeftSeconds: number;
};

export type ExamAnswer = {
  questionId: string;
  selectedOption: string | null;
  isFlagged: boolean;
  timeSpentSeconds: number;
};

export type ExamAttemptQuestions = {
  attemptId: string;
  attemptNumber?: number;
  timeLeftSeconds: number;
  questions: Question[];
  savedAnswers: ExamAnswer[];
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
  courseId?: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  materialCount: number;
  materialsCount?: number;
  isLocked: boolean;
  progressPercentage?: number;
  materials?: CourseMaterial[];
};

export type CourseMaterial = {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  type: "video" | "pdf" | "reading" | "Video" | "PDF" | "Notes";
  content: string | null;
  url: string | null;
  remoteUrl?: string | null;
  htmlContent?: string | null;
  duration?: string | null;
  durationSeconds: number | null;
  videoDurationSeconds?: number | null;
  isLocked: boolean;
  progressPercentage?: number;
  progress?: number;
  orderIndex?: number;
};

export type TutorMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  text?: string;
};

export type TutorSession = {
  messages: TutorMessage[];
  chatHistory?: { role: "user" | "assistant"; text: string }[];
  contentId?: string;
  reply?: string;
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

export type MarketingSlice = {
  label: string;
  count: number;
};

export type AdminMarketingAnalytics = {
  totalProfiles: number;
  sources: MarketingSlice[];
  regions: MarketingSlice[];
  towns: MarketingSlice[];
  schools: MarketingSlice[];
};

export type ScoreCalculatorResult = {
  netScore: number;
  esslceScore?: number;
  esslceMax?: 600 | 700;
  normalizedEsslce?: number;
  uatScore?: number;
};

export type AppNotification = {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
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
