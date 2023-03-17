import React, { useState, useEffect } from 'react'
import PositionBox from '../../position-box'
import { useRouter } from 'next/router'
import { gql } from '@apollo/client'
import client from '../../../apollo-client'
import StudentHeader from '../../student-header'
import StudentExecCard from '../../student-exec'

export default function StudentClubs(props) {
  const [isReadMore, setIsReadMore] = useState(true) //state to check if user has selected readmore
  const handleReadMore = () => {
    //sets isLiked to the opposite of the current isReadMore
    setIsReadMore(!isReadMore)
  }

  const [positionData, setPositionData] = useState([])
  const [clubData, setClubData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const clubName = router.query.clubName
  const clubId = router.query.clubId

  useEffect(() => {
    if (router.isReady) {
      fetchPositions()
      fetchClub()
    }
  }, [router.isReady])

  function fetchClub() {
    const getClub = gql`
      query Query($id: ID!) {
        club(ID: $id) {
          _id
          department
          description
          name
          execs {
            name
            program
            role
            year
          }
        }
      }
    `
    client
      .query({
        query: getClub,
        variables: { id: clubId },
      })
      .then((result) => {
        console.log(result)
        setClubData(result.data.club)
        setIsLoading(false)
      })
      .catch((e) => {
        alert(e.message)
      })
  }

  const fetchPositions = async function () {
    const getPositions = gql`
      query Query($clubId: String) {
        getPositions(clubId: $clubId) {
          _id
          clubId
          description
          name
          numberOfOpenings
          skills {
            skill
          }
        }
      }
    `
    client
      .query({
        query: getPositions,
        variables: { clubId: clubId },
      })
      .then((result) => {
        setPositionData([...result.data.getPositions])
        setIsLoading(false)
      })
      .catch((e) => {
        alert(e.message)
      })
  }

  return (
    <div className="flex flex-col bg-slate-200 w-full h-full text-slate-800 items-center">
      <StudentHeader></StudentHeader>
      <div className=" w-4/5 rounded overflow-hidden shadow-lg my-4 mx-4 flex-col flex bg-white p-2">
        <div className="flex-col flex">
          <h1 className=" px-2 text-3xl font-bold text-gray-900 self-center">
            {clubName}
          </h1>
          <h2 className=" px-2 text-lg text-gray-900 italic self-center">
            {clubData.department}
          </h2>
          <div className="px-2 py-1 mb-3 flex flex-col">
            <div
              className={` text-sm text-center ${isReadMore && 'line-clamp-4'}`}
            >
              {' '}
              {/* Uses tailwind line-clamp to truncate the explanation until user clicks readmore */}
              {clubData.description}
            </div>
            <button
              onClick={handleReadMore}
              className=" hover:text-slate-500 bg-none rounded text-sm font-bold self-center"
            >
              {isReadMore ? 'Read More...' : 'Read Less...'}
            </button>
          </div>
          <div className="flex flex-wrap self-center bg-white space-x-2 px-4">
            {clubData.execs
              ? clubData.execs.map((exec) => (
                  <StudentExecCard data={exec}></StudentExecCard>
                ))
              : ''}
          </div>
          <div className="self-center w-full p-2">
            {isLoading ? (
              <APILoadingScreen />
            ) : (
              <PositionBox positions={positionData}></PositionBox>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
