# Knowledge Base Documentation
## Medical Diagnosis Expert System

This document outlines the knowledge representation and rules used by the Clinical Intelligence Expert System.

### 1. Facts (Symptoms)
The system recognizes the following primary symptoms, each with associated **Severity** (1-10) and **Duration** (Days):

- **Fever**: Elevated body temperature.
- **Cough**: Respiratory irritation.
- **Sore Throat**: Pharyngeal pain.
- **Sneezing**: Nasal irritation.
- **Body Ache**: Systemic muscle pain.
- **Fatigue**: Generalized exhaustion.

### 2. Knowledge Rules
The system uses a rule-based representation. Rules are evaluated in order of specificity to ensure the most accurate diagnosis is prioritized.

#### Rule 1: Influenza Type A
- **IF** Fever AND Cough
- **AND** (Fever Severity > 5 OR Cough Severity > 5)
- **THEN** Diagnosis: **Influenza Type A** (Confidence: 92%)
- **ICD-10**: J10.1

#### Rule 2: Acute Bronchitis
- **IF** Fever AND Cough
- **AND** (Fever Severity > 7 OR Cough Duration > 5)
- **THEN** Diagnosis: **Acute Bronchitis** (Confidence: 88%)
- **ICD-10**: J20.9

#### Rule 3: Viral Syndrome
- **IF** Body Ache AND Fatigue
- **AND** Body Ache Severity > 6
- **THEN** Diagnosis: **Viral Syndrome** (Confidence: 80%)
- **ICD-10**: B34.9

#### Rule 4: Seasonal Allergies
- **IF** Sneezing AND Sore Throat
- **AND** NOT Fever
- **THEN** Diagnosis: **Seasonal Allergies** (Confidence: 75%)
- **ICD-10**: J30.9

#### Rule 5: Common Cold (Default Rule)
- **IF** Cough OR Sneezing OR Sore Throat
- **THEN** Diagnosis: **Common Cold** (Confidence: 85%)
- **ICD-10**: J00

### 3. Conflict Resolution
Rules are structured logically from most specific (Influenza) to most general (Common Cold). The inference engine applies the first rule whose conditions are fully met by the provided facts.
