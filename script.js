document.addEventListener('DOMContentLoaded', () => {
    const initialCost = document.getElementById('initialCost');
    const coefficient = document.getElementById('coefficient');
    const result = document.getElementById('result');
    const log = document.getElementById('log');

    function calculateCost() {
        let cost = 0;
        let error = '';

        if (initialCost.value === '') {
            error = '[Вы ничего не ввели №1]';
        } else if (isNaN(initialCost.value) || initialCost.value < 0) {
            error = '[Вы ввели недопустимое значение №2]';
        } else if (initialCost.value === '0') {
            error = '[Вы ввели 0 №3]';
        } else {
            cost = parseFloat(initialCost.value) * parseFloat(coefficient.value);
        }

        if (error) {
            result.textContent = error;
            return;
        }

        result.textContent = cost;

        // Добавляем запись в журнал
        const entry = `Время: ${new Date().toLocaleString()}, Начальная стоимость: ${initialCost.value}, Коэффициент: ${coefficient.value}, Результат: ${cost}\n`;
        log.innerHTML += entry;
        localStorage.setItem('log', log.innerHTML);
    }

    // Очищаем журнал
    function clearLog() {
        log.
