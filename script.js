document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('calcBtn');
    const clearBtn = document.getElementById('clearLog');
    const resultEl = document.getElementById('finalScore');
    const errorEl = document.getElementById('error');
    const logList = document.getElementById('logList');
    const FIELD_COUNT = 10;
    const STORAGE_KEY = 'gradeLog';

    // Фразы ошибок (требование №2)
    const MSG_EMPTY   = 'Ошибка: заполните хотя бы одно поле — все поля пустые.';
    const MSG_LETTERS = 'Ошибка: введены буквы или символы — разрешены только числа.';
    const MSG_ZERO    = 'Ошибка: ноль не может быть оценкой.';
    const MSG_NEG     = 'Ошибка: отрицательные числа недопустимы.';

    // Читаем журнал из localStorage
    function getEntries() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    // Сохраняем журнал в localStorage
    function saveEntries(entries) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    // Отрисовка одной записи журнала (новые добавляются вниз)
    function addLogEntry(entry) {
        const li = document.createElement('li');
        li.textContent = entry.time + ' | Оценки: ' + entry.input + ' | Итог: ' + entry.result;
        logList.appendChild(li);
    }

    // Загружаем журнал при открытии страницы (история сохраняется после F5)
    function loadLog() {
        getEntries().forEach(addLogEntry);
    }

    function showError(message) {
        errorEl.textContent = message;
        resultEl.textContent = '—';
    }

    // Итоговая оценка по среднему баллу
    function gradeName(avg) {
        if (avg >= 4.5) return 'отлично';
        if (avg >= 3.5) return 'хорошо';
        if (avg >= 2.5) return 'удовлетворительно';
        return 'неудовлетворительно';
    }

    function calculate() {
        const raw = [];
        for (let i = 1; i <= FIELD_COUNT; i++) {
            raw.push(document.getElementById('score' + i).value.trim());
        }

        // 1. Пустые поля: если не заполнено НИ ОДНОГО — ошибка №1.
        // Отдельные пустые поля допустимы — они просто не участвуют в расчёте.
        const filled = raw.filter(v => v !== '');
        if (filled.length === 0) {
            showError(MSG_EMPTY);
            return;
        }

        // 2. Буквы или символы (не число) — проверяем только заполненные поля
        if (filled.some(v => isNaN(Number(v)))) {
            showError(MSG_LETTERS);
            return;
        }

        const nums = filled.map(v => Number(v));

        // 3. Ровно ноль
        if (nums.some(n => n === 0)) {
            showError(MSG_ZERO);
            return;
        }

        // 4. Отрицательное число
        if (nums.some(n => n < 0)) {
            showError(MSG_NEG);
            return;
        }

        // Расчёт среднего балла только по заполненным полям
        const sum = nums.reduce((acc, n) => acc + n, 0);
        const avg = sum / nums.length;
        const avgRounded = avg.toFixed(2);
        const verdict = gradeName(avg);

        resultEl.textContent = avgRounded + ' — ' + verdict;
        errorEl.textContent = '';

        // Запись в журнал: время, введённые данные, итог
        const now = new Date();
        const entry = {
            time: now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU'),
            input: nums.join(', '),
            result: avgRounded + ' (' + verdict + ')'
        };

        const entries = getEntries();
        entries.push(entry);   // каждый новый запрос добавляется в конец
        saveEntries(entries);
        addLogEntry(entry);    // старые записи не затираются
    }

    function clearLog() {
        localStorage.removeItem(STORAGE_KEY);
        logList.innerHTML = '';
    }

    calcBtn.addEventListener('click', calculate);
    clearBtn.addEventListener('click', clearLog);
    loadLog();
});
