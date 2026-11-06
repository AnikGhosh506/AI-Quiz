export interface SavedTestResult {
  id: string;
  testTitle: string;
  subject: string;
  classLevel: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  timeSpentSeconds: number;
  weakTopics: string[];
  strongTopics: string[];
}

export interface SavedProgressReport {
  lastUpdated: string;
  totalXP: number;
  quizzesTaken: number;
  accuracy: number;
  currentStreakDays: number;
  subjectScores: {
    Physics: number;
    Math: number;
    Chemistry: number;
    Biology: number;
    English: number;
  };
  milestones: Array<{
    id: string;
    title: string;
    subject: string;
    completedDate: string;
    badge: string;
    xpEarned: number;
  }>;
}

const DEFAULT_OFFLINE_REPORT: SavedProgressReport = {
  lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  totalXP: 2480,
  quizzesTaken: 38,
  accuracy: 94,
  currentStreakDays: 7,
  subjectScores: {
    Physics: 92,
    Math: 95,
    Chemistry: 84,
    Biology: 88,
    English: 90,
  },
  milestones: [
    {
      id: 'm1',
      title: 'Light & Optics Mastered',
      subject: 'Physics',
      completedDate: 'Nov 1, 2026',
      badge: '🔍 Optics Genius',
      xpEarned: 350,
    },
    {
      id: 'm2',
      title: 'Quadratic Equations 100%',
      subject: 'Math',
      completedDate: 'Nov 3, 2026',
      badge: '📐 Algebra Knight',
      xpEarned: 400,
    },
    {
      id: 'm3',
      title: 'Periodic Classification',
      subject: 'Chemistry',
      completedDate: 'Nov 4, 2026',
      badge: '🧪 Element Explorer',
      xpEarned: 300,
    },
  ],
};

const DEFAULT_TEST_RESULTS: SavedTestResult[] = [
  {
    id: 'res-1',
    testTitle: 'Physics: Electricity & Ohm’s Law',
    subject: 'Physics',
    classLevel: 'Class 10',
    score: 9,
    totalQuestions: 10,
    percentage: 90,
    date: 'Nov 4, 2026',
    timeSpentSeconds: 420,
    weakTopics: ['Resistors in Parallel'],
    strongTopics: ['Ohm’s Law Formula', 'Circuit Diagrams', 'Electric Power'],
  },
  {
    id: 'res-2',
    testTitle: 'Mathematics: Quadratic Equations',
    subject: 'Math',
    classLevel: 'Class 10',
    score: 10,
    totalQuestions: 10,
    percentage: 100,
    date: 'Nov 3, 2026',
    timeSpentSeconds: 360,
    weakTopics: [],
    strongTopics: ['Discriminant Analysis', 'Factorisation Method', 'Word Problems'],
  },
  {
    id: 'res-3',
    testTitle: 'Chemistry: Acids, Bases & Salts',
    subject: 'Chemistry',
    classLevel: 'Class 10',
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    date: 'Nov 1, 2026',
    timeSpentSeconds: 480,
    weakTopics: ['pH Scale Calculations'],
    strongTopics: ['Neutralization Reactions', 'Indicators', 'Salts Formation'],
  },
];

class OfflineStorageService {
  public saveTestResult(result: SavedTestResult) {
    const list = this.getSavedTestResults();
    const updated = [result, ...list.filter((r) => r.id !== result.id)];
    localStorage.setItem('aurix_offline_test_results', JSON.stringify(updated));
  }

  public getSavedTestResults(): SavedTestResult[] {
    const saved = localStorage.getItem('aurix_offline_test_results');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_TEST_RESULTS;
      }
    }
    return DEFAULT_TEST_RESULTS;
  }

  public saveProgressReport(report: SavedProgressReport) {
    localStorage.setItem('aurix_offline_progress_report', JSON.stringify(report));
  }

  public getSavedProgressReport(): SavedProgressReport {
    const saved = localStorage.getItem('aurix_offline_progress_report');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_OFFLINE_REPORT;
      }
    }
    return DEFAULT_OFFLINE_REPORT;
  }
}

export const offlineStorageService = new OfflineStorageService();
