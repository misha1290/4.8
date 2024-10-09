const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const dataPath = path.join(__dirname, 'data', 'students.json');

// Функція для читання даних з файлу
function readData() {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
}

// Функція для запису даних у файл
function writeData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Маршрут для додавання студента
app.post('/add-student', (req, res) => {
    const students = readData();
    const newStudent = req.body;
    students.push(newStudent);
    writeData(students);
    res.redirect('/');
});

// Маршрут для видалення студента
app.post('/delete-student', (req, res) => {
    let students = readData();
    students = students.filter(student => student.firstName !== req.body.firstName);
    writeData(students);
    res.redirect('/');
});

// Маршрут для оновлення студента
app.post('/update-student', (req, res) => {
    const students = readData();
    const updatedStudent = req.body;
    const index = students.findIndex(student => student.firstName === updatedStudent.firstName);
    if (index !== -1) {
        students[index] = updatedStudent;
    }
    writeData(students);
    res.redirect('/');
});

// Головний маршрут
app.get('/', (req, res) => {
    const students = readData();
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
