import { QuizResult } from '../data/quizData';
import { db, auth } from '../firebase';
import { collection, doc, setDoc, getDocs, getDoc, deleteDoc } from 'firebase/firestore';

export type AuthProviderType = 'email' | 'phone' | 'google' | 'microsoft' | 'apple' | 'github';

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  classLevel: string;
  joinedDate: string;
  schoolName: string;
  schoolBoard?: string;
  schoolCity?: string;
  studentIdNumber?: string;
  rollNumber?: string;
  verificationMethod: 'ai_digital' | 'manual';
  verificationStatus: 'verified' | 'pending';
  verifiedAt?: string;
  idCardPhotoUrl?: string;
  authProvider?: AuthProviderType;
  aiConfidenceScore?: number;
  aiVerificationSummary?: string;
  isEmailVerified?: boolean;
}

export interface SignupPayload {
  name: string;
  email: string;
  phoneNumber?: string;
  classLevel: string;
  schoolName: string;
  schoolBoard?: string;
  schoolCity?: string;
  studentIdNumber?: string;
  rollNumber?: string;
  verificationMethod: 'ai_digital' | 'manual';
  verificationStatus: 'verified' | 'pending';
  idCardPhotoUrl?: string;
  authProvider?: AuthProviderType;
  aiConfidenceScore?: number;
  aiVerificationSummary?: string;
}

export interface ParentUser {
  id: string;
  parentName: string;
  email: string;
  phoneNumber?: string;
  relationship: 'Father' | 'Mother' | 'Guardian';
  linkedStudentEmail: string;
  linkedStudentName: string;
  linkedStudentClass?: string;
  linkedStudentSchool?: string;
  linkedStudentRoll?: string;
  loginDate: string;
}

const STORAGE_KEY_USER = 'aurix_student_session';
const STORAGE_KEY_RESULTS = 'aurix_quiz_results';
const STORAGE_KEY_INTENDED_ROUTE = 'aurix_intended_route';
const STORAGE_KEY_REGISTRY = 'aurix_registered_students';
const STORAGE_KEY_PARENT = 'aurix_parent_session';

const SEEDED_STUDENTS: Record<string, StudentUser> = {
  'arpitaghosh2167@gmail.com': {
    id: 'student_arpita_2167',
    name: 'Arpita Ghosh',
    email: 'arpitaghosh2167@gmail.com',
    classLevel: 'Class 10',
    joinedDate: 'Nov 2026',
    schoolName: 'Delhi Public School (DPS RK Puram)',
    schoolBoard: 'CBSE',
    schoolCity: 'New Delhi',
    studentIdNumber: 'DPS-2026-8912',
    rollNumber: '18',
    verificationMethod: 'ai_digital',
    verificationStatus: 'verified',
    verifiedAt: 'Nov 5, 2026',
    authProvider: 'email',
    aiConfidenceScore: 98,
    aiVerificationSummary: 'AI Authenticated Official School ID Card.',
    isEmailVerified: true,
  },
  'student@school.edu': {
    id: 'student_demo_101',
    name: 'Saheb Mukherjee',
    email: 'student@school.edu',
    classLevel: 'Class 10',
    joinedDate: 'Oct 2026',
    schoolName: "St. Xavier's Collegiate School",
    schoolBoard: 'ICSE',
    schoolCity: 'Kolkata',
    studentIdNumber: 'STX-2026-4011',
    rollNumber: '07',
    verificationMethod: 'ai_digital',
    verificationStatus: 'verified',
    verifiedAt: 'Oct 14, 2026',
    authProvider: 'email',
    aiConfidenceScore: 96,
    aiVerificationSummary: 'AI Authenticated Official School ID Card.',
    isEmailVerified: true,
  },
};

