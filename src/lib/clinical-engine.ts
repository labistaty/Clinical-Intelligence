export interface Symptom {
  id: string;
  label: string;
  desc: string;
  longDesc?: string;
  causes?: string[];
  complications?: string[];
  icon: string;
  color: string;
}

export const SYMPTOMS: Symptom[] = [
  { 
    id: 'fever', 
    label: 'Fever', 
    desc: 'Oral temp above 38°C (100.4°F)',
    longDesc: 'Fever is a temporary increase in your body temperature, often due to an illness. It’s a sign that something out of the ordinary is going on in your body.',
    causes: ['Viral infections (flu, cold)', 'Bacterial infections', 'Heat exhaustion', 'Specific inflammatory conditions'],
    complications: ['Dehydration', 'Hallucinations', 'Febrile seizures (in infants)'],
    icon: 'Thermometer', 
    color: 'text-tertiary' 
  },
  { 
    id: 'cough', 
    label: 'Cough', 
    desc: 'Dry or productive chest irritation',
    longDesc: 'A cough is a reflex action to clear your airways of mucus and irritants such as dust or smoke. Most coughs clear up within 3 weeks.',
    causes: ['Common cold or flu', 'Asthma', 'Bronchitis', 'Postnasal drip'],
    complications: ['Chronic throat irritation', 'Disrupted sleep', 'Rib fractures (rare, severe cases)'],
    icon: 'Wind', 
    color: 'text-primary' 
  },
  { 
    id: 'throat', 
    label: 'Sore Throat', 
    desc: 'Pain or scratchiness in the throat',
    longDesc: 'A sore throat is pain, scratchiness or irritation of the throat that often worsens when you swallow.',
    causes: ['Viral infections', 'Strep throat (bacterial)', 'Allergies', 'Dryness or irritants'],
    complications: ['Ear infections', 'Sinusitis', 'Abscess near the tonsils'],
    icon: 'HeartPulse', 
    color: 'text-primary' 
  },
  { 
    id: 'sneezing', 
    label: 'Sneezing', 
    desc: 'Frequent nasal irritation or discharge',
    longDesc: 'Sneezing is a powerful, involuntary expulsion of air from the nose and mouth. It is the body’s way of removing irritants from the nasal mucosa.',
    causes: ['Allergies (hay fever)', 'Common cold', 'Dust or pollen', 'Strong odors'],
    complications: ['Nasal passage irritation', 'Headache from pressure'],
    icon: 'Waves', 
    color: 'text-primary' 
  },
  { 
    id: 'body_ache', 
    label: 'Body Ache', 
    desc: 'Muscle soreness or joint stiffness',
    longDesc: 'Muscle aches (myalgia) are extremely common. Often, people who have body aches can point to the exact cause, such as stress or physical activity.',
    causes: ['Viral infections (Influenza)', 'Physical overexertion', 'Stress and tension', 'Fibromyalgia'],
    complications: ['Reduced mobility', 'Chronic pain syndromes', 'Sleep disturbances'],
    icon: 'Accessibility', 
    color: 'text-primary' 
  },
  { 
    id: 'fatigue', 
    label: 'Fatigue', 
    desc: 'Generalized weakness or exhaustion',
    longDesc: 'Fatigue is a term used to describe an overall feeling of tiredness or lack of energy. It isn’t the same as simply feeling sleepy or drowsy.',
    causes: ['Infections', 'Anemia', 'Stress or depression', 'Lack of sleep'],
    complications: ['Cognitive impairment', 'Reduced physical capacity', 'Depression'],
    icon: 'Bed', 
    color: 'text-primary' 
  },
];

export interface Rule {
  id: string;
  conditions: (symptoms: Record<string, any>) => boolean;
  diagnosis: string;
  confidence: number;
  icd10: string;
  reasoning: string;
}

export const KNOWLEDGE_BASE: Rule[] = [
  {
    id: 'flu_type_a',
    conditions: (s) => s.fever && s.cough && (s.fever.severity > 5 || s.cough.severity > 5),
    diagnosis: "Influenza Type A",
    confidence: 92,
    icd10: "J10.1",
    reasoning: "The acute onset of fever and cough with moderate to high severity is highly characteristic of seasonal influenza."
  },
  {
    id: 'acute_bronchitis',
    conditions: (s) => s.fever && s.cough && (s.fever.severity > 7 || s.cough.duration > 5),
    diagnosis: "Acute Bronchitis",
    confidence: 88,
    icd10: "J20.9",
    reasoning: "High-grade fever combined with a persistent cough suggests significant inflammation of the bronchial tubes."
  },
  {
    id: 'viral_syndrome',
    conditions: (s) => s.body_ache && s.fatigue && s.body_ache.severity > 6,
    diagnosis: "Viral Syndrome",
    confidence: 80,
    icd10: "B34.9",
    reasoning: "Severe body aches and fatigue without localized respiratory symptoms often indicate a systemic viral response."
  },
  {
    id: 'seasonal_allergies',
    conditions: (s) => s.sneezing && s.throat && !s.fever,
    diagnosis: "Seasonal Allergies",
    confidence: 75,
    icd10: "J30.9",
    reasoning: "Sneezing and throat irritation in the absence of fever is a classic presentation of allergic rhinitis."
  },
  {
    id: 'common_cold',
    conditions: (s) => s.cough || s.sneezing || s.throat,
    diagnosis: "Common Cold",
    confidence: 85,
    icd10: "J00",
    reasoning: "The presence of mild upper respiratory symptoms matches the profile of a standard viral rhinovirus infection."
  }
];

export function runInference(symptoms: Record<string, any>) {
  for (const rule of KNOWLEDGE_BASE) {
    if (rule.conditions(symptoms)) {
      return rule;
    }
  }
  return {
    diagnosis: "Undetermined Viral Infection",
    confidence: 50,
    icd10: "B34.9",
    reasoning: "The provided symptoms do not perfectly match a specific high-confidence rule, suggesting a general viral presentation."
  };
}

export function formatDiagnosis(symptoms: Record<string, any>) {
  const result = runInference(symptoms);
  const selectedLabels = Object.keys(symptoms).map(id => {
    return SYMPTOMS.find(s => s.id === id)?.label || id;
  });

  return {
    ...result,
    symptoms: selectedLabels,
    timestamp: new Date().toISOString()
  };
}
