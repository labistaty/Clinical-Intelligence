import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "clinical-intelligence-secret-key-2026";
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Senior Clinical Consultant" },
  joined: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
  avatar: String,
  specialization: String,
  phone: String,
  location: String,
  license: String,
  bio: String
});

const patientRecordSchema = new mongoose.Schema({
  patientName: String,
  age: Number,
  diagnosis: String,
  confidence: Number,
  icd10: String,
  symptoms: [String],
  reasoning: String,
  treatment: [String],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const PatientRecord = mongoose.model("PatientRecord", patientRecordSchema);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to MongoDB
  if (MONGODB_URI && (MONGODB_URI.startsWith("mongodb://") || MONGODB_URI.startsWith("mongodb+srv://"))) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("Connected to MongoDB successfully");
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }
  } else {
    console.warn("MONGODB_URI not provided or invalid. Running with in-memory fallback (not persistent).");
  }

  app.use(express.json());

  // In-Memory Fallback Storage (if MongoDB is not connected)
  const patientRecordsMemory: any[] = [];
  const usersMemory: any[] = [];

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Invalid or expired token." });
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post("/api/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
      if (mongoose.connection.readyState === 1) {
        if (await User.findOne({ email })) {
          return res.status(400).json({ error: "User already exists with this email." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        return res.status(201).json({ user: userWithoutPassword, token });
      } else {
        // Fallback
        if (usersMemory.find(u => u.email === email)) {
          return res.status(400).json({ error: "User already exists with this email." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name, email, password: hashedPassword,
          role: "Senior Clinical Consultant",
          location: "Korle-Bu Teaching Hospital, Accra",
          phone: "+233 (0) 55 555 5555",
          joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
        usersMemory.push(newUser);
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
        const { password: _, ...userWithoutPassword } = newUser;
        return res.status(201).json({ user: userWithoutPassword, token });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
      if (mongoose.connection.readyState === 1) {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ error: "Invalid email or password." });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        const { password: _, ...userWithoutPassword } = user.toObject();
        return res.json({ user: userWithoutPassword, token });
      } else {
        // Fallback
        const user = usersMemory.find(u => u.email === email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ error: "Invalid email or password." });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        const { password: _, ...userWithoutPassword } = user;
        return res.json({ user: userWithoutPassword, token });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found." });
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
      } else {
        // Fallback
        const user = usersMemory.find(u => u.id === req.user.id);
        if (!user) return res.status(404).json({ error: "User not found." });
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/auth/profile", authenticateToken, async (req: any, res) => {
    const { name, avatar, role, specialization, phone, location, license, bio } = req.body;
    
    try {
      if (mongoose.connection.readyState === 1) {
        const user = await User.findByIdAndUpdate(
          req.user.id,
          { $set: { name, avatar, role, specialization, phone, location, license, bio } },
          { new: true }
        );
        if (!user) return res.status(404).json({ error: "User not found." });
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
      } else {
        // Fallback
        const userIndex = usersMemory.findIndex(u => u.id === req.user.id);
        if (userIndex === -1) return res.status(404).json({ error: "User not found." });
        
        usersMemory[userIndex] = { 
          ...usersMemory[userIndex], 
          name: name || usersMemory[userIndex].name,
          avatar: avatar || usersMemory[userIndex].avatar,
          role: role || usersMemory[userIndex].role,
          specialization: specialization || usersMemory[userIndex].specialization,
          phone: phone || usersMemory[userIndex].phone,
          location: location || usersMemory[userIndex].location,
          license: license || usersMemory[userIndex].license,
          bio: bio || usersMemory[userIndex].bio
        };
        
        const { password: _, ...userWithoutPassword } = usersMemory[userIndex];
        res.json(userWithoutPassword);
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      timestamp: new Date().toISOString() 
    });
  });

  // Get Patient Records
  app.get("/api/records", async (req, res) => {
    if (mongoose.connection.readyState === 1) {
      const records = await PatientRecord.find().sort({ createdAt: -1 });
      res.json(records);
    } else {
      res.json(patientRecordsMemory);
    }
  });

  // Save Patient Record
  app.post("/api/records", async (req, res) => {
    if (mongoose.connection.readyState === 1) {
      const record = new PatientRecord(req.body);
      await record.save();
      res.status(201).json(record);
    } else {
      const record = {
        id: Math.random().toString(36).substr(2, 9),
        ...req.body,
        createdAt: new Date().toISOString()
      };
      patientRecordsMemory.push(record);
      res.status(201).json(record);
    }
  });

  // Mock Symptoms API
  app.get("/api/symptoms", (req, res) => {
    const symptoms = [
      { id: 'fever', label: 'Fever', desc: 'Oral temp above 38°C (100.4°F)', icon: 'Thermometer', color: 'text-tertiary' },
      { id: 'cough', label: 'Cough', desc: 'Dry or productive chest irritation', icon: 'Wind', color: 'text-primary' },
      { id: 'throat', label: 'Sore Throat', desc: 'Pain or scratchiness in the throat', icon: 'HeartPulse', color: 'text-primary' },
      { id: 'sneezing', label: 'Sneezing', desc: 'Frequent nasal irritation or discharge', icon: 'Waves', color: 'text-primary' },
      { id: 'body_ache', label: 'Body Ache', desc: 'Muscle soreness or joint stiffness', icon: 'Accessibility', color: 'text-primary' },
      { id: 'fatigue', label: 'Fatigue', desc: 'Generalized weakness or exhaustion', icon: 'Bed', color: 'text-primary' },
    ];
    res.json(symptoms);
  });

  // Expert System: Knowledge Base & Inference Engine
  interface Rule {
    id: string;
    conditions: (symptoms: Record<string, any>) => boolean;
    diagnosis: string;
    confidence: number;
    icd10: string;
    reasoning: string;
  }

  const knowledgeBase: Rule[] = [
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

  function runInference(symptoms: Record<string, any>) {
    // Forward Chaining: Match symptoms against rules in order of specificity
    for (const rule of knowledgeBase) {
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

  // Mock Diagnosis API
  app.post("/api/diagnose", (req, res) => {
    const { symptoms } = req.body; 
    const result = runInference(symptoms);

    res.json({
      ...result,
      symptoms: Object.keys(symptoms).map(id => {
        const labels: Record<string, string> = {
          fever: 'Fever',
          cough: 'Cough',
          throat: 'Sore Throat',
          sneezing: 'Sneezing',
          body_ache: 'Body Ache',
          fatigue: 'Fatigue'
        };
        return labels[id] || id;
      }),
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
