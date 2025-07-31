const path = require("path");
const { ipcMain } = require("electron");
const { db } = require(path.join(__dirname, "database.cjs")); // ✅ Destructure correctly

// Save operation to DB
ipcMain.handle("save-operation", async (event, operation) => {
  const { expression, result } = operation;
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO operations (expression, result) VALUES (?, ?)",
      [expression, result],
      function (err) {
        if (err) {
          console.error("Failed to save operation:", err);
          reject(err);
        } else {
          console.log(`Operation saved with ID: ${this.lastID}`);
          resolve({ success: true, id: this.lastID });
        }
      }
    );
  });
});

// Get operation history
ipcMain.handle("get-history", async () => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM operations ORDER BY id DESC LIMIT 10",
      [],
      (err, rows) => {
        if (err) {
          console.error("Failed to fetch history:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
});
