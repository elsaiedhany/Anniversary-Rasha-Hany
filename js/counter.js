/* ==========================================================================
   MARRIAGE TIMER COUNTER ENGINE (PRODUCTION DEBUGGED & CROSS-BROWSER SAFE)
   ========================================================================== */

(function () {
    'use strict';

    // Numeric Date constructor: Month 6 = July (0-indexed) to avoid iOS Safari string parsing NaN bug
    const startDate = new Date(2003, 6, 28, 0, 0, 0);

    const yearsEl = document.getElementById('counter-years');
    const monthsEl = document.getElementById('counter-months');
    const daysEl = document.getElementById('counter-days');
    const hoursEl = document.getElementById('counter-hours');
    const minutesEl = document.getElementById('counter-minutes');
    const secondsEl = document.getElementById('counter-seconds');

    if (!yearsEl) return;

    function updateCounter() {
        const now = new Date();

        let years = now.getFullYear() - startDate.getFullYear();
        let months = now.getMonth() - startDate.getMonth();
        let days = now.getDate() - startDate.getDate();
        let hours = now.getHours() - startDate.getHours();
        let minutes = now.getMinutes() - startDate.getMinutes();
        let seconds = now.getSeconds() - startDate.getSeconds();

        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }
        if (minutes < 0) {
            minutes += 60;
            hours--;
        }
        if (hours < 0) {
            hours += 24;
            days--;
        }
        if (days < 0) {
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
            months--;
        }
        if (months < 0) {
            months += 12;
            years--;
        }

        yearsEl.textContent = String(Math.max(0, years)).padStart(2, '0');
        monthsEl.textContent = String(Math.max(0, months)).padStart(2, '0');
        daysEl.textContent = String(Math.max(0, days)).padStart(2, '0');
        hoursEl.textContent = String(Math.max(0, hours)).padStart(2, '0');
        minutesEl.textContent = String(Math.max(0, minutes)).padStart(2, '0');
        secondsEl.textContent = String(Math.max(0, seconds)).padStart(2, '0');
    }

    updateCounter();
    setInterval(updateCounter, 1000);
})();
