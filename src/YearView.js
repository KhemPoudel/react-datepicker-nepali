import React from 'react';
import cs from 'classnames';

import Cell from './Cell';
import ViewHeader from './ViewHeader';
import BSMoment from './BSDate';

export default class YearView extends React.Component {

  getYears() {
    const now = this.props.date,
      start = now.subtract(5, 'year'),
      end = now.add(6, 'year'),
      currYear = now.year();
    return BSMoment
      .range(start, end, 'year')
      .map(year => {
        return {
          label: year.year(),
          curr: currYear === year.year()
        }
      });
  }

  cellClick(e) {
    const year = parseInt(e.target.innerHTML, 10);
    if (year) {
      const date = this.props.date.year(year);
      this.props.prevView(date)
    }
  }

  next() {
    let nextDate = this.props.date.add(10, 'year')
    // if (this.props.maxDate && nextDate.isAfter(this.props.maxDate, 'day')) {
    //   nextDate = this.props.maxDate
    // }
    this.props.setInternalDate(nextDate)
  }

  prev() {
    let prevDate = this.props.date.subtract(10, 'year');
    // if (this.props.minDate && prevDate.isBefore(this.props.minDate, 'day')) {
    //   prevDate = this.props.minDate
    // }
    this.props.setInternalDate(prevDate)
  }

  render() {
    const years = this.getYears(),
      yearsCells = years.map((item, i) => (
        <Cell
          value={item.label}
          className={cs({
            year: true,
            current: item.curr
          })}
          key={i}
        />
      ))
    const currentDate = [years[0].label, years[years.length - 1].label].join('-')
    return (
      <div className="years-view">
        <ViewHeader
          data={currentDate}
          next={this.next.bind(this)}
          prev={this.prev.bind(this)}
        />
        <div className="years" onClick={this.cellClick.bind(this)}>
          {yearsCells}
        </div>
      </div>
    )
  }
}