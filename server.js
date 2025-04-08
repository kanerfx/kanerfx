const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'savedData.json');

const loadSavedData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } else {
      return [];
    }
  } catch (err) {
    console.error('Error loading saved data:', err);
    return [];
  }
};

const writeSavedData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing saved data:', err);
  }
};

let savedData = loadSavedData();

app.get('/saved-data', (req, res) => {
  res.json(savedData);
});

app.post('/save-row', (req, res) => {
  const { sheetName, rowIndex, isChecked } = req.body;
  const index = savedData.findIndex(
    item =>
      item.sheetName === sheetName &&
      item.rowIndex.toString() === rowIndex.toString()
  );
  if (index !== -1) {
    savedData[index].isChecked = isChecked;
  } else {
    savedData.push({ sheetName, rowIndex, isChecked });
  }
  writeSavedData(savedData);
  res.json({ message: 'Row status saved successfully!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
