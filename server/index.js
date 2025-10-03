// SmartHub Backend Server - Express API for Admin Data Management
// Provides API endpoints to read/write admin-data.json file

import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Path to admin data file
const DATA_FILE_PATH = path.join(__dirname, '../src/data/admin-data.json');

// Middleware
app.use(cors()); // Allow requests from React frontend
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// API ENDPOINTS
// ============================================

/**
 * GET /api/admin/data
 * Read all admin data from JSON file
 */
app.get('/api/admin/data', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const adminData = JSON.parse(data);
    res.json(adminData);
  } catch (error) {
    console.error('Error reading admin data:', error);
    res.status(500).json({
      error: 'Failed to read admin data',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/data
 * Write admin data to JSON file
 */
app.post('/api/admin/data', async (req, res) => {
  try {
    const adminData = req.body;

    // Add last_updated timestamp
    adminData.last_updated = new Date().toISOString();

    // Create backup before writing
    try {
      const existingData = await fs.readFile(DATA_FILE_PATH, 'utf-8');
      const backupPath = path.join(__dirname, '../src/data/backups', `admin-data-${Date.now()}.json`);

      // Ensure backups directory exists
      await fs.mkdir(path.join(__dirname, '../src/data/backups'), { recursive: true });
      await fs.writeFile(backupPath, existingData, 'utf-8');
      console.log(`Backup created: ${backupPath}`);
    } catch (backupError) {
      console.warn('Warning: Could not create backup:', backupError.message);
    }

    // Write new data
    await fs.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(adminData, null, 2),
      'utf-8'
    );

    res.json({
      success: true,
      message: 'Admin data saved successfully',
      last_updated: adminData.last_updated
    });
  } catch (error) {
    console.error('Error writing admin data:', error);
    res.status(500).json({
      error: 'Failed to write admin data',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/backup
 * Download current admin data as backup
 */
app.get('/api/admin/backup', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="smarthub-backup-${timestamp}.json"`);
    res.send(data);
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({
      error: 'Failed to create backup',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/restore
 * Restore admin data from uploaded backup
 */
app.post('/api/admin/restore', async (req, res) => {
  try {
    const backupData = req.body;

    // Validate backup data structure
    if (!backupData.version || !Array.isArray(backupData.rooms)) {
      return res.status(400).json({
        error: 'Invalid backup file format'
      });
    }

    // Create backup of current data before restoring
    const currentData = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const backupPath = path.join(__dirname, '../src/data/backups', `before-restore-${Date.now()}.json`);
    await fs.mkdir(path.join(__dirname, '../src/data/backups'), { recursive: true });
    await fs.writeFile(backupPath, currentData, 'utf-8');

    // Write restored data
    await fs.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(backupData, null, 2),
      'utf-8'
    );

    res.json({
      success: true,
      message: 'Data restored successfully from backup'
    });
  } catch (error) {
    console.error('Error restoring backup:', error);
    res.status(500).json({
      error: 'Failed to restore backup',
      message: error.message
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dataFile: DATA_FILE_PATH
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50));
  console.log('  SmartHub Backend Server');
  console.log('='.repeat(50));
  console.log(`  Status: Running`);
  console.log(`  Port: ${PORT}`);
  console.log(`  API Base: http://localhost:${PORT}/api`);
  console.log(`  Data File: ${DATA_FILE_PATH}`);
  console.log('='.repeat(50));
  console.log('');
});

export default app;
