import { api } from "./client";
import type {
  AdminUser,
  AdminMarketingAnalytics,
  AppNotification,
  AnalyticsDashboard,
  AnalyticsOverview,
  AuthMe,
  AuthSession,
  Category,
  Course,
  CourseMaterial,
  Exam,
  ExamAdminQuestion,
  ExamEditorInput,
  ExamQuestionEditorInput,
  ExamAttempt,
  ExamAttemptQuestions,
  ExamAnswer,
  ExamReport,
  Leaderboard,
  LeaderboardEntry,
  Note,
  PlanCatalogItem,
  PlanKey,
  PlanMe,
  PlanPayment,
  ReferralPayout,
  ReferralStatus,
  SavedAiNote,
  SavedNoteFolder,
  SavedQuestion,
  PracticeSet,
  Profile,
  Question,
  QuestionReport,
  QuestionReportStatus,
  ScoreCalculatorResult,
  Settings,
  StreakSummary,
  SubmitAnswerResult,
  Topic,
  TopicStats,
  TutorSession,
  WeeklyStreak,
} from "./types";
import type { PracticeGrouping } from "@/lib/practice-groups";

function normalizeTutorSession(data: TutorSession): TutorSession {
  if (Array.isArray(data.messages)) return data;

  const rows = data.chatHistory ?? [];
  return {
    ...data,
    messages: rows.map((message, index) => ({
      id: `${message.role}-${index}`,
      role: message.role,
      content: message.text,
      text: message.text,
      createdAt: new Date(0).toISOString(),
    })),
  };
}

type RawExam = Partial<Exam> & {
  userProgress?: {
    attemptsCount?: number;
    bestScore?: number | null;
  };
};

type RawLeaderboard = Partial<Leaderboard> & {
  leaderboard?: LeaderboardEntry[];
  totalParticipants?: number;
};

type RawQuestion = Partial<Question> & {
  text?: string;
};

type RawAttemptQuestions =
  | Question[]
  | {
      attemptId?: string;
      attemptNumber?: number;
      timeLeftSeconds?: number;
      questions?: RawQuestion[];
      savedAnswers?: Partial<ExamAnswer>[];
    };

type SubscribeResult = {
  status: "active" | "pending";
  plan: PlanKey;
  amount?: number;
  isUpgrade?: boolean;
  payment?: PlanPayment;
  message?: string;
};

function normalizeExam(data: RawExam): Exam {
  return {
    ...data,
    id: data.id ?? "",
    title: data.title ?? "Mock exam",
    description: data.description ?? null,
    category: data.category ?? null,
    difficulty: data.difficulty ?? null,
    questionCount:
      data.questionCount ?? data.questionsCount ?? data.totalQuestions ?? 0,
    durationMinutes: data.durationMinutes ?? 0,
    isPremium: Boolean(data.isPremium ?? data.isLocked),
    attemptCount: data.attemptCount ?? data.userProgress?.attemptsCount,
    bestScore: data.bestScore ?? data.userProgress?.bestScore ?? null,
  };
}

function normalizeQuestion(data: RawQuestion): Question {
  return {
    ...data,
    id: data.id ?? "",
    questionText: data.questionText ?? data.text ?? "",
    options: data.options ?? [],
  };
}

function normalizeLeaderboard(data: RawLeaderboard): Leaderboard {
  const rows = data.entries ?? data.leaderboard ?? [];
  return {
    entries: rows.map((entry) => ({
      ...entry,
      rank: entry.rank ?? 0,
      fullName: entry.fullName ?? entry.username ?? "Student",
      avatarUrl: entry.avatarUrl ?? null,
      score: entry.score ?? 0,
      timeSpentSeconds: entry.timeSpentSeconds ?? entry.timeTakenSeconds ?? 0,
    })),
    total: data.total ?? data.totalParticipants ?? rows.length,
  };
}

function normalizeAttemptQuestions(
  data: RawAttemptQuestions,
): ExamAttemptQuestions {
  if (Array.isArray(data)) {
    return {
      attemptId: "",
      timeLeftSeconds: data.length * 60,
      questions: data.map(normalizeQuestion),
      savedAnswers: [],
    };
  }

  return {
    attemptId: data.attemptId ?? "",
    attemptNumber: data.attemptNumber,
    timeLeftSeconds:
      typeof data.timeLeftSeconds === "number" ? data.timeLeftSeconds : 0,
    questions: (data.questions ?? []).map(normalizeQuestion),
    savedAnswers: (data.savedAnswers ?? []).map((answer) => ({
      questionId: answer.questionId ?? "",
      selectedOption: answer.selectedOption ?? null,
      isFlagged: Boolean(answer.isFlagged),
      timeSpentSeconds: answer.timeSpentSeconds ?? 0,
    })),
  };
}

