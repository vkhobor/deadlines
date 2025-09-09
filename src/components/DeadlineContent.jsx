import React from 'react'
import Line from './Line'

const DeadlineContent = ({
  backgroundSplitPercentage = 80,
  linesConfig = [
    {
      label: '2 weeks',
      percentWhereToPut: 40,
      durationInDays: 14,
      size: 'large',
    },
  ],
  headerText = '09.11',
  titleText = 'ARC v45',
  onDelete,
}) => {
  const [splitPercentage, setSplitPercentage] = React.useState(0)
  const [lines, setLines] = React.useState(
    linesConfig.map((line) => ({
      ...line,
      size: 'small',
    })),
  )

  React.useEffect(() => {
    // Step 2: Trigger animation on mount
    const timeout = setTimeout(() => {
      setSplitPercentage(backgroundSplitPercentage)
    }, 50) // Delay can be adjusted if needed
    return () => clearTimeout(timeout) // Cleanup timeout
  }, [backgroundSplitPercentage])

  React.useEffect(() => {
    // Step 2: Trigger animation on mount
    const timeout = setTimeout(() => {
      setLines(linesConfig)
    }, 50) // Delay can be adjusted if needed
    return () => clearTimeout(timeout) // Cleanup timeout
  }, [linesConfig])

  const hasColorConfig = linesConfig.some(
    (line) =>
      line.percentWhereToPut > backgroundSplitPercentage &&
      line.whenPassesColor,
  )
  const color = hasColorConfig
    ? (linesConfig.find(
        (line) =>
          line.percentWhereToPut > backgroundSplitPercentage &&
          line.whenPassesColor,
      )?.whenPassesColor ?? 'gray')
    : 'gray'

  return (
    <div
      name='item'
      className='h-64 outline-none block flex-nowrap flex-row items-center justify-center relative group'
    >
      <button
        className='absolute top-0 left-0 text-black text-lg z-10 leading-0 m-4 -translate-x-1/2 hidden group-hover:block'
        onClick={onDelete}
      >
        ×
      </button>
      <div className='flex w-full h-full absolute left-0 top-0 bottom-0 right-0 z-0 rounded-xl overflow-clip'>
        <div
          className={`self-stretch bg-${color}-lighter transition-all duration-800`}
          style={{ flex: `${100 - splitPercentage}%` }}
        ></div>
        <div
          className={`self-stretch bg-${color}-darker transition-all duration-800`}
          style={{ flex: `${splitPercentage}%` }}
        ></div>
      </div>
      <div className='flex w-full h-full absolute left-0 top-0 right-0 bottom-0 items-center justify-start z-0 pl-20'>
        <div className='w-auto h-auto'>
          <div className='text-2xl opacity-50'>{headerText}</div>
          <div className='text-8xl'>{titleText}</div>
        </div>
      </div>
      {lines
        .filter((line) => !line.hide)
        .map((line, index) => (
          <Line
            key={index}
            label={line.label}
            percentWhereToPut={line.percentWhereToPut}
            size={line.size}
            bold={line.bold}
          />
        ))}
    </div>
  )
}

export default DeadlineContent
