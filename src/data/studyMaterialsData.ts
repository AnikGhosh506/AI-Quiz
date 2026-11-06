export interface StudyMaterial {
  id: string;
  classLevel: string;
  subject: string;
  chapter: string;
  title: string;
  summary: string;
  readTimeMinutes: number;
  type: 'chapter_notes' | 'formula_sheet' | 'flashcard' | 'pdf_guide';
  downloadUrl?: string;
  keyPoints: string[];
  formulas?: { name: string; formula: string; explanation: string }[];
  flashcards?: { question: string; answer: string }[];
}

export const STUDY_MATERIALS: StudyMaterial[] = [
  // Class 10 Science / Physics
  {
    id: 'mat-10-phy-1',
    classLevel: 'Class 10',
    subject: 'Physics',
    chapter: 'Electricity & Circuits',
    title: 'Ohm’s Law, Resistance & Circuit Power Master Guide',
    summary: 'Complete guide covering Ohm’s law, series vs parallel resistor combinations, Joule’s law of heating, and electric power calculations.',
    readTimeMinutes: 8,
    type: 'chapter_notes',
    downloadUrl: '/study_guides/electricity_class10.pdf',
    keyPoints: [
      'Electric Current (I = Q/t): Rate of flow of electric charges measured in Amperes (A).',
      'Ohm’s Law (V = I × R): Potential difference across a conductor is directly proportional to current at constant temperature.',
      'Resistors in Series (R_eq = R1 + R2 + R3): Current remains constant, potential difference divides.',
      'Resistors in Parallel (1/R_eq = 1/R1 + 1/R2 + 1/R3): Voltage remains constant, current divides.',
      'Joule’s Heating Effect (H = I²Rt = VIt): Heat produced in a resistor over time t.',
    ],
    formulas: [
      { name: 'Ohm’s Law', formula: 'V = I × R', explanation: 'V = Voltage (Volts), I = Current (Amps), R = Resistance (Ohms)' },
      { name: 'Electrical Power', formula: 'P = V × I = I²R = V²/R', explanation: 'Power dissipated in Watts (W)' },
      { name: 'Equivalent Parallel Resistance', formula: '1 / R_eq = 1/R1 + 1/R2', explanation: 'Total resistance for parallel combination' },
    ],
    flashcards: [
      { question: 'What is the SI unit of electric resistance?', answer: 'Ohm (Ω)' },
      { question: 'What happens to total resistance when resistors are connected in parallel?', answer: 'The total equivalent resistance decreases and is smaller than the smallest individual resistance.' },
      { question: 'State Joule’s Law of Heating.', answer: 'Heat produced H = I²Rt is proportional to the square of current, resistance, and time.' },
    ],
  },

  // Class 10 Mathematics
  {
    id: 'mat-10-[#math]-1',
    classLevel: 'Class 10',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    title: 'Standard Form, Factorisation & Discriminant Formula Sheet',
    summary: 'Comprehensive revision guide for solving quadratic equations ax² + bx + c = 0, determining roots using the quadratic formula, and analyzing the discriminant Δ.',
    readTimeMinutes: 10,
    type: 'formula_sheet',
    downloadUrl: '/study_guides/quadratic_equations_class10.pdf',
    keyPoints: [
      'Standard Form: ax² + bx + c = 0 where a ≠ 0.',
      'Discriminant (D = b² - 4ac): Determines the nature of roots.',
      'Real & Distinct Roots: D > 0 (Two separate real solutions).',
      'Real & Equal Roots: D = 0 (Two identical real solutions x = -b / 2a).',
      'No Real Roots: D < 0 (Complex imaginary roots).',
    ],
    formulas: [
      { name: 'Quadratic Formula', formula: 'x = (-b ± √(b² - 4ac)) / (2a)', explanation: 'Finds exact roots for any quadratic equation' },
      { name: 'Discriminant', formula: 'Δ = b² - 4ac', explanation: 'Tests nature of roots' },
      { name: 'Sum & Product of Roots', formula: 'α + β = -b/a  |  α × β = c/a', explanation: 'Relationship between coefficients and roots' },
    ],
    flashcards: [
      { question: 'What is the nature of roots when b² - 4ac = 0?', answer: 'Two real and equal roots.' },
      { question: 'Write the quadratic formula.', answer: 'x = (-b ± √(b² - 4ac)) / (2a)' },
    ],
  },

  // Class 10 Chemistry
  {
    id: 'mat-10-chem-1',
    classLevel: 'Class 10',
    subject: 'Chemistry',
    chapter: 'Acids, Bases & Salts',
    title: 'pH Scale, Indicators & Chemical Reactions Summary',
    summary: 'High-yield notes on pH values, neutralisation reactions, preparation of bleaching powder, baking soda, washing soda, and plaster of Paris.',
    readTimeMinutes: 7,
    type: 'chapter_notes',
    downloadUrl: '/study_guides/acids_bases_salts.pdf',
    keyPoints: [
      'Acids produce H+ (or H3O+) ions in aqueous solutions (pH < 7).',
      'Bases produce OH- ions in aqueous solutions (pH > 7).',
      'Neutralisation: Acid + Base → Salt + Water.',
      'Plaster of Paris: CaSO4 · 1/2 H2O (hardens to Gypsum CaSO4 · 2H2O when mixed with water).',
    ],
    formulas: [
      { name: 'Bleaching Powder', formula: 'CaOCl2', explanation: 'Produced by action of chlorine on dry slaked lime Ca(OH)2' },
      { name: 'Baking Soda', formula: 'NaHCO3', explanation: 'Sodium hydrogen carbonate used in cooking and antacids' },
    ],
    flashcards: [
      { question: 'What gas is evolved when an acid reacts with a metal?', answer: 'Hydrogen gas (H2), which burns with a pop sound.' },
      { question: 'What is the chemical formula of Plaster of Paris?', answer: 'CaSO4 · 1/2 H2O (Calcium sulphate hemihydrate).' },
    ],
  },

  // Class 11 Physics
  {
    id: 'mat-11-phy-1',
    classLevel: 'Class 11',
    subject: 'Physics',
    chapter: 'Kinematics & Motion in 2D',
    title: 'Projectile Motion & Vector Resolution High-Yield Notes',
    summary: 'Master equations of motion, time of flight T, maximum height H, and horizontal range R for projectile trajectories.',
    readTimeMinutes: 12,
    type: 'pdf_guide',
    downloadUrl: '/study_guides/projectile_motion_class11.pdf',
    keyPoints: [
      'Horizontal component of velocity (u cos θ) remains constant throughout flight.',
      'Vertical component of velocity (u sin θ) undergoes acceleration due to gravity (-g).',
      'Time of Flight: T = (2 u sin θ) / g.',
      'Maximum Height: H = (u² sin² θ) / (2g).',
      'Horizontal Range: R = (u² sin 2θ) / g (Maximum at θ = 45°).',
    ],
    formulas: [
      { name: 'Time of Flight', formula: 'T = 2u sinθ / g', explanation: 'Total time in the air' },
      { name: 'Maximum Range Angle', formula: 'R_max = u² / g (at θ = 45°)', explanation: 'Achieves maximum horizontal displacement' },
    ],
    flashcards: [
      { question: 'At what angle of projection is the horizontal range maximum?', answer: '45 degrees' },
      { question: 'What is the acceleration along the horizontal direction in projectile motion?', answer: 'Zero (a_x = 0)' },
    ],
  },

  // Class 9 Science
  {
    id: 'mat-9-sci-1',
    classLevel: 'Class 9',
    subject: 'Science',
    chapter: 'Force & Laws of Motion',
    title: 'Newton’s 3 Laws of Motion & Momentum Revision Cards',
    summary: 'Core concepts of inertia, momentum P = mv, statement of Newton’s three laws, and conservation of linear momentum.',
    readTimeMinutes: 6,
    type: 'flashcard',
    downloadUrl: '/study_guides/force_motion_class9.pdf',
    keyPoints: [
      '1st Law (Inertia): An object remains at rest or uniform motion unless acted upon by an external unbalanced force.',
      '2nd Law (F = ma): Rate of change of momentum is directly proportional to applied force.',
      '3rd Law (Action-Reaction): For every action, there is an equal and opposite reaction.',
    ],
    formulas: [
      { name: 'Momentum', formula: 'P = m × v', explanation: 'Product of mass (kg) and velocity (m/s)' },
      { name: 'Force Equation', formula: 'F = m × a', explanation: 'Derived from Newton’s 2nd Law' },
    ],
    flashcards: [
      { question: 'State Newton’s Second Law of Motion mathematically.', answer: 'F = m × a (Force = mass × acceleration).' },
      { question: 'What is inertia?', answer: 'The natural tendency of an object to resist changes in its state of motion or rest.' },
    ],
  },
];
