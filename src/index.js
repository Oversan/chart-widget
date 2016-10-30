import React from 'react'
import { render } from 'react-dom'
import Widget from './Widget'

const Root = () =>
  <div>
    <Widget type="genders" width="340" height="300" />
    <Widget type="deviceOsVersions" width="340" height="300">Widget Text 2</Widget>
    <Widget type="ageRanges">Widget Text 3</Widget>
  </div>


render(
  <Root />,
  document.getElementById('root')
)
