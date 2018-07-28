import React from 'react';
import cs from 'classnames';
import Cell from './Cell';
import ViewHeader from './ViewHeader';
import BSMoment from './BSDate';

export default class MonthView extends React.Component {
  getMonth() {
    const month = this.props.date.month();
    return BSMoment.monthsShortName().map((item, i) => {
      return {
        label: item,
        curr: i === month - 1
      };
    });
  }

  cellClick(e) {
    const month = e.target.innerHTML,
      monthNumber = BSMoment.monthsShortName().findIndex(name => name === month) + 1,
      date = this.props.date.month(monthNumber);
    this.props.prevView(date)
  }

  next() {
    let nextDate = this.props.date.add(1, 'year');
    this.props.setInternalDate(nextDate)
  }

  prev() {
    let prevDate = this.props.date.subtract(1, 'year');
    this.props.setInternalDate(prevDate)
  }

  render() {
    const currentDate = this.props.date.year();
    const months = this.getMonth().map((item, i) => (
      <Cell
        className={cs({
          month: true,
          current: item.curr
        })}
        key={i}
        value={item.label}
      />
    ))

    return (
      <div className="months-view">
        <ViewHeader
          data={currentDate}
          next={this.next.bind(this)}
          prev={this.prev.bind(this)}
          titleAction={this.props.nextView}
        />
        <div className="months" onClick={this.cellClick.bind(this)}>
          {months}
        </div>
      </div>
    )
  }
}