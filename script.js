document.addEventListener('DOMContentLoaded', () => {
    const numOfGrades = document.getElementById('numOfGrades');
    const gradesInput = document.getElementById('grades');
    const average = document.getElementById('average');
    const grade = document.getElementById('grade');
    const log = document.getElementById('log');

    function calculateGrades() {
        let grades = gradesInput.value.trim().split(',');
        let sum = 0;
        let valid = true;

        // Проверка на пустое поле
        if (grades.length === 0) {
            average.textContent = '[Вы ничего не ввели №1]';
            grade.textContent = '—';
            return;
        }

        // Проверка на недопустимые символы
        for (let i = 0; i < grades.length; i++) {
            if (isNaN(grades[i])) {
                valid = false;
                average.textContent = '[Вы ввели недопустимое значение №2]';
                grade.textContent = '—';
                break;
            }
        }

        // Проверка на нули и отрицательные числа
        for (let i = 0; i < grades.length; i++) {
            if (grades[i] === '0'
