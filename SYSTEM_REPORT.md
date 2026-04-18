# System Report: Medical Diagnosis Expert System
## Introduction to Artificial Intelligence - Project 2

### 1. Design Decisions
The Clinical Intelligence system was designed as a full-stack web application to provide a modern, accessible interface for expert system interactions. 

- **Frontend**: Built with React and Tailwind CSS for a responsive, high-fidelity user experience.
- **Backend**: Node.js/Express server hosting the inference engine and knowledge base.
- **Styling**: Glassmorphism and Lucide iconography were used to create a "serene clinical environment."

### 2. Knowledge Representation
Knowledge is represented as a collection of **Production Rules** (IF-THEN statements). Each rule encapsulates medical expertise regarding symptom patterns, severity thresholds, and diagnostic outcomes.

### 3. Inference Mechanism
The system implements a **Forward Chaining** inference engine. 
- **Process**: The engine starts with the facts provided by the user (selected symptoms). It then iterates through the knowledge base, matching these facts against the conditions of each rule.
- **Deduction**: When a match is found, the system "fires" the rule, deducing the diagnosis and providing the associated clinical reasoning.

### 4. Testing Results
The system was validated against multiple scenarios:
- **Scenario A**: Fever (8/10) + Cough (3 days) -> Correctly inferred **Influenza Type A**.
- **Scenario B**: Sneezing + Sore Throat (No Fever) -> Correctly inferred **Seasonal Allergies**.
- **Scenario C**: Body Ache (9/10) + Fatigue -> Correctly inferred **Viral Syndrome**.

### 5. Usability Evaluation
User feedback indicated that the "Severity" and "Duration" inputs significantly improved the perceived intelligence of the system compared to simple binary symptom selection. The inclusion of sparkline trends and vitals logging further enhanced the "Expert" feel of the application.

### 6. Hybrid AI Approach: AI Second Opinion
To augment the classical rule-based engine, the system integrates a **Generative AI Second Opinion** feature powered by the Gemini API.
- **Synergy**: While the rule-based engine provides deterministic, explainable results based on hard-coded medical knowledge, the Gemini integration offers a nuanced, probabilistic "second opinion."
- **Functionality**: The AI analyzes the primary diagnosis and the patient's symptoms to suggest differential diagnoses and highlight potential "red flag" symptoms that require immediate clinical escalation.

### 7. Limitations and Future Work
- **Limitations**: The current knowledge base is limited to common respiratory and viral conditions. It does not account for complex comorbidities.
- **Future Work**: Integration of a **Backward Chaining** engine to allow the system to ask the user targeted questions to confirm a hypothesis.
