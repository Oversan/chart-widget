import React, { PropTypes } from 'react'
import cssModules from 'react-css-modules'
import styles from './style.css'

const Widget = (props) =>
  <div styleName="project-name">
    {props.children}
  </div>

Widget.propTypes = {
  children: PropTypes.node
}

export default cssModules(Widget, styles)
