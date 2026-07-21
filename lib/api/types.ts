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
  completedSets?: number;
  minPlan?: PlanKey;
  minPlanLabel?: string;
  isLocked?: boolean;
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
  totalQuestions?: number;
  questionCount?: number;
  status?: "completed" | "start" | "locked" | null;
  score?: number | null;
  progressPercentage?: number | null;
  completionPercentage?: number;
  minPlan?: PlanKey;
  minPlanLabel?: string;
  isLocked?: boolean;
};

export type RichImage = {
  uri: string;
  alt?: string;
  width?: number;
  height?: number;
  role?: "equation" | "diagram_2d" | "solid_3d" | "option" | "illustration";
};

export type RichInline =
  | { type: "text"; text: string; bold?: boolean; italic?: boolean; superscript?: boolean; subscript?: boolean }
  | ({ type: "image" } & RichImage);

export type RichContentBlock =
  | { type: "paragraph"; children: RichInline[] }
  | ({ type: "figure"; caption?: string } & RichImage)
  | { type: "table"; caption?: string; headerRows?: number; rows: { cells: { blocks: RichContentBlock[]; colSpan?: number; rowSpan?: number }[] }[] };

export type RichDocument = { version: 1; blocks: RichContentBlock[] };

export type QuestionVisual =
  | { type: "coordinate_graph"; title?: string; xMin: number; xMax: number; yMin: number; yMax: number; lines?: unknown[]; points?: unknown[] }
  | ({ type: "image" } & RichImage)
  | { type: "rich_document"; prompt: RichDocument; explanation?: RichDocument };

export type QuestionOption = { label: string; text: string; content?: RichDocument };
export type Question = {
  id: string;
  practiceSetId?: string;
  text?: string;
  questionText: string;
  options: QuestionOption[];
  visual?: QuestionVisual | null;
  correctOption?: string;
  explanation?: string | null;
  orderIndex?: number | null;
};

export type QuestionAiAction =
  | "explain"
  | "similar_questions"
  | "formulas"
  | "summary"
  | "youtube_video";

export type QuestionReportReason =
  | "incorrect_answer"
  | "needs_correction"
  | "unclear_question"
  | "bad_explanation"
  | "other";

export type QuestionAiHelpResult = {
  questionId: string;
  action: QuestionAiAction;
  reply: string;
};

export type QuestionAiChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export type QuestionAiChatResult = {
  questionId: string;
  reply: string;
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
  type?: string;
  totalMarks?: number;
  marks?: number;
  isRecommended?: boolean;
  minPlan?: PlanKey;
  scheduledAt?: string | null;
  participantsCount?: number;
  totalParticipants?: number;
  primaryColor?: string;
  icon?: string;
  isPremium: boolean;  isLocked?: boolean;
  isSaved?: boolean;
  attemptCount?: number;
  bestScore?: number | null;
};

export type ExamAdminQuestion = {
  id: string;
  examId: string;
  text: string;
  passage: string | null;
  options: QuestionOption[];
  correctOption: string;
  explanation: string;
  topic: string;
  difficulty: Difficulty;
  marks: number;
  orderIndex: number;
};

export type ExamEditorInput = {
  title: string;
  type: string;
  category?: string | null;
  durationMinutes: number;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  isRecommended?: boolean;
  minPlan?: PlanKey;
  scheduledAt?: string | null;
  primaryColor?: string;
  icon?: string;
};

export type ExamQuestionEditorInput = {
  text: string;
  passage?: string | null;
  options: QuestionOption[];
  correctOption: string;
  explanation: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  orderIndex: number;
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
  instructor?: string | null;
  color?: string | null;
  summaryData?: {
    coreObjective?: string;
    strategies?: string[];
    warnings?: string[];
    formulas?: string[];
  } | null;
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
  userId?: string;
  kpis?: {
    totalSolved: number;
    accuracy: number;
    studyTimeHours: number;
    currentStreakDays: number;
    longestStreakDays: number;
  };
  detailedLocked?: boolean;
  mockPerformance?: {
    mocksAttempted: number;
    averageScore: number;
    bestScore: number;
    overallRank: number;
    percentile: number;
    totalActiveStudents: number;
  } | null;
  weeklyActivity?: { day: string; questionsAnswered: number }[];
  topicMastery?: {
    topicId?: string;
    topicName?: string;
    categoryName?: string;
    totalSets?: number;
    completedSets?: number;
    avgScore?: number;
    progressRatio?: number;
    topic?: string;
    mastery?: number;
  }[];
  accuracyOverTime?: { date: string; accuracy: number }[];
  timePerTopic?: { topic: string; minutes: number }[];
  questionsPerDay?: { date: string; count: number }[];
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

export type SavedQuestion = {
  id: string;
  questionId: string;
  questionText: string;
  options: QuestionOption[];
  correctOption: string;
  explanation: string | null;
  orderIndex: number;
  practiceSetTitle: string;
  topicName: string;
  categoryName: string;
  savedAt: string;
};

export type SavedNoteFolder = {
  id: string;
  name: string;
  notesCount: number;
};

export type SavedAiNote = {
  id: string;
  folderId: string;
  folderName: string;
  questionId: string | null;
  title: string;
  content: string;
  sourceAction: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReferralStatus = {
  enabled: boolean;
  code: string;
  shareUrl: string;
  rewardAmount: number;
  requiredPaidReferrals: number;
  payoutHoldDays: number;
  registeredCount: number;
  qualifiedCount: number;
  paidCount: number;
  unpaidQualifiedCount: number;
  pendingQualifiedCount: number;
  progress: number;
  eligible: boolean;
  openPayout: ReferralPayout | null;
};

export type Profile = {
  id: string;
  fullName: string;
  phone: string;
  role: Role;
  plan: PlanKey;
  planLabel: string;
  username?: string | null;
  planActivatedAt?: string | null;
  createdAt?: string;
  streak?: Pick<StreakSummary, "currentStreak" | "longestStreak">;
  allowScreenshots?: boolean;
  profile: {
    userId: string;
    schoolName: string | null;
    townName: string | null;
    region: string | null;
    stream: "natural" | "social" | null;
    whereDidYouHearAboutUs: string | null;
    avatarUrl: string | null;
  } | null;
};

export type Settings = {
  notificationsEnabled: boolean;
  emailUpdates: boolean;
  darkMode: boolean;
};
