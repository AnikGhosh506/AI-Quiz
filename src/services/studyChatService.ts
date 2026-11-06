import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

export interface StudyChatMessage {
  id: string;
  roomId: string;
  senderName: string;
  senderEmail?: string;
  senderClass: string;
  senderRole: 'student' | 'moderator_ai';
  messageType: 'text' | 'code' | 'latex' | 'image';
  text: string;
  codeSnippet?: string;
  codeLanguage?: string;
  latexFormula?: string;
  imageUrl?: string;
  timestamp: string;
}

const STORAGE_KEY_CHAT = 'aurix_collaborative_chat_messages';

const INITIAL_CHAT_MESSAGES: Record<string, StudyChatMessage[]> = {
  room_1: [
    {
      id: 'msg_init_1',
      roomId: 'room_1',
      senderName: 'Arpita Ghosh',
      senderClass: 'Class 10',
      senderRole: 'student',
      messageType: 'text',
      text: 'Welcome everyone to the Physics Numericals & Ohm’s law study sprint!',
      timestamp: '10:14 AM',
    },
    {
      id: 'msg_init_2',
      roomId: 'room_1',
      senderName: 'Saheb Mukherjee',
      senderClass: 'Class 10',
      senderRole: 'student',
      messageType: 'latex',
      text: 'Here is the fundamental equation for electric potential difference and current:',
      latexFormula: 'V = I \\cdot R \\quad \\implies \\quad I = \\frac{V}{R}',
      timestamp: '10:16 AM',
    },
    {
      id: 'msg_init_3',
      roomId: 'room_1',
      senderName: 'AURIX AI Moderator',
      senderClass: 'AI Moderator',
      senderRole: 'moderator_ai',
      messageType: 'code',
      text: 'Python simulation helper for calculating equivalent resistance:',
      codeSnippet: `def equivalent_resistance_parallel(resistors):\n    # Calculates 1/R_total = sum(1/R_i)\n    reciprocal_sum = sum(1.0 / r for r in resistors)\n    return 1.0 / reciprocal_sum\n\nprint("R_eq =", equivalent_resistance_parallel([10, 20, 30]), "Ohms")`,
      codeLanguage: 'python',
      timestamp: '10:18 AM',
    },
    {
      id: 'msg_init_4',
      roomId: 'room_1',
      senderName: 'Priya Sharma',
      senderClass: 'Class 10',
      senderRole: 'student',
      messageType: 'image',
      text: 'Circuit schematic diagram for series-parallel resistor configuration:',
      imageUrl: '/src/assets/images/hero_nature_backdrop_1793877327579.jpg',
      timestamp: '10:20 AM',
    },
  ],
};

class StudyChatService {
  private getLocalMessages(): Record<string, StudyChatMessage[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CHAT);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read local chat cache', e);
    }
    return INITIAL_CHAT_MESSAGES;
  }

  private setLocalMessages(messages: Record<string, StudyChatMessage[]>): void {
    try {
      localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not save local chat cache', e);
    }
  }

  async fetchRoomMessages(roomId: string): Promise<StudyChatMessage[]> {
    try {
      const q = query(
        collection(db, 'studyChatMessages'),
        where('roomId', '==', roomId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list: StudyChatMessage[] = [];
        snapshot.forEach((d) => list.push(d.data() as StudyChatMessage));
        const localMap = this.getLocalMessages();
        localMap[roomId] = list;
        this.setLocalMessages(localMap);
        return list;
      }
    } catch (err) {
      console.warn('Firestore fetch studyChatMessages failed, using local offline state:', err);
    }
    const localMap = this.getLocalMessages();
    return localMap[roomId] || [];
  }

  async sendMessage(msg: Omit<StudyChatMessage, 'id' | 'timestamp'>): Promise<StudyChatMessage> {
    const fullMsg: StudyChatMessage = {
      ...msg,
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const localMap = this.getLocalMessages();
    const existing = localMap[msg.roomId] || [];
    localMap[msg.roomId] = [...existing, fullMsg];
    this.setLocalMessages(localMap);

    try {
      await setDoc(doc(db, 'studyChatMessages', fullMsg.id), fullMsg);
    } catch (err) {
      console.warn('Could not sync chat message to Firestore immediately:', err);
    }

    return fullMsg;
  }
}

export const studyChatService = new StudyChatService();
