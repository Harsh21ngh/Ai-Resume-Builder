import React from 'react'

function SummeryPreview({resumeInfo}) {
  return (
    <div className='text-xs'>
      <p>
        {resumeInfo?.summery}
      </p>
    </div>
  )
}

export default SummeryPreview
