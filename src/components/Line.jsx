import React from 'react'

const Line = ({ label, percentWhereToPut, size, bold = false }) => {
  const sizeClasses = {
    large: 'text-xl mb-2',
    medium: 'text-base mb-1',
    small: 'text-xs mb-0.5',
  }

  const heightClasses = {
    large: 'h-24',
    medium: 'h-7',
    small: 'h-2.5',
  }

  return (
    <div
      className='flex items-center justify-center h-auto absolute bottom-0 flex-col translate-x-1/2'
      style={{
        right: `${percentWhereToPut}%`,
      }}
    >
      <div className={`mr-0 ${sizeClasses[size]} ${bold ? 'font-bold' : ''}`}>
        {label}
      </div>
      <div className={`w-0.5 bg-black ${heightClasses[size]}`}></div>
    </div>
  )
}

export default Line
