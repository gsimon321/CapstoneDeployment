import React, { useState } from 'react'
import Link from 'next/link'
import StudentExecCard from './student-exec'

export default function StudentCard(props) {
  const [isReadMore, setIsReadMore] = useState(true) //state to check if user has selected readmore
  const handleReadMore = () => {
    //sets isLiked to the opposite of the current isReadMore
    setIsReadMore(!isReadMore)
  }

  const href = '/student-view/student-clubs/'
  console.log(props.data.execs, 'exec')

  return (
    <div className="rounded overflow-hidden shadow-lg my-4 mx-4 bg-white text-slate-800 flex flex-col w-4/5 p-2">
      <h1 className="px-2 text-3xl font-bold self-center hover:text-slate-500">
        <Link href={href + props.data.name + '/' + props.data._id}>
          {props.data.name}
        </Link>
      </h1>
      <h2 className="px-2 text-base text-gray-900 italic self-center">
        {props.data.department}
      </h2>
      <div className="px-2 py-1 mb-3 flex-col flex">
        <div className={`text-sm text-center ${isReadMore && 'line-clamp-3'}`}>
          {' '}
          {/* Uses tailwind line-clamp to truncate the explanation until user clicks readmore */}
          {props.data.description}
        </div>
        <button
          onClick={handleReadMore}
          className=" hover:text-slate-500 bg-none rounded text-sm font-bold self-center"
        >
          {isReadMore ? 'Read More...' : 'Read Less...'}
        </button>
      </div>
      <div className="flex flex-wrap self-center bg-white px-4">
        {props.data.execs
          ? props.data.execs.map((exec) => (
              <StudentExecCard data={exec}></StudentExecCard>
            ))
          : ''}
      </div>
    </div>
  )
}
