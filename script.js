document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calcForm');
    const result = document.getElementById('finalScore');
    const log = document.getElementById('log');
    const clearLog = document.createElement('button');
    clearLog.textContent = 'Очистить журнал';
    clearLog.style.margin = '10px';
    clearLog.addEventListener('click', () => {
        localStorage.clear();
        log.innerHTML = '';
    });
    log.appendChild(clearLog);

    function calculate() {
        const scores = [
            parseFloat(document.getElementById('score1').value) || 0,
            parseFloat(document.getElementById('score2').value) || 0,
            parseFloat(document.getElementById('score3').value) || 0
        ];

        let error = '';
        let valid =
