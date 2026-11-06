import { QuizResult } from '../data/quizData';

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  classLevel: string; // 'Class 6' - 'Class 12'
  joinedDate: string;
}

const STORAGE_KEY_USER = 'aurix_student_session';
const STORAGE_KEY_RESULTS = 'aurix_quiz_results';
const STORAGE_KEY_INTENDED_ROUTE = 'aurix_intended_route';

export const authService = {
  // Get active student session from localStorage
  getCurrentUser(): StudentUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (!data) return null;
      return JSON.parse(data) as StudentUser;
    } catch (e) {
      console.error('Failed to read auth state from localStorage', e);
      return null;
    }
  },

  // Log in existing student
  login(email: string, academicClass: string = 'Class 10'): StudentUser {
    const defaultName = email.split('@')[0] || 'Student';
    // Format name nicely
    const cleanName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
    const user: StudentUser = {
      id: 'student_' + Date.now(),
      name: cleanName,
      email,
      classLevel: academicClass,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  },

  // Register new student
  signup(name: string, email: string, classLevel: string): StudentUser {
    const user: StudentUser = {
      id: 'student_' + Date.now(),
      name: name.trim() || 'Student',
      email: email.trim(),
      classLevel: classLevel || 'Class 10',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  },

  // Log out student
  logout(): void {
    localStorage.removeItem(STORAGE_KEY_USER);
  },

  // Intended route memory (so after login, student returns to the page they originally requested)
  setIntendedRoute(routeId: string): void {
    localStorage.setItem(STORAGE_KEY_INTENDED_ROUTE, routeId);
  },

  getIntendedRoute(): string | null {
    return localStorage.getItem(STORAGE_KEY_INTENDED_ROUTE);
  },

  clearIntendedRoute(): void {
    localStorage.removeItem(STORAGE_KEY_INTENDED_ROUTE);
  },

  // Save student test results
  saveQuizResult(result: QuizResult): void {
    try {
      const existing = this.getQuizResults();
      const updated = [result, ...existing];
      localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save quiz result', e);
    }
  },

  // Get student test history
  getQuizResults(): QuizResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_RESULTS);
      if (!data) return [];
      return JSON.parse(data) as QuizResult[];
    } catch (e) {
      console.error('Failed to read quiz results', e);
      return [];
    }
  },

  // Clear student test history
  clearQuizResults(): void {
    localStorage.removeItem(STORAGE_KEY_RESULTS);
  },
};
