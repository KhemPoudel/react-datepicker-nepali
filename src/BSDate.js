import moment from 'moment';
import { base_ad, base_bs, end_bs, calendar_data, en, ne } from './constant';

export default class BSMoment {
  constructor(date = base_bs) {
    if (!date.year || !date.month || !date.day) {
      const dateArray = date.split('/');
      date = {
        year: parseInt(dateArray[0], 10),
        month: parseInt(dateArray[1], 10),
        day: parseInt(dateArray[2], 10)
      };
    }
    if (BSMoment.isLess(date, base_bs)) {
      date = base_bs;
    } else if (BSMoment.isMore(date, end_bs)) {
      date = end_bs;
    }
    this._date = date;
    this._diff = {
      day: this._diffDay.bind(this),
      month: this._diffMonth.bind(this),
      year: this._diffYear.bind(this)
    };
    this._add = {
      day: this._addDays.bind(this),
      month: this._addMonth.bind(this),
      year: this._addYear.bind(this)
    };
    this._subtract = {
      day: this._subtractDays.bind(this),
      month: this._subtractMonth.bind(this),
      year: this._subtractYear.bind(this)
    };
    this._startOf = {
      day: this._startOfDay.bind(this),
      month: this._startOfMonth.bind(this),
      year: this._startOfYear.bind(this)
    };
    this._endOf = {
      day: this._endOfDay.bind(this),
      month: this._endOfMonth.bind(this),
      year: this._endOfYear.bind(this)
    };
  }


  _toDate(date) {
    return new BSMoment(date);
  }

  _addDays(count = 0) {
    let { year, month, day } = this._date;
    day += count;
    while (calendar_data[year] && day > calendar_data[year][month - 1]) {
      day -= calendar_data[year][month - 1];
      month++;
      if (month > 12) {
        year++;
        month = 1;
      }
    }
    return this._toDate({ year, month, day });
  }

  _addMonth(count = 0) {
    let { year, month, day } = this._date;
    month += count;
    while (month > 12) {
      month -= 12;
      year++;
    }
    if (calendar_data[year]) {
      const totalDaysInNewMonth = calendar_data[year][month - 1];
      if (day > totalDaysInNewMonth) {
        day = totalDaysInNewMonth;
      }
    }
    return this._toDate({ year, month, day });
  }

  _addYear(count) {
    let { year, month, day } = this._date;
    year += count;
    if (calendar_data[year]) {
      const totalDaysInNewMonth = calendar_data[year][month - 1];
      if (day > totalDaysInNewMonth) {
        day = totalDaysInNewMonth;
      }
    }
    return this._toDate({ year, month, day });
  }

  _subtractDays(count = 0) {
    let { year, month, day } = this._date;
    while (count >= day) {
      count -= day;
      month--;
      if (month < 1) {
        year--;
        month = 1;
      }
      if (calendar_data[year]) {
        day = calendar_data[year][month - 1];
      }
    }
    return this._toDate({ year, month, day });
  }

  _subtractMonth(count = 0) {
    let { year, month, day } = this._date;
    while (count >= month) {
      count -= month;
      year--;
      month = 12;
    }
    month -= count;
    if (calendar_data[year]) {
      const totalDaysInNewMonth = calendar_data[year][month - 1];
      if (day > totalDaysInNewMonth) {
        day = totalDaysInNewMonth;
      }
    }
    return this._toDate({ year, month, day });
  }

  _subtractYear(count) {
    let { year, month, day } = this._date;
    year -= count;
    if (calendar_data[year]) {
      const totalDaysInNewMonth = calendar_data[year][month - 1];
      if (day > totalDaysInNewMonth) {
        day = totalDaysInNewMonth;
      }
    }
    return this._toDate({ year, month, day });
  }

  _startOfYear() {
    let { year, month, day } = this._date;
    month = 1;
    day = 1;
    return this._toDate({ year, month, day });
  }

  _startOfMonth() {
    let { year, month, day } = this._date;
    day = 1;
    return this._toDate({ year, month, day });
  }

  _startOfDay() {
    return this._toDate({ ...this._date });
  }

  _endOfYear() {
    let { year, month, day } = this._date;
    month = 12;
    day = parseInt(calendar_data[year][11], 10);
    return this._toDate({ year, month, day });
  }

  _endOfMonth() {
    let { year, month, day } = this._date;
    day = parseInt(calendar_data[year][month - 1], 10);
    return this._toDate({ year, month, day });
  }

  _endOfDay() {
    return this._toDate({ ...this._date });
  }

  _diffDay(start, end) {
    let count = 0;
    for (let i = start.year; i <= end.year; i++) {
      count += calendar_data[i][12];
    }

    for (let i = 0; i < start.month - 1; i++) {
      count -= calendar_data[start.year][i];
    }

    for (let i = end.month - 1; i < 12; i++) {
      count -= calendar_data[end.year][i];
    }

    count -= start.day;
    count += end.day;
    return count;
  }

  _diffMonth(start, end) {
    return (end.year - start.year) * 12 + end.month - start.month;
  }

  _diffYear(start, end) {
    return end.year - start.year;
  }

