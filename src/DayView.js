import React from 'react';
import moment from 'moment';
import cs from 'classnames';
import BSMoment from './BSDate';
import ViewHeader from './ViewHeader';
import Cell from './Cell';

export default class DayView extends React.Component {
  getDays() {
    const { date } = this.props,
      month = date.month(),
      today = new BSMoment().now(),
      currDay = date.date(),
      year = date.year(),
      start = date
        .startOf('month')
        .weekday(0),
      end = date
        .endOf('month')
        .weekday(6);
    const daysArrays = BSMoment.range(start, end);
    return daysArrays.map(day => {
      return day
        ? {
          label: day.date(),
          prev: (day.month() < month && !(day.year() > year)) || day.year() < year,
          next: day.month() > month || day.year() > year,
          curr: day.date() === currDay && day.month() === month,
          today: day.date() === today.date() && day.month() === today.month() && day.year() === today.year()
        }
        : {
          label: '--',
          next: true,
          disabled: true
        }
    });
  }

  getDaysTitles() {
    return [0, 1, 2, 3, 4, 5, 6].map(i => ({
      label: moment()
        .weekday(i)
        .format('dd')
    }))
  }

  cellClick(e) {
    const cell = e.target,
      cellDate = parseInt(cell.innerHTML, 10),
      { date } = this.props;
    let newDate = date || new BSMoment().now();
    if (isNaN(cellDate)) return

    if (cell.className.indexOf('prev') > -1) {
      newDate = newDate.subtract(1, 'month')
    } else if (cell.className.indexOf('next') > -1) {
      newDate = newDate.add(1, 'month')
    }
    this.props.setInputDate(newDate.date(cellDate), true)
  }

  next() {
    const { date } = this.props;
    /*if (this.props.maxDate && nextDate.isAfter(this.props.maxDate, 'day')) {
      nextDate = this.props.maxDate
    }*/
    this.props.setInternalDate(date.add(1, 'month'))
  }

  prev() {
    const { date } = this.props;
    // if (this.props.minDate && prevDate.isBefore(this.props.minDate, 'day')) {
    //   prevDate = this.props.minDate
    // }
    this.props.setInternalDate(date.subtract(1, 'month'))
  }
  render() {
    const titles = this.getDaysTitles().map((item, i) => (
      <Cell className="day title" key={i} value={item.label} />
    ))
    const days = this.getDays().map((item, i) => (
      <Cell
        className={cs({
          day: true,
          next: item.next,
          prev: item.prev,
          current: item.curr,
          today: item.today
        })}
        key={i}
        value={item.label}
      />
    ))
    const currentDate = this.props.date.getMonthName();

    return (
      <div className="view days-view">
        <ViewHeader
          data={currentDate}
          next={this.next.bind(this)}
          prev={this.prev.bind(this)}
          titleAction={this.props.nextView}
        />
        <div className="days-title">{titles}</div>
        <div className="days" onClick={this.cellClick.bind(this)}>
          {days}
        </div>
      </div>
    )
  }
}