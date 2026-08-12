const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('callbacks.db');

db.run(
  "UPDATE users SET email = ? WHERE id = ?",
  ["arya@medico.com", 2],
  function (err) {
    if (err) {
      console.error("ERROR:", err.message);
    } else {
      console.log("Rows updated:", this.changes);
    }
    db.close();
  }
);
