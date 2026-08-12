const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'callbacks.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS callbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      city TEXT,
      country TEXT,
      neetScore TEXT,
      message TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'new'
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Callbacks table ready');
    }
  });
}

// Function to save callback request
function saveCallback(data) {
  return new Promise((resolve, reject) => {
    const { fullName, phone, email, city, country, neetScore, message } = data;
    
    db.run(
      `INSERT INTO callbacks (fullName, phone, email, city, country, neetScore, message) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fullName, phone, email, city, country, neetScore, message],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      }
    );
  });
}

// Function to get all callbacks
function getAllCallbacks() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM callbacks ORDER BY createdAt DESC`, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Function to update callback status
function updateCallbackStatus(id, status) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE callbacks SET status = ? WHERE id = ?`,
      [status, id],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: id, status: status });
        }
      }
    );
  });
}

module.exports = {
  db,
  saveCallback,
  getAllCallbacks,
  updateCallbackStatus
};
  

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
        } else {
      console.log('Callbacks table ready');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table ready');
    }
  });


    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table ready');
    }
  });