export const authApi = {
  register: (b: { phone: string; password: string; fullName: string; referralCode?: string }) =>
    api.public.post<{ userId: string; phone: string; message: string }>(
      "/auth/register",
      b,
    ),
  login: (b: { phone: string; password: string }) =>
    api.public.post<AuthSession>("/auth/login", b),
  verifyOtp: (b: { phone: string; otpCode: string }) =>
    api.public.post<AuthSession>("/auth/verify-otp", b),
  resendOtp: (b: { phone: string }) =>
    api.public.post<{ message: string }>("/auth/resend-otp", b),
  me: () => api.get<AuthMe>("/auth/me"),
  logout: () => api.post<null>("/auth/logout"),
  deleteAccount: () =>
    api.del<{ id: string; message: string }>("/auth/account"),
  users: () => api.get<AdminUser[]>("/auth/users"),
  updateUserPlan: (id: string, plan: PlanKey) =>
    api.patch<{ user: Pick<AdminUser, "id" | "plan">; message: string }>(
      `/auth/users/${id}/plan`,
      { plan },
    ),
  removeUser: (id: string) =>
    api.del<{ id: string; message: string }>(`/auth/users/${id}`),
  resetDevice: (id: string) =>
    api.post<{ id: string; message: string }>(`/auth/users/${id}/reset-device`),
};

export const plansApi = {
  catalog: () => api.get<PlanCatalogItem[]>("/plans"),
  me: () => api.get<PlanMe>("/plans/me"),
  subscribe: (body: { plan: PlanKey; receiptUrl?: string; note?: string }) =>
    api.post<SubscribeResult>("/plans/subscribe", body),
  payments: (status?: string) =>
    api.get<PlanPayment[]>("/plans/payments", status ? { status } : undefined),
  approve: (id: string) =>
    api.post<{ payment: PlanPayment }>(`/plans/payments/${id}/approve`),
  reject: (id: string, reason: string) =>
    api.post<{ payment: PlanPayment }>(`/plans/payments/${id}/reject`, { reason }),
};

export const referralsApi = {
  payouts: (status?: string) =>
    api.get<ReferralPayout[]>(
      "/referrals/payouts",
      status ? { status } : undefined,
    ),
  markPaid: (id: string) =>
    api.post<ReferralPayout>(`/referrals/payouts/${id}/paid`),
};

export const examsApi = {
  list: (q?: { tab?: string; category?: string; difficulty?: string }) =>
    api.get<RawExam[]>("/exams", q).then((exams) => exams.map(normalizeExam)),
  detail: (id: string) =>
    api.get<RawExam>(`/exams/${id}`).then(normalizeExam),
  leaderboard: (id: string, q?: { limit?: number; offset?: number }) =>
    api
      .get<RawLeaderboard>(`/exams/${id}/leaderboard`, q)
      .then(normalizeLeaderboard),
  save: (id: string) => api.post(`/exams/${id}/save`),
  unsave: (id: string) => api.del(`/exams/${id}/save`),
  start: (id: string) => api.post<ExamAttempt>(`/exams/${id}/start`),
  questions: (attemptId: string) =>
    api
      .get<RawAttemptQuestions>(`/exams/attempts/${attemptId}/questions`)
      .then(normalizeAttemptQuestions),
  sync: (attemptId: string, b: unknown) =>
    api.post(`/exams/attempts/${attemptId}/sync`, b),
  submit: (attemptId: string) =>
    api.post<ExamReport>(`/exams/attempts/${attemptId}/submit`),
  report: (attemptId: string) =>
    api.get<ExamReport>(`/exams/attempts/${attemptId}/report`),
  performance: () => api.get<AnalyticsOverview>("/user/performance"),
};

export const adminExamsApi = {
  create: (body: ExamEditorInput) => api.post<Exam>("/exams", body),
  update: (id: string, body: Partial<ExamEditorInput>) =>
    api.patch<Exam>(`/exams/${id}`, body),
  remove: (id: string) => api.del<{ id: string }>(`/exams/${id}`),
  questions: (examId: string) =>
    api.get<ExamAdminQuestion[]>(`/exams/${examId}/questions`),
  createQuestion: (examId: string, body: ExamQuestionEditorInput) =>
    api.post<ExamAdminQuestion>(`/exams/${examId}/questions`, body),
  updateQuestion: (questionId: string, body: Partial<ExamQuestionEditorInput>) =>
    api.patch<ExamAdminQuestion>(`/exams/questions/${questionId}`, body),
  removeQuestion: (questionId: string) =>
    api.del<{ id: string; examId: string }>(`/exams/questions/${questionId}`),
};
export const practiceApi = {
  categories: () => api.get<Category[]>("/practice/categories"),
  topics: (categoryId: string) =>
    api.get<Topic[]>(`/practice/categories/${categoryId}/topics`),
  topicsByGrouping: (grouping?: PracticeGrouping) =>
    api.get<Topic[]>("/practice/topics", grouping ? { grouping } : undefined),
  sets: (topicId: string) =>
    api.get<PracticeSet[]>(`/practice/topics/${topicId}/sets`),
  questions: (setId: string) =>
    api.get<Question[]>(`/practice/sets/${setId}/questions`),
  topicStats: (topicId: string) =>
    api.get<TopicStats>(`/practice/topics/${topicId}/stats`),
  submitAnswer: (setId: string, b: unknown) =>
    api.post<SubmitAnswerResult>(`/practice/sets/${setId}/submit-answer`, b),
  complete: (setId: string, b: unknown) =>
    api.post(`/practice/sets/${setId}/complete`, b),
  createCategory: (b: unknown) => api.post<Category>("/practice/categories", b),
  createTopic: (form: FormData) => api.upload<Topic>("/practice/topics", form),
  createSet: (b: unknown) => api.post<PracticeSet>("/practice/sets", b),
  createQuestion: (b: unknown) => api.post<Question>("/practice/questions", b),
  updateQuestion: (id: string, b: unknown) =>
    api.put<Question>(`/practice/questions/${id}`, b),
  deleteQuestion: (id: string) => api.del(`/practice/questions/${id}`),
  questionReports: (status?: QuestionReportStatus) =>
    api.get<QuestionReport[]>(
      "/practice/reports",
      status ? { status } : undefined,
    ),
  updateQuestionReportStatus: (id: string, status: QuestionReportStatus) =>
    api.patch<QuestionReport>(`/practice/reports/${id}/status`, { status }),
};

