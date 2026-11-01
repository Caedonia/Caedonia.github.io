// File: ../../shared/ui/CactusCalendar.js

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

    // Apply base container styling
    this.container.className = "w-80 bg-white rounded-3xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-50";
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
      <div class="flex justify-between items-center mb-6 px-2">
        <button id="prev-month" class="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-600 transition-colors shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 class="font-semibold text-gray-800 text-base">
          ${this.monthNames[month]} ${year}
        </h2>
        <button id="next-month" class="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-600 transition-colors shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
      <div class="grid grid-cols-7 gap-1 mb-2">
        ${['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => `<div class="text-center text-sm font-medium text-gray-400 py-1">${d}</div>`).join('')}
      </div>
      <div class="grid grid-cols-7 gap-y-2 gap-x-1" id="calendar-grid">
        ${days.map((d, idx) => {
          const isSelected = this.isSameDay(d.date, this.selectedDate);
          const isToday = this.isSameDay(d.date, this.todayHighlight);
          
          let classes = "h-10 w-10 mx-auto rounded-xl flex items-center justify-center text-sm font-medium transition-all ";
          
          if (!d.isCurrentMonth) {
            classes += "text-gray-300 cursor-default ";
          } else {
            classes += "text-gray-700 hover:bg-emerald-50 cursor-pointer day-btn ";
          }

          if (isSelected) {
            classes += "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-200 ";
          } else if (isToday) {
            classes += "border-2 border-emerald-400 text-emerald-700 ";
          } else {
            classes += "border-2 border-transparent ";
          }

          return `<button data-index="${idx}" class="${classes}" ${!d.isCurrentMonth ? 'disabled' : ''}>${d.day}</button>`;
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
        this.render(); // Re-render to update the green selection state
        this.onSelectDate(selected);
      });
    });
  }
}