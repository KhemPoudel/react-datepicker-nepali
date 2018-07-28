import React, { Component } from 'react'

import ExampleComponent from 'react-datepicker-nepali'

export default class App extends Component {
  onDateChange(date) {
    console.log('selected date=>', date);
  }
  render() {
    return (
      <div>
        <ExampleComponent text='Modern React component module' closeOnSelect onChange={this.onDateChange.bind(this)} />
      </div>
    )
  }
}
