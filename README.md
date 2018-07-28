# React Date Picker Nepali

> A simple reusable datepicker component for dates in Bikram Sambat(Nepali Official Calendar)

[![NPM](https://img.shields.io/npm/v/react-datepicker-nepali.svg)](https://www.npmjs.com/package/react-datepicker-nepali) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation
Package can be installed via NPM:
```bash
npm install --save react-datepicker-nepali
```
```jsx
import React, { Component } from 'react';
import DatePicker from 'react-datepicker-nepali';

class Example extends Component {
  render () {
    return (
      <DatePicker />
    )
  }
}
## Usage
The most basic usage
```jsx
<DatePicker date={this.state.date} onChange={this.handleChange} />
```
If date prop is not passed, then the default will be today.
onChange receives date on date change.
## License

MIT © [KhemPoudel](https://github.com/KhemPoudel)