export const authService = {
  getCurrentUser(): StudentUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (data) {
        return JSON.parse(data) as StudentUser;
      }
      const registry = this.getRegistry();
      const defaultUser = registry['arpitaghosh2167@gmail.com'] || Object.values(registry)[0];
      if (defaultUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultUser));
        return defaultUser;
      }
      return null;
    } catch (e) {
      console.error('Failed to read auth state from localStorage', e);
      return null;
    }
  },

  getRegistry(): Record<string, StudentUser> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_REGISTRY);
      const customUsers = data ? (JSON.parse(data) as Record<string, StudentUser>) : {};
      return { ...SEEDED_STUDENTS, ...customUsers };
    } catch (e) {
      console.error('Failed to read student registry', e);
      return { ...SEEDED_STUDENTS };
    }
  },

  saveUserToRegistry(user: StudentUser): void {
    try {
      const current = this.getRegistry();
      const updated = {
        ...current,
        [user.email.toLowerCase()]: user,
        ...(user.phoneNumber ? { [user.phoneNumber]: user } : {}),
      };
      localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(updated));

      // Persist permanently in Firebase Firestore
      const docRef = doc(db, 'students', user.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_'));
      setDoc(docRef, { ...user, updatedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
        console.warn('Firestore user save notice:', err);
      });
    } catch (e) {
      console.error('Failed to update student registry', e);
    }
  },

  isEmailRegistered(email: string): boolean {
    if (!email) return false;
    const registry = this.getRegistry();
    return !!registry[email.trim().toLowerCase()];
  },

  isPhoneRegistered(phone: string): boolean {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\s+/g, '');
    const registry = this.getRegistry();
    return !!registry[cleanPhone];
  },

  getUserByIdentifier(identifier: string): StudentUser | null {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    const registry = this.getRegistry();
    return registry[clean] || registry[identifier.replace(/\s+/g, '')] || null;
  },

  checkAndLoginWithEmail(email: string): { isNewUser: boolean; user?: StudentUser } {
    const cleanEmail = email.trim().toLowerCase();
    const registeredUser = this.getUserByIdentifier(cleanEmail);

    if (registeredUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(registeredUser));
      this.saveUserToRegistry(registeredUser);
      return { isNewUser: false, user: registeredUser };
    }
    return { isNewUser: true };
  },

  login(email: string, academicClass: string = 'Class 10'): StudentUser {
    const cleanEmail = email.trim().toLowerCase();
    const existing = this.getUserByIdentifier(cleanEmail);

    if (existing) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(existing));
      return existing;
    }

    const defaultName = cleanEmail.split('@')[0] || 'Student';
    const cleanName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

    const user: StudentUser = {
      id: 'student_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      classLevel: academicClass,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      schoolName: 'Delhi Public School (DPS RK Puram)',
      schoolBoard: 'CBSE',
      schoolCity: 'New Delhi',
      studentIdNumber: 'AURIX-' + Math.floor(100000 + Math.random() * 900000),
      rollNumber: '24',
      verificationMethod: 'ai_digital',
      verificationStatus: 'verified',
      verifiedAt: 'Verified Student ID',
      authProvider: 'email',
      isEmailVerified: true,
    };
    this.saveUserToRegistry(user);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  },

  loginWithProvider(
    provider: AuthProviderType,
    profileData: {
      name: string;
      email: string;
      avatarUrl?: string;
      classLevel?: string;
      schoolName?: string;
      schoolBoard?: string;
      studentIdNumber?: string;
    }
  ): { isNewUser: boolean; user: StudentUser } {
    const cleanEmail = profileData.email.trim().toLowerCase();
    const existing = this.getUserByIdentifier(cleanEmail);

    if (existing) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(existing));
      return { isNewUser: false, user: existing };
    }

    const user: StudentUser = {
      id: `${provider}_student_` + Date.now(),
      name: profileData.name.trim() || 'Student',
      email: cleanEmail,
      classLevel: profileData.classLevel || 'Class 10',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      schoolName: profileData.schoolName || 'Delhi Public School (DPS RK Puram)',
      schoolBoard: profileData.schoolBoard || 'CBSE',
      schoolCity: 'New Delhi',
      studentIdNumber: profileData.studentIdNumber || provider.substring(0, 3).toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000),
      rollNumber: '12',
      verificationMethod: 'ai_digital',
      verificationStatus: 'verified',
      verifiedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      authProvider: provider,
      isEmailVerified: true,
    };

    this.saveUserToRegistry(user);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return { isNewUser: true, user };
  },

  verifyPhoneOtp(
    phoneNumber: string,
    enteredOtp: string
  ): { success: boolean; isNewUser: boolean; user?: StudentUser } {
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    if (enteredOtp !== '7492' && enteredOtp.length !== 4) {
      return { success: false, isNewUser: false };
    }

    const existing = this.getUserByIdentifier(cleanPhone);
    if (existing) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(existing));
      return { success: true, isNewUser: false, user: existing };
    }

    return { success: true, isNewUser: true };
  },

  signup(payload: SignupPayload): StudentUser {
    const user: StudentUser = {
      id: 'student_' + Date.now(),
      name: payload.name.trim() || 'Student',
      email: payload.email.trim(),
      phoneNumber: payload.phoneNumber,
      classLevel: payload.classLevel || 'Class 10',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      schoolName: payload.schoolName.trim() || 'Delhi Public School',
      schoolBoard: payload.schoolBoard || 'CBSE',
      schoolCity: payload.schoolCity || 'New Delhi',
      studentIdNumber: payload.studentIdNumber || 'AURIX-' + Math.floor(100000 + Math.random() * 900000),
      rollNumber: payload.rollNumber || '01',
      verificationMethod: payload.verificationMethod,
      verificationStatus: payload.verificationStatus,
      verifiedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      idCardPhotoUrl: payload.idCardPhotoUrl,
      authProvider: payload.authProvider || 'email',
      aiConfidenceScore: payload.aiConfidenceScore,
      aiVerificationSummary: payload.aiVerificationSummary,
      isEmailVerified: true,
    };

    this.saveUserToRegistry(user);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY_USER);
  },

  setIntendedRoute(routeId: string): void {
    localStorage.setItem(STORAGE_KEY_INTENDED_ROUTE, routeId);
  },

  getIntendedRoute(): string | null {
    return localStorage.getItem(STORAGE_KEY_INTENDED_ROUTE);
  },

  clearIntendedRoute(): void {
    localStorage.removeItem(STORAGE_KEY_INTENDED_ROUTE);
  },

  // Save student test result to LocalStorage + Firebase Firestore
  saveQuizResult(result: QuizResult): void {
    try {
      const existing = this.getQuizResults();
      const updated = [result, ...existing];
      localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(updated));

      // Persist to Firebase Firestore collection `quizResults`
      const resultDocRef = doc(db, 'quizResults', result.id || 'res_' + Date.now());
      setDoc(resultDocRef, { ...result, savedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
        console.warn('Firestore quiz save notice:', err);
      });
    } catch (e) {
      console.error('Failed to save quiz result', e);
    }
  },

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

  clearQuizResults(): void {
    localStorage.removeItem(STORAGE_KEY_RESULTS);
  },

  updateUserProfile(updates: Partial<StudentUser>): StudentUser | null {
    try {
      const current = this.getCurrentUser();
      if (!current) return null;

      const updated: StudentUser = {
        ...current,
        ...updates,
      };

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      this.saveUserToRegistry(updated);

      return updated;
    } catch (e) {
      console.error('Failed to update user profile', e);
      return null;
    }
  },

  getAllRegisteredStudents(): StudentUser[] {
    const registry = this.getRegistry();
    const seen = new Set<string>();
    const students: StudentUser[] = [];

    Object.values(registry).forEach((user) => {
      const key = user.email.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        students.push(user);
      }
    });

    return students;
  },

  switchAccount(identifier: string): StudentUser | null {
    const target = this.getUserByIdentifier(identifier);
    if (!target) return null;

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(target));
    return target;
  },

  getParentSession(): ParentUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PARENT);
      if (!data) return null;
      return JSON.parse(data) as ParentUser;
    } catch (e) {
      console.error('Failed to read parent session', e);
      return null;
    }
  },

  loginAsParent(payload: {
    parentName: string;
    email: string;
    phoneNumber?: string;
    relationship: 'Father' | 'Mother' | 'Guardian';
    studentEmail: string;
  }): ParentUser {
    const student = this.getUserByIdentifier(payload.studentEmail) || this.getCurrentUser();

    const parentUser: ParentUser = {
      id: 'parent_' + Date.now(),
      parentName: payload.parentName.trim(),
      email: payload.email.trim(),
      phoneNumber: payload.phoneNumber,
      relationship: payload.relationship,
      linkedStudentEmail: student ? student.email : payload.studentEmail,
      linkedStudentName: student ? student.name : 'Linked Student',
      linkedStudentClass: student?.classLevel || 'Class 10',
      linkedStudentSchool: student?.schoolName || 'Delhi Public School',
      linkedStudentRoll: student?.rollNumber || '18',
      loginDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    localStorage.setItem(STORAGE_KEY_PARENT, JSON.stringify(parentUser));

    if (student) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(student));
    }

    // Save parent session to Firestore `parentSessions`
    const parentDocRef = doc(db, 'parentSessions', parentUser.id);
    setDoc(parentDocRef, { ...parentUser, savedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
      console.warn('Firestore parent session save notice:', err);
    });

    return parentUser;
  },

  logoutParent(): void {
    localStorage.removeItem(STORAGE_KEY_PARENT);
  },

  deleteAccount(email: string): { success: boolean; nextUser: StudentUser | null } {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const registry = this.getRegistry();
      delete registry[cleanEmail];
      localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(registry));

      // Remove from Firestore
      const docRef = doc(db, 'students', cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'));
      deleteDoc(docRef).catch(() => {});

      const currentUser = this.getCurrentUser();
      let nextUser: StudentUser | null = null;
      if (currentUser?.email.toLowerCase() === cleanEmail) {
        const remaining = Object.values(registry);
        if (remaining.length > 0) {
          nextUser = remaining[0];
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(nextUser));
        } else {
          localStorage.removeItem(STORAGE_KEY_USER);
        }
      } else {
        nextUser = currentUser;
      }

      return { success: true, nextUser };
    } catch (e) {
      console.error('Failed to delete account:', e);
      return { success: false, nextUser: null };
    }
  },
};
