import React, { Component } from 'react';
import DayView from './DayView';
import MonthView from './MonthView';
import YearView from './YearView';
import BSMoment from './BSDate';
import './index.css';

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.date ? new BSMoment(props.date) : new BSMoment().now(),
      currentView: 0,
      hideCalendar: true,
      inputValue: props.date || new BSMoment().now().format('YYYY/MM/DD')
    };
  }

  componentWillReceiveProps(nextProps) {
    const date = nextProps.date ? new BSMoment(nextProps.date) : this.state.date;
    this.setState({ date });
  }

  componentDidMount() {
    document.addEventListener('click', this.documentClick.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.documentClick.bind(this));
  }

  documentClick() {
    if (!this.state.isCalendar) {
      this.setState({ hideCalendar: true });
    }
    this.setState({ isCalendar: false });
  }

  setInternalDate(date) {
    this.setState({ date });
  }

  setInputDate(date) {
    this.setState({
      date,
      inputValue: date.format('YYYY/MM/DD'),
      hideCalendar: this.props.closeOnSelect
    });
    if (date && this.props.onChange) {
      this.props.onChange(date.format('YYYY/MM/DD'));
    }
  }

  todayClick() {
    const today = new BSMoment().now();
    this.setState({
      date: today,
      inputValue: today.format('YYYY/MM/DD'),
      currentView: 0
    });
  }
  nextView() {
    let { currentView } = this.state;
    ++currentView;
    this.setState({ currentView });
  }

  prevView(date) {
    let { currentView } = this.state;
    --currentView;
    this.setState({
      currentView,
      date
    });
  }

  getView() {
    const calendarDate = this.state.date;
    const props = {
      date: calendarDate,
      nextView: this.nextView.bind(this),
      setInputDate: this.setInputDate.bind(this),
      setInternalDate: this.setInternalDate.bind(this),
      prevView: this.prevView.bind(this)
    }
    switch (this.state.currentView) {
      case 0:
        return <DayView {...props} />;
        break;
      case 1:
        return <MonthView {...props} />;
        break;
      case 2:
        return <YearView {...props} />;
        break;
      default:
        return <DayView {...props} />;
        break;
    }
  }

  inputFocus() {
    this.setState({ isCalendar: true, hideCalendar: false });
  }

  calendarClick() {
    this.setState({ isCalendar: true });
  }

  render() {
    const { inputValue } = this.state,
      view = this.getView(),
      calendar = this.state.hideCalendar ? '' : (
        <div className="input-calendar-wrapper" onClick={this.calendarClick.bind(this)}>
          {view}
          <span className="today-btn" onClick={this.todayClick.bind(this)}>
            Today
          </span>
        </div>
      ),
      defaultProps = {
        value: inputValue,
        readOnly: true,
        onFocus: this.inputFocus.bind(this)
      };
    let { trigger } = this.props;
    trigger = trigger || <input type='text' className="input-calendar-fields" />
    trigger = { ...trigger, props: { ...trigger.props, ...defaultProps } };
    return (
      <div className="input-calendar">
        {trigger}
        {calendar}
      </div>
    );
  }
}

export default DatePicker;

