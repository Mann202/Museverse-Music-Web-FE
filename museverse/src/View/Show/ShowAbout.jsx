import React from 'react'

const ShowAbout = ({desc}) => {
  return (
    <div className='flex flex-col w-11/12 mx-auto mb-6'>
      <h3 className='text-[#efefef] text-2xl font-bold'>About</h3>
      <span dangerouslySetInnerHTML={{__html: desc}} className='line-clamp-5 text-[#a7a7a7] my-2'>
      </span>
    </div>
  )
}

export default ShowAbout