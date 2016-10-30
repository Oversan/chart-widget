import React from 'react'
import { render } from 'react-dom'
import Widget from './Widget'

const Root = (props) => {
  return (
    <div>
      <Widget>Widget Text 1</Widget>
      <Widget>Widget Text 2</Widget>
      <Widget>Widget Text 3</Widget>
    </div>
  )
}

render(
  <Root />,
  document.getElementById('root')
)
