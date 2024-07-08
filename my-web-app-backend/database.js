const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");
  
  const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  stmt.run("John Doe", "john@example.com");
  stmt.run("Jane Doe", "jane@example.com");
  stmt.finalize();
});

module.exports = db;