import React, { Component, PropTypes } from 'react'
import cssModules from 'react-css-modules'
import styles from './style.css'
import { camelcaseToWords } from './helpers'

const Highcharts = require('highcharts')
require('highcharts/modules/exporting')(Highcharts)


class Widget extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
      message: '',
      typesList: [],
      type: this.props.type || 'genders',
      widgetWidth: this.props.width || 340,
      widgetHeight: this.props.height || 300
    }
    this.toggleContent = this.toggleContent.bind(this)
    this.buildChart = this.buildChart.bind(this)
    this.transformData = this.transformData.bind(this)
    this.displayChart = this.displayChart.bind(this)
    this.changeType = this.changeType.bind(this)
    this.filteredTypesList = this.filteredTypesList.bind(this)
  }

  componentDidMount() {
    this.toggleContent()
  }

  toggleContent() {
    fetch('http://localhost:3000/api/v1/getTestData', { method: 'GET' })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          data,
          typesList: this.filteredTypesList(data)
        })
        this.buildChart()
      })
      .catch((errText) => {
        this.setState({
          message: 'Can`t load source data',
          data: ''
        })
        throw new Error(errText)
      })
  }

  transformData() {
    const dataObj = this.state.data['demographic-campaign-info'][0].VIEW[this.state.type]
    if ({}.hasOwnProperty.call(dataObj, 'other') &&
        {}.hasOwnProperty.call(dataObj, 'total') &&
        {}.hasOwnProperty.call(dataObj, 'values')) {
      const other = dataObj.other
      const total = dataObj.total
      const values = dataObj.values

      return values.map(item => [item.key, item.amount * 100 / (total - other)])
    }

    this.setState({ message: `${this.state.type} items with incorect data` })
    return undefined
  }

  displayChart(data) {
    const widget = this.widgetComponent
    Highcharts.chart(widget, {
      chart: {
        width: this.state.widgetWidth,
        height: this.state.widgetHeight
      },
      title: {
        text: camelcaseToWords(this.state.type),
        align: 'center',
        verticalAlign: 'middle',
        y: 0
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        type: 'pie',
        name: 'Share',
        innerSize: '50%',
        data
      }]
    })
  }

  buildChart() {
    const preparedData = this.transformData(this.state.data)
    if (preparedData) {
      this.displayChart(preparedData)
    }
  }

  filteredTypesList(data) {
    const items = data['demographic-campaign-info'][0].VIEW
    const checkProperties = (item) => {
      return {}.hasOwnProperty.call(items[item], 'other') &&
             {}.hasOwnProperty.call(items[item], 'total') &&
             {}.hasOwnProperty.call(items[item], 'values')
    }

    return Object.keys(items).filter(checkProperties)
  }

  changeType(e) {
    this.setState({ type: e.target.value })
    this.toggleContent()
  }

  render() {
    return (
      <div styleName="widget">
        <div styleName="select">
          <select onChange={this.changeType} value={this.state.type}>
            {this.state.typesList.map(
              (item, i) => <option key={i} value={item}> {item} </option>
            )}
          </select>
        </div>
        <div ref={(c) => { this.widgetComponent = c }} styleName="widget-content">
          {this.state.message}
        </div>
      </div>
    )
  }
}

Widget.propTypes = {
  type: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
}
export default cssModules(Widget, styles)
