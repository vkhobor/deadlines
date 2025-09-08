import React, { useState, useEffect } from 'react'
import Line from './Line'
import DeadlineContent from './DeadlineContent'

const Deadline = () => {
  const [deadlines, setDeadlines] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const deadlinesFromUrl = []
    let index = 1
    while (
      queryParams.has(`deadline-name-${index}`) &&
      queryParams.has(`deadline-date-${index}`)
    ) {
      const name = queryParams.get(`deadline-name-${index}`)
      const date = queryParams.get(`deadline-date-${index}`)
      deadlinesFromUrl.push({ name, date })
      index++
    }
    setDeadlines(deadlinesFromUrl)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!deadlines) {
      return
    }

    const queryParams = new URLSearchParams(window.location.search)
    Array.from(queryParams.keys()).forEach((key) => {
      if (
        key.startsWith('deadline-name-') ||
        key.startsWith('deadline-date-')
      ) {
        queryParams.delete(key)
      }
    })
    deadlines.forEach((deadline, index) => {
      queryParams.set(`deadline-name-${index + 1}`, deadline.name)
      queryParams.set(`deadline-date-${index + 1}`, deadline.date)
    })
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`
    window.history.replaceState(null, '', newUrl)

    window.parent.postMessage(
      { type: 'url-change', url: window.location.href },
      '*',
    )
  }, [deadlines])

  const staticLinesConfig = [
    {
      label: '2 year',
      percentWhereToPut: 100,
      durationInDays: 730,
      hide: true,
    },
    {
      label: '1 month',
      percentWhereToPut: 50,
      durationInDays: 30,
    },

    {
      label: '3 weeks',
      percentWhereToPut: 40,
      whenPassesColor: 'green',
      durationInDays: 21,
    },
    {
      label: '2 weeks',
      percentWhereToPut: 30,
      whenPassesColor: 'lime',
      durationInDays: 14,
    },
    {
      label: '1 week',
      percentWhereToPut: 23,
      whenPassesColor: 'yellow',
      durationInDays: 7,
    },
    {
      label: '3 days',
      percentWhereToPut: 15,
      whenPassesColor: 'red',
      durationInDays: 3,
    },
    {
      label: '1 day',
      percentWhereToPut: 5,
      whenPassesColor: 'pink',
      durationInDays: 1,
    },
    {
      label: '0 day',
      percentWhereToPut: 0,
      durationInDays: 0,
      hide: true,
    },
  ]
  const [newDeadline, setNewDeadline] = useState({ name: '', date: '' })

  const handleAddDeadline = () => {
    if (newDeadline.name && newDeadline.date) {
      setDeadlines([...deadlines, newDeadline])
      setNewDeadline({ name: '', date: '' })
      setIsModalOpen(false)
    }
  }
  return (
    <>
      <div
        className={`absolute left-0 top-0 hover:border ${deadlines && deadlines.length === 0 && 'border'} rounded-md bg-transparent w-16 h-16 flex items-center justify-center pl-0 ml-4 mt-4  cursor-pointer`}
        onClick={() => setIsModalOpen(true)}
      >
        +
      </div>
      <div className='absolute right-0 top-0   text-black p-2 m-4'>
        {currentTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
      {isModalOpen && (
        <div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-white p-4 border border-gray-300'>
            <h2 className='text-lg font-bold mb-4'>Add Deadline</h2>
            <input
              type='text'
              placeholder='Name'
              value={newDeadline.name}
              onChange={(e) =>
                setNewDeadline({ ...newDeadline, name: e.target.value })
              }
              className='border p-2 mb-2 w-full'
            />
            <input
              type='date'
              value={newDeadline.date}
              onChange={(e) =>
                setNewDeadline({ ...newDeadline, date: e.target.value })
              }
              className='border p-2 mb-4 w-full'
            />
            <div className='flex justify-end'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='bg-gray-400 px-4 py-2 mr-2'
              >
                Cancel
              </button>
              <button
                onClick={handleAddDeadline}
                className='bg-blue-600 text-white px-4 py-2'
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      <div className='overflow-x-visible overflow-y-visible mt-[10%] ml-[10%] mr-[10%] mb-20 flex flex-col gap-8'>
        {deadlines &&
          deadlines.map((deadline, index) => {
            const currentDate = currentTime
            const deadlineDate = new Date(deadline.date)
            const timeDifference = Math.max(
              0,
              (deadlineDate - currentDate) / (1000 * 60 * 60 * 24), // Difference in days
            )
            const closestLines = staticLinesConfig
              .sort((a, b) => a.durationInDays - b.durationInDays)
              .reduce(
                (acc, curr, idx, arr) => {
                  if (timeDifference >= curr.durationInDays) {
                    acc[0] = curr
                  } else if (!acc[1] && timeDifference < curr.durationInDays) {
                    acc[1] = curr
                  }
                  return acc
                },
                [null, null],
              )

            const [lowerLine, upperLine] = closestLines
            const backgroundSplitPercentage =
              lowerLine && upperLine
                ? Math.max(
                    Math.min(
                      lowerLine.percentWhereToPut +
                        ((timeDifference - lowerLine.durationInDays) /
                          (upperLine.durationInDays -
                            lowerLine.durationInDays)) *
                          (upperLine.percentWhereToPut -
                            lowerLine.percentWhereToPut),
                      upperLine.percentWhereToPut,
                    ),
                    lowerLine.percentWhereToPut,
                  )
                : (lowerLine || upperLine).percentWhereToPut

            const largestIndex = staticLinesConfig.findIndex(
              (line) => line.durationInDays === lowerLine.durationInDays,
            )

            const linesConfig = staticLinesConfig.map((line, index) => {
              if (index === largestIndex) {
                return { ...line, size: 'large', bold: true }
              }

              const step = Math.abs(index - largestIndex)
              if (step === 1) {
                return { ...line, size: 'medium' }
              } else if (step === 2) {
                return { ...line, size: 'small' }
              } else {
                return { ...line, size: 'small' }
              }
            })

            console.log(
              `Lower Line Day Number: ${lowerLine?.durationInDays}, Upper Line Day Number: ${upperLine?.durationInDays}, Calculated Percentage: ${backgroundSplitPercentage}`,
            )
            return (
              <DeadlineContent
                key={index}
                headerText={`${new Date(deadline.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }).replace('/', '.')} ${new Date(deadline.date).toLocaleDateString('en-US', { weekday: 'long' })}`}
                titleText={deadline.name}
                backgroundSplitPercentage={backgroundSplitPercentage}
                linesConfig={linesConfig}
                onDelete={() => {
                  const updatedDeadlines = deadlines.filter(
                    (_, i) => i !== index,
                  )
                  setDeadlines(updatedDeadlines)
                }}
              />
            )
          })}
      </div>
    </>
  )
}

export default Deadline
