import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import passport from './config/passport';
import sequelize from './config/database';
import { User, Account, Image } from './models';
import imageRoutes from './routes/imageRoutes';
import userRoutes from './routes/userRoutes';
import accountRoutes from './routes/accountRoutes';
import authRoutes from './routes/authRoutes';
import descriptionRoutes from './routes/descriptionRoute';

// Charger les variables d'environnement avec priorité explicitedd
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ 
  path: path.resolve(process.cwd(), '.env.local'),
  override: true // Force l'écrasement des variables existantes
});

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 8080;

if (!PORT) {
  console.error('❌ No PORT defined in environment!');
  process.exit(1);
}

// Configuration CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware pour les requêtes OPTIONS (preflight)
app.options('*', cors());

// Initialiser Passport
app.use(passport.initialize());

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Servir les fichiers statiques pour les uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Route pour servir les images directement par nom de fichier (optionnel)
app.use('/files', express.static(path.join(__dirname, '../uploads')));

// Augmenter le timeout pour les requêtes longues
app.use((req, res, next) => {
  res.setTimeout(360000, () => {
    res.status(408).json({
      success: false,
      error: 'Request timeout',
      message: 'The request took too long to process'
    });
  });
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/', imageRoutes);
app.use('/', userRoutes);
app.use('/', accountRoutes);
app.use('/', descriptionRoutes);

// Route de test
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    stable_diffusion_url: process.env.STABLE_DIFFUSION_API_URL || 'http://localhost:7860'
  });
});

// ➜ Route de test DB pour vérifier la connexion à Cloud SQL
app.get('/test-db', async (req, res) => {
  try {
    const accounts = await Account.findAll({ limit: 5 });
    res.json({
      success: true,
      message: 'Connexion à la base réussie !',
      data: accounts
    });
  } catch (error) {
    console.error('Erreur dans /test-db:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion à la base',
      error: error.message
    });
  }
});

// Gestion des erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

// Initialiser la base de données et démarrer le serveur
async function startServer() {
  try {
    console.log(`🚀 Démarrage du BACK sur port ${PORT}...`);
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized successfully.');
        
    app.listen(PORT, () => {
      console.log(`✅ Server listening on port ${PORT}`);
      console.log(`Stable Diffusion API URL: ${process.env.STABLE_DIFFUSION_API_URL || 'http://localhost:7860'}`);
      console.log(`Health check available at: http://localhost:${PORT}/health`);
      console.log(`Uploads directory: ${path.join(__dirname, '../uploads')}`);
      console.log(`OAuth Google callback: http://localhost:${PORT}/auth/google/callback`);
    });
    
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
