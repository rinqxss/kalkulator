document.addEventListener('DOMContentLoaded', function () {
    var calcForm = document.getElementById('calcForm');
    var feedbackBox = document.getElementById('feedbackBox');
    var clearBtn = document.getElementById('clearLogBtn');
    var logList = document.getElementById('logList');
    var FIELD_COUNT = 10;
    var STORAGE_KEY = 'gradeLog';

    // Фразы ошибок (требование №2)
    var MSG_EMPTY   = 'Ошибка: заполните хотя бы одно поле — все поля пустые.';
    var MSG_LETTERS = 'Ошибка: недопустимое значение — вводите только числа.';
    var MSG_ZERO    = 'Ошибка: такой оценки нет — минимальная оценка 1.';
    var MSG_NEG     = 'Ошибка: минусовой оценки не существует.';

    // ---------- Работа с журналом в localStorage ----------

    function getEntries() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveEntries(entries) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    // Записи добавляются вниз списка, старые не затираются
    function addLogEntry(entry) {
        var emptyNote = logList.querySelector('.empty');
        if (emptyNote) emptyNote.remove();

        var li = document.createElement('li');
        li.textContent = entry.time + ' | Оценки: ' + entry.input + ' | Итог: ' + entry.result;
        logList.appendChild(li);
    }

    function loadLog() {
        var entries = getEntries();
        if (entries.length === 0) {
            var li = document.createElement('li');
            li.className = 'empty';
            li.textContent = 'Пока нет записей';
            logList.appendChild(li);
        } else {
            entries.forEach(addLogEntry);
        }
    }

    function clearLog() {
        localStorage.removeItem(STORAGE_KEY);
        logList.innerHTML = '';
        var li = document.createElement('li');
        li.className = 'empty';
        li.textContent = 'Пока нет записей';
        logList.appendChild(li);
    }

    // ---------- Вывод сообщений ----------

    // Вывод сообщения с цветом: класс задаёт окраску блока
    function showFeedback(message, type) {
        feedbackBox.hidden = false;
        feedbackBox.className = 'feedback ' + type;
        feedbackBox.textContent = message;
    }

    // Итог по среднему баллу: слово + цветовой класс
    // отлично — зелёный, хорошо — жёлтый,
    // удовлетворительно — синий, отчислен — красный
    function gradeInfo(avg) {
        if (avg >= 4.5) return { text: 'отлично',           type: 'ok' };
        if (avg >= 3.5) return { text: 'хорошо',            type: 'warn' };
        if (avg >= 2.5) return { text: 'удовлетворительно', type: 'info' };
        return { text: 'отчислен', type: 'bad' };
    }

    // ---------- Очистка полей при обновлении страницы ----------

    // При каждом открытии/обновлении страницы очищаем все поля,
    // чтобы браузер не восстанавливал старые значения после F5
    function clearFields() {
        for (var i = 1; i <= FIELD_COUNT; i++) {
            var el = document.getElementById('score' + i);
            if (el) {
                el.value = '';
                el.autocomplete = 'off';
            }
        }
    }

    // ---------- Расчёт ----------

    function calculate(event) {
        event.preventDefault();

        var raw = [];
        for (var i = 1; i <= FIELD_COUNT; i++) {
            var el = document.getElementById('score' + i);
            raw.push(el ? el.value.trim() : '');
        }

        // 1. Пустые поля: если не заполнено ни одно — ошибка №1.
        // Отдельные пустые поля допустимы, они не участвуют в расчёте.
        var filled = raw.filter(function (v) { return v !== ''; });
        if (filled.length === 0) {
            showFeedback(MSG_EMPTY, 'bad');
            return;
        }

        // 2. Буквы или символы (не число)
        for (var j = 0; j < filled.length; j++) {
            if (isNaN(Number(filled[j]))) {
                showFeedback(MSG_LETTERS, 'bad');
                return;
            }
        }

        var nums = filled.map(Number);

        // 3. Ровно ноль
        for (var k = 0; k < nums.length; k++) {
            if (nums[k] === 0) {
                showFeedback(MSG_ZERO, 'bad');
                return;
            }
        }

        // 4. Отрицательное число
        for (var m = 0; m < nums.length; m++) {
            if (nums[m] < 0) {
                showFeedback(MSG_NEG, 'bad');
                return;
            }
        }

        // Расчёт среднего балла по заполненным полям
        var sum = 0;
        for (var s = 0; s < nums.length; s++) {
            sum += nums[s];
        }
        var avg = sum / nums.length;
        var avgRounded = avg.toFixed(2);
        var info = gradeInfo(avg);

        showFeedback('Средний балл: ' + avgRounded + ' — ' + info.text, info.type);

        // Запись в журнал: время, введённые данные, итог
        var now = new Date();
        var entry = {
            time: now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU'),
            input: nums.join(', '),
            result: avgRounded + ' (' + info.text + ')'
        };

        var entries = getEntries();
        entries.push(entry);
        saveEntries(entries);
        addLogEntry(entry);
    }

    // ---------- Подключение событий и запуск ----------

    if (calcForm) calcForm.addEventListener('submit', calculate);
    if (clearBtn) clearBtn.addEventListener('click', clearLog);

    clearFields(); // очищаем поля при каждом открытии/обновлении страницы
    loadLog();     // журнал при этом сохраняется в localStorage
});