export const coursesApi = {
  list: () => api.get<Course[]>("/courses"),
  detail: (id: string) => api.get<Course>(`/courses/${id}`),
  material: (id: string) => api.get<CourseMaterial>(`/courses/materials/${id}`),
  progress: (id: string, b: unknown) =>
    api.post(`/courses/materials/${id}/progress`, b),
  tutorGet: async (id: string) =>
    normalizeTutorSession(
      await api.get<TutorSession>(`/courses/materials/${id}/tutor`),
    ),
  tutorSend: async (id: string, message: string) =>
    normalizeTutorSession(
      await api.post<TutorSession>(`/courses/materials/${id}/tutor`, {
        message,
      }),
    ),
  tutorClear: (id: string) => api.del(`/courses/materials/${id}/tutor`),
};

export const analyticsApi = {
  dashboard: () => api.get<AnalyticsDashboard>("/analytics/dashboard"),
  adminMarketing: () =>
    api.get<AdminMarketingAnalytics>("/analytics/admin/marketing"),
  overview: () => api.get<AnalyticsOverview>("/analytics/overview"),
  scoreCalculator: (b: { esslceScore?: number; esslceMax?: 600 | 700; uatScore?: number }) =>
    api.post<ScoreCalculatorResult>("/analytics/score-calculator", b),
};

export const streaksApi = {
  me: () => api.get<StreakSummary>("/streaks/me"),
  weekly: () => api.get<WeeklyStreak>("/streaks/weekly"),
  record: (b: unknown) => api.post("/streaks/record-activity", b),
};

export const profileApi = {
  me: () => api.get<Profile>("/profile/me"),
  update: (form: FormData) => api.upload<Profile>("/profile/me", form, "PUT"),
  settings: () => api.get<Settings>("/profile/settings"),
  updateSettings: (b: unknown) => api.put<Settings>("/profile/settings", b),
};

export const notesApi = {
  list: () => api.get<Note[]>("/notes"),
  detail: (id: string) => api.get<Note>(`/notes/${id}`),
  upload: (form: FormData) => api.upload<Note>("/notes/upload", form),
  remove: (id: string) => api.del(`/notes/${id}`),
};

export const notificationsApi = {
  list: (limit = 50) => api.get<AppNotification[]>("/notifications", { limit }),
  unreadCount: () => api.get<{ count: number }>("/notifications/unread-count"),
  markAsRead: (id: string) => api.patch<AppNotification>(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch<{ updatedCount: number }>("/notifications/read-all"),
};

export const savedApi = {
  questions: () => api.get<SavedQuestion[]>("/practice/saved/questions"),
  unsaveQuestion: (id: string) => api.del(`/practice/questions/${id}/save`),
  folders: () => api.get<SavedNoteFolder[]>("/practice/saved/note-folders"),
  notes: (folderId?: string) =>
    api.get<SavedAiNote[]>("/practice/saved/notes", folderId ? { folderId } : undefined),
  createFolder: (name: string) =>
    api.post<SavedNoteFolder>("/practice/saved/note-folders", { name }),
  updateNote: (id: string, body: { title?: string; content?: string; folderId?: string }) =>
    api.patch<SavedAiNote>(`/practice/saved/notes/${id}`, body),
  deleteNote: (id: string) => api.del(`/practice/saved/notes/${id}`),
};

export const referralsStudentApi = {
  me: () => api.get<ReferralStatus>("/referrals/me"),
  requestPayout: (body: { payoutMethod: string; payoutAccount: string }) =>
    api.post("/referrals/payouts", body),
};
