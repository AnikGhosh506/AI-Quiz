export interface Question {
  id: string;
  classLevel: string; // 'Class 6' - 'Class 12'
  subject: string;
  chapter: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  testTitle: string;
  classLevel: string;
  subject: string;
  chapter: string;
  date: string;
  totalQuestions: number;
  score: number; // percentage
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  strongTopics: string[];
  topicsToPractise: string[];
  questions: {
    question: Question;
    selectedAnswer: number | null; // null if skipped
    isCorrect: boolean;
  }[];
}

export const CLASSES_LIST = [
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

export const SUBJECTS_BY_CLASS: Record<string, string[]> = {
  'Class 6': ['Mathematics', 'General Science', 'English & Grammar', 'Social Science'],
  'Class 7': ['Mathematics', 'General Science', 'English & Grammar', 'Social Science'],
  'Class 8': ['Mathematics', 'Science', 'English & Grammar', 'Social Science'],
  'Class 9': ['Mathematics', 'Science (Physics, Chem, Bio)', 'English', 'Social Science'],
  'Class 10': ['Mathematics', 'Science (Physics, Chem, Bio)', 'English Language', 'Social Science'],
  'Class 11': ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
  'Class 12': ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
};

export const CHAPTERS_BY_SUBJECT: Record<string, Record<string, string[]>> = {
  'Class 10': {
    'Mathematics': ['Quadratic Equations', 'Real Numbers', 'Triangles & Trigonometry', 'Arithmetic Progressions', 'Coordinate Geometry'],
    'Science (Physics, Chem, Bio)': ['Light — Reflection & Refraction', 'Chemical Reactions & Equations', 'Life Processes', 'Electricity', 'Acids, Bases & Salts'],
    'English Language': ['Reading Comprehension', 'Tenses & Active-Passive Voice', 'Error Spotting & Vocabulary'],
    'Social Science': ['Rise of Nationalism in Europe', 'Resources and Development', 'Federalism & Democracy'],
  },
  'Class 9': {
    'Mathematics': ['Number Systems', 'Polynomials', 'Linear Equations in Two Variables', 'Lines and Angles'],
    'Science (Physics, Chem, Bio)': ['Matter in Our Surroundings', 'Force and Laws of Motion', 'The Fundamental Unit of Life', 'Gravitation'],
    'English': ['Grammar Fundamentals', 'Reading Comprehension', 'Vocabulary & Synonyms'],
    'Social Science': ['The French Revolution', 'India — Size and Location', 'What is Democracy?'],
  },
  'Class 8': {
    'Mathematics': ['Rational Numbers', 'Linear Equations', 'Understanding Quadrilaterals', 'Squares & Square Roots'],
    'Science': ['Crop Production & Management', 'Microorganisms: Friend and Foe', 'Combustion & Flame', 'Cell Structure & Functions'],
    'English & Grammar': ['Parts of Speech', 'Direct and Indirect Speech', 'Sentence Formation'],
    'Social Science': ['How, When and Where', 'From Trade to Territory', 'The Indian Constitution'],
  },
  'Class 7': {
    'Mathematics': ['Integers', 'Fractions and Decimals', 'Simple Equations', 'Lines and Angles'],
    'General Science': ['Nutrition in Plants', 'Heat and Temperature', 'Acids, Bases and Salts', 'Physical and Chemical Changes'],
    'English & Grammar': ['Nouns, Pronouns & Adjectives', 'Verb Tenses', 'Paragraph Reading'],
    'Social Science': ['Tracing Changes Through a Thousand Years', 'Environment & Ecosystems', 'Role of the Government in Health'],
  },
  'Class 6': {
    'Mathematics': ['Knowing Our Numbers', 'Whole Numbers', 'Playing with Numbers', 'Basic Geometrical Ideas'],
    'General Science': ['Food: Where Does It Come From?', 'Components of Food', 'Sorting Materials into Groups', 'Separation of Substances'],
    'English & Grammar': ['Sentences and Punctuation', 'Nouns and Articles', 'Reading Short Stories'],
    'Social Science': ['What, Where, How and When?', 'The Earth in the Solar System', 'Diversity and Discrimination'],
  },
  'Class 11': {
    'Physics': ['Units and Measurements', 'Kinematics: Motion in a Straight Line', 'Laws of Motion', 'Work, Energy and Power', 'Gravitation'],
    'Chemistry': ['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements', 'Chemical Bonding & Molecular Structure'],
    'Mathematics': ['Sets and Functions', 'Trigonometric Functions', 'Complex Numbers and Quadratic Equations', 'Sequences and Series'],
    'Biology': ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Cell: The Unit of Life'],
  },
  'Class 12': {
    'Physics': ['Electric Charges and Fields', 'Electrostatic Potential and Capacitance', 'Current Electricity', 'Moving Charges and Magnetism', 'Ray Optics'],
    'Chemistry': ['Solutions', 'Electrochemistry', 'Chemical Kinetics', 'd- and f-Block Elements', 'Coordination Compounds'],
    'Mathematics': ['Relations and Functions', 'Matrices and Determinants', 'Continuity and Differentiability', 'Integrals', 'Probability'],
    'Biology': ['Reproduction in Organisms', 'Principles of Inheritance and Variation', 'Molecular Basis of Inheritance', 'Biotechnology: Principles'],
  },
};

// Rich question bank for tests
export const QUESTION_BANK: Question[] = [
  // --- Class 10 Math ---
  {
    id: 'c10_m_1',
    classLevel: 'Class 10',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    topic: 'Roots of Quadratic Equation',
    question: 'If the roots of the quadratic equation 2x² - 8x + k = 0 are real and equal, what is the value of k?',
    options: ['k = 4', 'k = 8', 'k = 16', 'k = 2'],
    correctAnswer: 1,
    explanation: 'For real and equal roots, the discriminant D = b² - 4ac must equal 0. Here a = 2, b = -8, c = k. So (-8)² - 4(2)(k) = 0 => 64 - 8k = 0 => 8k = 64 => k = 8.',
  },
  {
    id: 'c10_m_2',
    classLevel: 'Class 10',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    topic: 'Factorization & Solving',
    question: 'Solve for x: x² - 5x + 6 = 0.',
    options: ['x = 2 or x = 3', 'x = -2 or x = -3', 'x = 1 or x = 6', 'x = -1 or x = -6'],
    correctAnswer: 0,
    explanation: 'Factorizing x² - 5x + 6 gives (x - 2)(x - 3) = 0. Therefore, the solutions are x = 2 and x = 3.',
  },
  {
    id: 'c10_m_3',
    classLevel: 'Class 10',
    subject: 'Mathematics',
    chapter: 'Triangles & Trigonometry',
    topic: 'Trigonometric Identities',
    question: 'What is the value of (sin² 30° + cos² 30°)?',
    options: ['0', '1/2', '1', '√3/2'],
    correctAnswer: 2,
    explanation: 'By the fundamental trigonometric identity, sin² θ + cos² θ = 1 for any angle θ. Specifically, (1/2)² + (√3/2)² = 1/4 + 3/4 = 1.',
  },
  {
    id: 'c10_m_4',
    classLevel: 'Class 10',
    subject: 'Mathematics',
    chapter: 'Arithmetic Progressions',
    topic: 'nth Term Calculation',
    question: 'Find the 10th term of the arithmetic progression (AP): 2, 7, 12, 17...',
    options: ['45', '47', '50', '52'],
    correctAnswer: 1,
    explanation: 'First term a = 2, common difference d = 7 - 2 = 5. The nth term formula is a_n = a + (n - 1)d. For n = 10: a_10 = 2 + (10 - 1)(5) = 2 + 45 = 47.',
  },
  {
    id: 'c10_m_5',
    classLevel: 'Class 10',
    subject: 'Mathematics',
    chapter: 'Real Numbers',
    topic: 'Fundamental Theorem of Arithmetic',
    question: 'The HCF of 24 and 36 is 12. What is their LCM?',
    options: ['48', '72', '144', '96'],
    correctAnswer: 1,
    explanation: 'We know that HCF × LCM = Product of the two numbers. So 12 × LCM = 24 × 36 = 864 => LCM = 864 / 12 = 72.',
  },

  // --- Class 10 Science ---
  {
    id: 'c10_s_1',
    classLevel: 'Class 10',
    subject: 'Science (Physics, Chem, Bio)',
    chapter: 'Light — Reflection & Refraction',
    topic: 'Spherical Mirrors',
    question: 'A convex mirror of focal length 15 cm is used as a rear-view mirror on a vehicle. What is its radius of curvature?',
    options: ['7.5 cm', '15 cm', '30 cm', '45 cm'],
    correctAnswer: 2,
    explanation: 'The radius of curvature R is twice the focal length (R = 2f). Since f = 15 cm, R = 2 × 15 = 30 cm.',
  },
  {
    id: 'c10_s_2',
    classLevel: 'Class 10',
    subject: 'Science (Physics, Chem, Bio)',
    chapter: 'Chemical Reactions & Equations',
    topic: 'Types of Chemical Reactions',
    question: 'When calcium oxide (quicklime) reacts vigorously with water to produce slaked lime, which type of reaction takes place?',
    options: ['Combination and exothermic reaction', 'Decomposition and endothermic reaction', 'Displacement reaction only', 'Neutralization reaction only'],
    correctAnswer: 0,
    explanation: 'CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat. Two reactants combine into a single product (combination reaction) and large amount of heat is liberated (exothermic reaction).',
  },
  {
    id: 'c10_s_3',
    classLevel: 'Class 10',
    subject: 'Science (Physics, Chem, Bio)',
    chapter: 'Life Processes',
    topic: 'Human Circulatory System',
    question: 'Which chamber of the human heart receives oxygen-rich blood from the lungs via the pulmonary veins?',
    options: ['Right atrium', 'Right ventricle', 'Left atrium', 'Left ventricle'],
    correctAnswer: 2,
    explanation: 'Oxygenated blood from the lungs travels through pulmonary veins into the left atrium. The left atrium then pumps it to the left ventricle, which delivers it to the rest of the body.',
  },
  {
    id: 'c10_s_4',
    classLevel: 'Class 10',
    subject: 'Science (Physics, Chem, Bio)',
    chapter: 'Electricity',
    topic: "Ohm's Law & Resistance",
    question: 'If a resistor of 10 Ω is connected across a potential difference of 5 V, what current flows through it?',
    options: ['2 A', '0.5 A', '50 A', '0.2 A'],
    correctAnswer: 1,
    explanation: "According to Ohm's Law (V = IR), the current I = V / R. With V = 5 V and R = 10 Ω: I = 5 / 10 = 0.5 Amperes.",
  },

  // --- Class 9 Science & Math ---
  {
    id: 'c9_s_1',
    classLevel: 'Class 9',
    subject: 'Science (Physics, Chem, Bio)',
    chapter: 'Force and Laws of Motion',
    topic: "Newton's Second Law",
    question: 'A net force of 20 N acts on a mass of 4 kg. What acceleration is produced?',
    options: ['80 m/s²', '5 m/s²', '16 m/s²', '0.2 m/s²'],
    correctAnswer: 1,
    explanation: "By Newton's Second Law of Motion: Force = Mass × Acceleration (F = ma). So acceleration a = F / m = 20 N / 4 kg = 5 m/s².",
  },
  {
    id: 'c9_m_1',
    classLevel: 'Class 9',
    subject: 'Mathematics',
    chapter: 'Number Systems',
    topic: 'Rational vs Irrational Numbers',
    question: 'Which of the following numbers is an irrational number?',
    options: ['√16', '3.14', '√7', '22/7'],
    correctAnswer: 2,
    explanation: '√7 has a non-terminating, non-repeating decimal expansion, making it irrational. √16 = 4, 3.14 is a terminating decimal, and 22/7 is expressed as p/q with integers p and q.',
  },

  // --- Class 8 Science & Math ---
  {
    id: 'c8_s_1',
    classLevel: 'Class 8',
    subject: 'Science',
    chapter: 'Cell Structure & Functions',
    topic: 'Plant vs Animal Cells',
    question: 'Which cell organelle is found in plant cells but absent in animal cells?',
    options: ['Mitochondria', 'Cell wall', 'Nucleus', 'Endoplasmic reticulum'],
    correctAnswer: 1,
    explanation: 'Plant cells have a rigid outer cell wall made of cellulose for structural support, which is absent in animal cells.',
  },
  {
    id: 'c8_m_1',
    classLevel: 'Class 8',
    subject: 'Mathematics',
    chapter: 'Linear Equations',
    topic: 'Solving Linear Equations',
    question: 'If 3x + 7 = 22, what is the value of x?',
    options: ['x = 4', 'x = 5', 'x = 6', 'x = 7'],
    correctAnswer: 1,
    explanation: 'Subtracting 7 from both sides gives 3x = 15. Dividing both sides by 3 gives x = 5.',
  },

  // --- Class 7 Math & Science ---
  {
    id: 'c7_m_1',
    classLevel: 'Class 7',
    subject: 'Mathematics',
    chapter: 'Integers',
    topic: 'Multiplication of Integers',
    question: 'Calculate: (-4) × (-5) × (-2).',
    options: ['40', '-40', '20', '-20'],
    correctAnswer: 1,
    explanation: 'First, (-4) × (-5) = +20 (product of two negative integers is positive). Then 20 × (-2) = -40 (product of positive and negative integer is negative).',
  },
  {
    id: 'c7_s_1',
    classLevel: 'Class 7',
    subject: 'General Science',
    chapter: 'Nutrition in Plants',
    topic: 'Photosynthesis',
    question: 'What green pigment in leaves traps solar energy for photosynthesis?',
    options: ['Hemoglobin', 'Chlorophyll', 'Carotene', 'Xanthophyll'],
    correctAnswer: 1,
    explanation: 'Chlorophyll is the green pigment in chloroplasts that absorbs sunlight energy and enables plants to synthesize glucose from water and carbon dioxide.',
  },

  // --- Class 6 Math & Science ---
  {
    id: 'c6_m_1',
    classLevel: 'Class 6',
    subject: 'Mathematics',
    chapter: 'Knowing Our Numbers',
    topic: 'Place Value & Operations',
    question: 'How many thousands make 1 Lakh?',
    options: ['10', '100', '1,000', '10,000'],
    correctAnswer: 1,
    explanation: '1 Lakh = 100,000. 1 Thousand = 1,000. Dividing 100,000 by 1,000 gives 100 thousands.',
  },
  {
    id: 'c6_s_1',
    classLevel: 'Class 6',
    subject: 'General Science',
    chapter: 'Components of Food',
    topic: 'Vitamins & Deficiency Diseases',
    question: 'Scurvy is caused by a deficiency of which vitamin?',
    options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
    correctAnswer: 2,
    explanation: 'Vitamin C (ascorbic acid) deficiency causes scurvy, which leads to bleeding gums, skin spots, and delayed wound healing. Citrus fruits are rich in Vitamin C.',
  },

  // --- Class 11 Physics & Math ---
  {
    id: 'c11_p_1',
    classLevel: 'Class 11',
    subject: 'Physics',
    chapter: 'Kinematics: Motion in a Straight Line',
    topic: 'Equations of Motion',
    question: 'A car starts from rest and accelerates uniformly at 2 m/s² for 5 seconds. What distance does it cover?',
    options: ['10 m', '25 m', '50 m', '100 m'],
    correctAnswer: 1,
    explanation: 'Using s = ut + (1/2)at² with initial velocity u = 0, a = 2 m/s², t = 5 s: s = 0 + (1/2)(2)(5²) = 25 meters.',
  },
  {
    id: 'c11_m_1',
    classLevel: 'Class 11',
    subject: 'Mathematics',
    chapter: 'Trigonometric Functions',
    topic: 'Compound Angle Formulas',
    question: 'What is the exact value of sin(75°)?',
    options: ['(√6 - √2) / 4', '(√6 + √2) / 4', '(√3 + 1) / 2', '√2 / 2'],
    correctAnswer: 1,
    explanation: 'sin(75°) = sin(45° + 30°) = sin 45° cos 30° + cos 45° sin 30° = (1/√2)(√3/2) + (1/√2)(1/2) = (√3 + 1)/(2√2) = (√6 + √2)/4.',
  },

  // --- Class 12 Physics & Math ---
  {
    id: 'c12_p_1',
    classLevel: 'Class 12',
    subject: 'Physics',
    chapter: 'Current Electricity',
    topic: "Kirchhoff's Laws",
    question: "Kirchhoff's First Rule (Junction rule) at an electrical circuit node is based on the conservation of which quantity?",
    options: ['Energy', 'Electric charge', 'Linear momentum', 'Magnetic flux'],
    correctAnswer: 1,
    explanation: "Kirchhoff's junction rule states that the total current entering a junction equals the total current leaving it. This directly expresses the conservation of electric charge.",
  },
  {
    id: 'c12_m_1',
    classLevel: 'Class 12',
    subject: 'Mathematics',
    chapter: 'Matrices and Determinants',
    topic: 'Properties of Determinants',
    question: 'If A is an invertible square matrix of order 3 and det(A) = 4, what is det(2A)?',
    options: ['8', '16', '32', '64'],
    correctAnswer: 2,
    explanation: 'For an n × n matrix and scalar k, det(kA) = k^n · det(A). Here n = 3 and k = 2, so det(2A) = 2³ · det(A) = 8 · 4 = 32.',
  },
];

// Helper to get questions for a test
export function getQuestionsForTest(classLevel: string, subject?: string, chapter?: string, limit: number = 5): Question[] {
  let filtered = QUESTION_BANK.filter((q) => q.classLevel === classLevel);
  if (subject) {
    filtered = filtered.filter((q) => q.subject.toLowerCase() === subject.toLowerCase());
  }
  if (chapter) {
    filtered = filtered.filter((q) => q.chapter.toLowerCase() === chapter.toLowerCase());
  }
  // If not enough questions in exact filter, supplement from the same class or bank
  if (filtered.length < limit) {
    const fallback = QUESTION_BANK.filter((q) => !filtered.some((f) => f.id === q.id));
    filtered = [...filtered, ...fallback];
  }
  return filtered.slice(0, limit);
}

// Universal Demo Quiz (5 diverse questions across classes that any visitor can try immediately)
export const DEMO_QUIZ_QUESTIONS: Question[] = [
  QUESTION_BANK[0], // Class 10 Math (Roots)
  QUESTION_BANK[5], // Class 10 Science (Light)
  QUESTION_BANK[9], // Class 9 Physics (Newton's 2nd law)
  QUESTION_BANK[11], // Class 8 Science (Cell Wall)
  QUESTION_BANK[18], // Class 12 Physics (Kirchhoff's law)
];
