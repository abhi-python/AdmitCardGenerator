const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123'
});

db.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }

  // Create database and table if they don't already exist
  db.query('CREATE DATABASE IF NOT EXISTS admit_cards', (err) => {
    if (err) {
      console.log(err);
      return;
    }

    db.query('USE admit_cards', (err) => {
      if (err) {
        console.log(err);
        return;
      }

      const sql = 'CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), phone VARCHAR(255), school VARCHAR(255), class VARCHAR(255), roll_no VARCHAR(255), address VARCHAR(255))';
      db.query(sql, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('Connected to MySQL database and created table');
      });
    });
  });
});

app.post('/api/saveUserDetails', (req, res) => {
  const { name, phone, school, classs, rollNo, address } = req.body;

  

  db.query(`INSERT INTO users (name, phone, school, class, roll_no, address) VALUES ('${name}', '${phone}', '${school}', '${classs}', '${rollNo}', '${address}')`, 
  (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred while saving user details');
      return;
    }

    const userId = result.insertId;

    // Generate admit card and return its URL
    generateAdmitCard(userId).then(admitCardUrl => {
      res.json({ admitCardUrl });
    }).catch(error => {
      console.log(error);
      res.status(500).send('An error occurred while generating admit card');
    });
  });
});

const generateAdmitCard = (userId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      const user = result[0];
      const doc = new PDFDocument();

      doc.pipe(fs.createWriteStream(`admit_card_${user.id}.pdf`));

      // Add user details to the admit card
      doc.fontSize(16).text(`Name: ${user.name}`);
      doc.fontSize(16).text(`Phone: ${user.phone}`);
      doc.fontSize(16).text(`School: ${user.school}`);
      doc.fontSize(16).text(`Class: ${user.class}`);
      doc.fontSize(16).text(`Roll No: ${user.roll_no}`);
      doc.fontSize(16).text(`Address: ${user.address}`);

      doc.end();

      const admitCardUrl = `${req.protocol}://${req.get('host')}/api/getAdmitCard/${user.id}`;
      resolve(admitCardUrl);
    });
  });
};

app.get('/api/getAdmitCard/:userId', (req, res) => {
    const userId = req.params.userId;
    const admitCardPath = path.join(__dirname, `admit_card_${userId}.pdf`);
  
    fs.readFile(admitCardPath, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred while fetching admit card');
        return;
      }
  
      res.contentType('application/pdf');
      res.send(data);
    });
  });
  
  const port = 5000;
  
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
  