  year(year) {
    if (year) {
      const { month, day } = this._date;
      return this._toDate({ year, day, month });
    }
    return this._date.year;
  }

  month(month) {
    if (month) {
      const { year, day } = this._date;
      return this._toDate({ year, day, month });
    }
    return this._date.month;
  }

  date(day) {
    if (day) {
      const { year, month } = this._date;
      return this._toDate({ year, month, day });
    }
    return this._date.day;
  }

  getMonthName() {
    return en.monthsName[this._date.month - 1];
  }

  getDay() {
    return this.toAD().getDay();
  }

  now() {
    const adToday = moment(),
      adBase = moment(`${base_ad.year}/${base_ad.month}/${base_ad.day}`, 'YYYY/MM/DD'),
      diffInDays = adToday.diff(adBase, 'day');
    return this.add(diffInDays, 'day');
  }

  add(count, type = 'day') {
    return this._add[type](count);
  }

  subtract(count, type = 'day') {
    return this._subtract[type](count);
  }

  startOf(type = 'day') {
    return this._startOf[type]();
  }

  endOf(type = 'day') {
    return this._endOf[type]();
  }

  diff(dateObj, type = 'day') {
    let inc = false, start = this._date, end = dateObj._date || dateObj;
    if (start.year > end.year) {
      inc = true;
    } else if (start.year === end.year && start.month > end.month) {
      inc = true;
    } else if (start.year === end.year && start.month === end.month && start.day > end.day) {
      inc = true;
    }
    if (inc) {
      start = dateObj._date || dateObj;
      end = this._date;
    }
    return this._diff[type](start, end);
  }

  toAD() {
    const daysCount = this.diff(base_bs),
      adBase = moment(`${base_ad.year}/${base_ad.month}/${base_ad.day}`, 'YYYY/MM/DD');
    return adBase.add(daysCount, 'day');
  }

  weekday(count) {
    const adDate = this.toAD().weekday(count);
    return BSMoment.toBS(adDate);
  }

  isBefore(date) {
    const { year, month, day } = date._date || date;
    if (this._date.year < year) {
      return true;
    } else if (this._date.year === year && this._date.month < month) {
      return true;
    } else if (this._date.year === year && this._date.month === month && this._date.day < day) {
      return true;
    }
  }

  isSameOrBefore(date) {
    const { year, month, day } = date._date || date;
    if (this._date.year < year) {
      return true;
    } else if (this._date.year === year && this._date.month < month) {
      return true;
    } else if (this._date.year === year && this._date.month === month && this._date.day <= day) {
      return true;
    }
  }

  isAfter(date) {
    const { year, month, day } = date._date || date;
    if (this._date.year > year) {
      return true;
    } else if (this._date.year === year && this._date.month > month) {
      return true;
    } else if (this._date.year === year && this._date.month === month && this._date.day > day) {
      return true;
    }
  }

  isSame(date) {
    const { year, month, day } = date._date || date;
    if (this._date.year === year && this._date.month === month && this._date.day === day) {
      return true;
    }
  }

  isSameOrAfter(date) {
    const { year, month, day } = date._date || date;
    if (this._date.year > year) {
      return true;
    } else if (this._date.year === year && this._date.month > month) {
      return true;
    } else if (this._date.year === year && this._date.month === month && this._date.day >= day) {
      return true;
    }
  }

  format(formatString) {
    const { year, month, day } = this._date;
    return formatString
      .replace('YYYY', year)
      .replace('YY', year.toString().substr(2, 2))
      .replace('MMM', en.monthsName[month - 1])
      .replace('MM', month <= 9 ? `0${month}` : month)
      .replace('DD', day <= 9 ? `0${day}` : day)
      .replace('D', day)
      .replace('M', month);
  }

  static range(start, end, type = 'day') {
    let items = [], i;
    for (i = start; i.isBefore(end_bs) && i.isSameOrBefore(end); i = i.add(1, type)) {
      items.push(i);
    };
    if (end.isSame(end_bs)) {
      items.push(end);
    }
    return items;
  }

  static toBS(adDate) {
    const momentDate = adDate ? moment(adDate, 'YYYY/MM/DD') : moment(),
      adBase = moment(`${base_ad.year}/${base_ad.month}/${base_ad.day}`, 'YYYY/MM/DD'),
      daysCount = momentDate.diff(adBase, 'day');
    return new BSMoment(base_bs).add(daysCount, 'day');
  }

  static monthsShortName() {
    return en.monthsShortName;
  }

  static isLess(a, b) {
    const { year, month, day } = a;
    if (year < b.year) {
      return true;
    } else if (year === b.year && month < b.month) {
      return true;
    } else if (year === b.year && month === b.month && day < b.day) {
      return true;
    }
  }

  static isEqual(a, b) {
    const { year, month, day } = a;
    if (year === b.year) {
      return true;
    } else if (year === b.year && month === b.month) {
      return true;
    } else if (year === b.year && month === b.month && day === b.day) {
      return true;
    }
  }

  static isMore(a, b) {
    const { year, month, day } = a;
    if (year > b.year) {
      return true;
    } else if (year === b.year && month > b.month) {
      return true;
    } else if (year === b.year && month === b.month && day > b.day) {
      return true;
    }
  }
}