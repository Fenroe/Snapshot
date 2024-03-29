import React from 'react'
import PropTypes from 'prop-types'

export const IconWrapper = ({ icon, url }) => {
  return (
    <div className="icon-wrapper">
      {icon}
    </div>
  )
}

IconWrapper.propTypes = {
  icon: PropTypes.element,
  url: PropTypes.string
}
