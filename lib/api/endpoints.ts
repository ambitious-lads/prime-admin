import { api } from "./client";
import type {
  AdminUser,
  AnalyticsDashboard,
  AnalyticsOverview,
  AuthMe,
  AuthSession,
  Category,
  Course,
  CourseMaterial,
  Exam,
  ExamAttempt,
  ExamReport,
  Leaderboard,
  Note,
  PlanCatalogItem,
  PlanKey,
  PlanMe,
  PlanPayment,
  PracticeSet,
  Profile,
  Question,
  ScoreCalculatorResult,
  Settings,
  StreakSummary,
  SubmitAnswerResult,
  Topic,
  TopicStats,
  TutorSession,
  WeeklyStreak,
} from "./types";

export const authApi = {
  register: (b: { phone: string; password: string; fullName: string }) =>
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
  subscribe: (body: { plan: string; receiptUrl?: string; note?: string }) =>
    api.post<{ status: string; message?: string }>("/plans/subscribe", body),
  payments: (status?: string) =>
    api.get<PlanPayment[]>("/plans/payments", status ? { status } : undefined),
  approve: (id: string) =>
    api.post<{ payment: PlanPayment }>(`/plans/payments/${id}/approve`),
  reject: (id: string, reason: string) =>
    api.post<{ payment: PlanPayment }>(`/plans/payments/${id}/reject`, { reason }),
};

export const examsApi = {
  list: (q?: { tab?: string; category?: string; difficulty?: string }) =>
    api.get<Exam[]>("/exams", q),
  detail: (id: string) => api.get<Exam>(`/exams/${id}`),
  leaderboard: (id: string, q?: { limit?: number; offset?: number }) =>
    api.get<Leaderboard>(`/exams/${id}/leaderboard`, q),
  save: (id: string) => api.post(`/exams/${id}/save`),
  unsave: (id: string) => api.del(`/exams/${id}/save`),
  start: (id: string) => api.post<ExamAttempt>(`/exams/${id}/start`),
  questions: (attemptId: string) =>
    api.get<Question[]>(`/exams/attempts/${attemptId}/questions`),
  sync: (attemptId: string, b: unknown) =>
    api.post(`/exams/attempts/${attemptId}/sync`, b),
  submit: (attemptId: string) =>
    api.post<ExamReport>(`/exams/attempts/${attemptId}/submit`),
  report: (attemptId: string) =>
    api.get<ExamReport>(`/exams/attempts/${attemptId}/report`),
  performance: () => api.get<AnalyticsOverview>("/user/performance"),
};

export const practiceApi = {
  categories: () => api.get<Category[]>("/practice/categories"),
  topics: (categoryId: string) =>
    api.get<Topic[]>(`/practice/categories/${categoryId}/topics`),
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
};

export const coursesApi = {
  list: () => api.get<Course[]>("/courses"),
  detail: (id: string) => api.get<Course>(`/courses/${id}`),
  material: (id: string) => api.get<CourseMaterial>(`/courses/materials/${id}`),
  progress: (id: string, b: unknown) =>
    api.post(`/courses/materials/${id}/progress`, b),
  tutorGet: (id: string) => api.get<TutorSession>(`/courses/materials/${id}/tutor`),
  tutorSend: (id: string, message: string) =>
    api.post<TutorSession>(`/courses/materials/${id}/tutor`, { message }),
  tutorClear: (id: string) => api.del(`/courses/materials/${id}/tutor`),
};

export const analyticsApi = {
  dashboard: () => api.get<AnalyticsDashboard>("/analytics/dashboard"),
  overview: () => api.get<AnalyticsOverview>("/analytics/overview"),
  scoreCalculator: (b: { esslceScore?: number; uatScore?: number }) =>
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
