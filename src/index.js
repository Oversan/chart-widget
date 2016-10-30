import React from 'react'
import { render } from 'react-dom'
import Widget from './Widget'

const Root = (props) => {
  return (
    <div>
      <Widget type="genders"></Widget>
      <Widget type="deviceOsVersions">Widget Text 2</Widget>
      <Widget type="ageRanges">Widget Text 3</Widget>
    </div>
  )
}

render(
  <Root />,
  document.getElementById('root')
)
