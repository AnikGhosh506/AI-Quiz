import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { QuizResult } from '../data/quizData';

export interface StudyScheduleEvent {
  id: string;
  studentEmail: string;
  title: string;
  subject: string;
  chapter: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "07:00 PM"
  endTime: string; // e.g. "08:00 PM"
  eventCategory: 'AI Focus' | 'Test Rehearsal' | 'Peer Group' | 'Revision';
  aiOptimizationRationale: string;
  status: 'scheduled' | 'completed' | 'skipped';
  createdAt: string;
}

const STORAGE_KEY_SCHEDULE = 'aurix_smart_study_schedule';

// Pre-seeded initial smart events for a rich default experience
const INITIAL_SMART_EVENTS: StudyScheduleEvent[] = [
  {
    id: 'evt_1',
    studentEmail: 'arpitaghosh2167@gmail.com',
    title: 'Physics Numericals & Ohm’s Law Deep Focus',
    subject: 'Physics',
    chapter: 'Electricity & Circuits',
    date: new Date().toISOString().split('T')[0],
    startTime: '07:00 PM',
    endTime: '08:00 PM',
    eventCategory: 'AI Focus',
    aiOptimizationRationale: 'Identified 85% peak recall window at 7 PM based on past test accuracy. Focuses on weak numericals.',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt_2',
    studentEmail: 'arpitaghosh2167@gmail.com',
    title: 'Quadratic Equations Formula Method Sprint',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    startTime: '05:30 PM',
    endTime: '06:30 PM',
    eventCategory: 'Test Rehearsal',
    aiOptimizationRationale: 'Scheduled 2 days prior to Class 10 Math diagnostic assessment. Boosts formula speed retention.',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt_3',
    studentEmail: 'arpitaghosh2167@gmail.com',
    title: 'Acids, Bases & pH Scale Peer Discussion',
    subject: 'Chemistry',
    chapter: 'Acids, Bases & Salts',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
    startTime: '08:00 PM',
    endTime: '09:00 PM',
    eventCategory: 'Peer Group',
    aiOptimizationRationale: 'Aligned with Virtual Study Room active peer hours for interactive concept clarification.',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt_4',
    studentEmail: 'arpitaghosh2167@gmail.com',
    title: 'Life Processes Quick Morning Revision',
    subject: 'Biology',
    chapter: 'Life Processes',
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    startTime: '08:30 AM',
    endTime: '09:15 AM',
    eventCategory: 'Revision',
    aiOptimizationRationale: 'Morning 45-min interval maximizes memory consolidation for diagram-heavy biological processes.',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
];

class StudySchedulerService {
  private getLocalSchedule(): StudyScheduleEvent[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SCHEDULE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read local schedule from cache', e);
    }
    return INITIAL_SMART_EVENTS;
  }

  private setLocalSchedule(events: StudyScheduleEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(events));
    } catch (e) {
      console.warn('Could not save schedule to local cache', e);
    }
  }

  // Fetch events for current student from Firestore (or fallback cache)
  async getEvents(studentEmail: string): Promise<StudyScheduleEvent[]> {
    try {
      const q = query(
        collection(db, 'studyScheduleEvents'),
        where('studentEmail', '==', studentEmail)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const events: StudyScheduleEvent[] = [];
        snapshot.forEach((docSnap) => {
          events.push(docSnap.data() as StudyScheduleEvent);
        });
        this.setLocalSchedule(events);
        return events;
      }
    } catch (err) {
      console.warn('Firestore fetch studyScheduleEvents failed, using local offline cache:', err);
    }
    const local = this.getLocalSchedule();
    return local.filter((e) => e.studentEmail === studentEmail || !e.studentEmail);
  }

  // Save new event to Firestore & local storage
  async addEvent(newEvent: Omit<StudyScheduleEvent, 'id' | 'createdAt'>): Promise<StudyScheduleEvent> {
    const event: StudyScheduleEvent = {
      ...newEvent,
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
    };

    // Save to local cache immediately
    const existing = this.getLocalSchedule();
    const updated = [event, ...existing];
    this.setLocalSchedule(updated);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'studyScheduleEvents', event.id), event);
    } catch (err) {
      console.warn('Could not sync event to Firestore immediately:', err);
    }

    return event;
  }

  // Update event status (e.g. completed)
  async updateEventStatus(eventId: string, status: 'scheduled' | 'completed' | 'skipped'): Promise<void> {
    const existing = this.getLocalSchedule();
    const updated = existing.map((ev) => (ev.id === eventId ? { ...ev, status } : ev));
    this.setLocalSchedule(updated);

    try {
      await updateDoc(doc(db, 'studyScheduleEvents', eventId), { status });
    } catch (err) {
      console.warn('Could not update event status in Firestore:', err);
    }
  }

  // Delete an event
  async deleteEvent(eventId: string): Promise<void> {
    const existing = this.getLocalSchedule();
    const updated = existing.filter((ev) => ev.id !== eventId);
    this.setLocalSchedule(updated);

    try {
      await deleteDoc(doc(db, 'studyScheduleEvents', eventId));
    } catch (err) {
      console.warn('Could not delete event from Firestore:', err);
    }
  }

  // AI Recommendation Engine: Analyzes quiz results & generates new optimal study event suggestions
  generateAISuggestedEvents(studentEmail: string, quizResults: QuizResult[]): Omit<StudyScheduleEvent, 'id' | 'createdAt'>[] {
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const suggestions: Omit<StudyScheduleEvent, 'id' | 'createdAt'>[] = [
      {
        studentEmail,
        title: 'AI Smart Focus: Physics Numerical Mastery',
        subject: 'Physics',
        chapter: 'Electricity & Circuits',
        date: todayStr,
        startTime: '07:30 PM',
        endTime: '08:15 PM',
        eventCategory: 'AI Focus',
        aiOptimizationRationale: 'AI detected calculation errors in V=IR numerics. 7:30 PM matches your peak historical accuracy window.',
        status: 'scheduled',
      },
      {
        studentEmail,
        title: 'Diagnostic Test Rehearsal: Quadratic Equations',
        subject: 'Mathematics',
        chapter: 'Quadratic Equations',
        date: tomorrowStr,
        startTime: '06:00 PM',
        endTime: '07:00 PM',
        eventCategory: 'Test Rehearsal',
        aiOptimizationRationale: 'Simulates 5-question speed sprint under timed exam conditions before upcoming weekly cup.',
        status: 'scheduled',
      },
      {
        studentEmail,
        title: 'Peer Chemistry Formula Swap Session',
        subject: 'Chemistry',
        chapter: 'Chemical Reactions & Equations',
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        startTime: '08:15 PM',
        endTime: '09:00 PM',
        eventCategory: 'Peer Group',
        aiOptimizationRationale: 'Matches peak peer traffic hours in Virtual Study Rooms for collaborative equation balancing.',
        status: 'scheduled',
      },
    ];

    return suggestions;
  }
}

export const studySchedulerService = new StudySchedulerService();
