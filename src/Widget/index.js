import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import cssModules from 'react-css-modules'
import styles from './style.css'
import { camelcaseToWords } from './helpers'

var Highcharts = require('highcharts')
require('highcharts/modules/exporting')(Highcharts)


class Widget extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
      message: '',
      elements: [],
      type: this.props.type,
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

  toggleContent() {
    fetch('http://localhost:3000/api/v1/getTestData', {method: 'GET'})
      .then(response => response.json())
      .then(data => {
        this.setState({
          'data': data,
          'typesList': this.filteredTypesList(data)
        })
        this.buildChart()
      })
      .catch(errText => {
        this.setState({
          'message': 'Can`t load source data',
          'data': ''
        })
        throw new Error(errText)}
      )
  }

  transformData(data) {
    const dataObj = this.state.data["demographic-campaign-info"][0]["VIEW"][this.state.type]
    if (dataObj.hasOwnProperty("other") && dataObj.hasOwnProperty("total") && dataObj.hasOwnProperty("values")) {
      const other = dataObj["other"]
      const total = dataObj["total"]
      const values = dataObj["values"]

      return values.map(item => [item.key, item.amount*100/(total-other)])
    } else {
      this.setState({'message': `${this.state.type} items with incorect data`})
      return
    }
  }

  displayChart(data) {
    var widget = this.refs.widgetComponent
    var chart = Highcharts.chart(widget, {
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
        data: data
      }]
    });
  }

  buildChart() {
    const preparedData = this.transformData(this.state.data)
    if (preparedData) {
      this.displayChart(preparedData)
    }
  }

  filteredTypesList(data) {
    const items = data["demographic-campaign-info"][0]["VIEW"]
    return Object.keys(items)
      .filter(item => items[item].hasOwnProperty('other') &&
                      items[item].hasOwnProperty('total') &&
                      items[item].hasOwnProperty('values'))
  }

  changeType(e) {
    this.setState({type: e.target.value})
    this.toggleContent()
  }

  componentDidMount() {
    this.toggleContent()
  }

  render() {
    return (
      <div styleName="widget">
        <div styleName="select">
          <select onChange={this.changeType} value={this.state.type}>
            {this.state.elements.map(
              (item, i) => <option key={i} value={item}> {item} </option>
            )}
          </select>
        </div>
        <div ref='widgetComponent' styleName="widget-content">
          {this.state.message}
        </div>
      </div>
    )
  }
}

Widget.propTypes = {
  children: PropTypes.node
}

export default cssModules(Widget, styles)
