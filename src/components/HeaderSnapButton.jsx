import React from 'react'
import PropTypes from 'prop-types'

export const HeaderSnapButton = ({ icon, openModal }) => {
  return (
    <button onClick={openModal} className="transition-transform flex justify-center items-center bg-red-500 w-16 h-16 rounded-full text-4xl text-white lg:w-56 hover:brightness-125 hover:scale-110 focus:brightness-125 focus:scale-110">
      <div className="lg:hidden">
        {icon}
      </div>
      <span className="hidden text-3xl lg:flex">Snap</span>
    </button>
  )
}

HeaderSnapButton.propTypes = {
  icon: PropTypes.element,
  openModal: PropTypes.func
}
