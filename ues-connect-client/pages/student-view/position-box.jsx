import React, { useState } from 'react'
import Link from 'next/link'
import { GiNotebook } from 'react-icons/gi'
export default function PositionBox(props) {
  const [isReadMore, setIsReadMore] = useState(true) //state to check if user has selected readmore
  const handleReadMore = () => {
    //sets isLiked to the opposite of the current isReadMore
    setIsReadMore(!isReadMore)
  }

  console.log(props)

  const href = '/student-view/student-positions/'

  return (
    <div className="rounded overflow-hidden shadow-lg my-4 py-4 flex flex-col text-slate-800 text-sm bg-slate-50">
      <div className="flex items-center self-center">
        <div className="font-bold text-3xl pb-2 ">Available Positions</div>
        <GiNotebook className="ml-2 text-xl"></GiNotebook>
      </div>
      {props.positions ? (
        props.positions.map((data, index) => (
          <div key={data._id} className="text-base self-center flex flex-col">
            <div className="flex-col flex self-center pb-2 space-y-2">
              <Link
                className="hover:text-slate-500 text-2xl font-bold self-center"
                href={href + data._id}
              >
                {data.name}
              </Link>
              <div className="flex self-center space-x-2">
                {data.skills[0] != null
                  ? data.skills.map((skill) => (
                      <div className="self-center flex flex-row text-slate-50">
                        <div className="bg-slate-500 text-base font-bold rounded-md px-2">
                          {skill.skill}
                        </div>
                      </div>
                    ))
                  : ''}
              </div>
              <div className="italic text-base self-center">
                Positions Avilable: {data.numberOfOpenings}
              </div>
            </div>
            <div className="px-2 mb-3 flex flex-col self-center">
              <div
                className={` text-sm text-center self-center ${
                  isReadMore && 'line-clamp-2'
                }`}
              >
                {' '}
                {/* Uses tailwind line-clamp to truncate the explanation until user clicks readmore */}
                {data.description}
              </div>
              <button
                onClick={handleReadMore}
                className=" hover:text-slate-500 bg-none rounded text-sm font-bold self-center"
              >
                {isReadMore ? 'Read More...' : 'Read Less...'}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div> No Positions Available</div>
      )}
    </div>
  )
}
