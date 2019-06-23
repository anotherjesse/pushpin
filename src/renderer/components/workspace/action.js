import React from 'react'
import PropTypes from 'prop-types'

export default function Action(props) {
  return (
    <div
      role="button"
      onClick={props.callback}
      className={`ButtonAction ${
        (props.destructive
          ? 'ButtonAction-destructive'
          : 'ButtonAction--primary')
      }`}
    >
      <i className={`fa ${props.faIcon}`} />
      <div
        className="ButtonAction__label Type--secondary"
      >
        {props.label}
        <br />
        {props.shortcut}
      </div>
    </div>
  )
}

Action.propTypes = {
  callback: PropTypes.func.isRequired,
  destructive: PropTypes.bool,
  faIcon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  shortcut: PropTypes.string
}

Action.defaultProps = {
  destructive: false,
  shortcut: ''
}
