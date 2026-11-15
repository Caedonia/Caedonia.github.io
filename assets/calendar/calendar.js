export class CactusCalendar {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.selectedDate = options.selectedDate ? new Date(options.selectedDate) : null;
    this.todayHighlight = options.todayHighlight ? new Date(options.todayHighlight) : new Date();
    this.currentDate = new Date(this.selectedDate || this.todayHighlight);
    this.onSelectDate = options.onSelectDate || (() => {});

    this.monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    this.container.className = "cactus-calendar-container";
    this.render();
  }

  isSameDay(d1, d2) {
    if (!d1 || !d2) return false;
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }

  changeMonth(offset) {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.render();
  }

  render() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Previous Month Padding
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
    }
    // Current Month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }
    // Next Month Padding
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }

    this.container.innerHTML = `
      <div class="calendar-header">
        <button id="prev-month" class="nav-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 class="month-title">${this.monthNames[month]} ${year}</h2>
        <button id="next-month" class="nav-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
      <div class="day-names-grid">
        ${['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => `<div class="day-name">${d}</div>`).join('')}
      </div>
      <div class="calendar-grid" id="calendar-grid">
        ${days.map((d, idx) => {
          const isSelected = this.isSameDay(d.date, this.selectedDate);
          const isToday = this.isSameDay(d.date, this.todayHighlight);
          
          // Add 'calendar-day' to your base classes
          let classes = "date-cell calendar-day ";
          
          if (!d.isCurrentMonth) {
            classes += "inactive ";
          } else {
            classes += "day-btn ";
          }

          if (isSelected) {
            classes += "selected ";
          } else if (isToday) {
            classes += "today ";
          }

          // Format the date to YYYY-MM-DD for the data-date attribute
          const y = d.date.getFullYear();
          const m = String(d.date.getMonth() + 1).padStart(2, '0');
          const dayStr = String(d.date.getDate()).padStart(2, '0');
          const formattedDate = `${y}-${m}-${dayStr}`;

          // Inject the data-date attribute into the button
          return `<button data-index="${idx}" data-date="${formattedDate}" class="${classes}" ${!d.isCurrentMonth ? 'disabled' : ''}>${d.day}</button>`;
        }).join('')}
      </div>
    `;

    this.attachEvents(days);
  }

  attachEvents(daysData) {
    this.container.querySelector('#prev-month').addEventListener('click', () => this.changeMonth(-1));
    this.container.querySelector('#next-month').addEventListener('click', () => this.changeMonth(1));

    const dayButtons = this.container.querySelectorAll('.day-btn');
    dayButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.target.getAttribute('data-index');
        const selected = daysData[idx].date;
        this.selectedDate = selected;
        this.render(); 
        this.onSelectDate(selected);
      });
    });
  }
}