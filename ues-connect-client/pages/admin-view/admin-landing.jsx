import Link from 'next/link'
import styles from 'styles/index.module.css'
import Head from 'next/head'
import { useTheme } from '@nextui-org/react'
import { CSS, Button, Loading, Input } from '@nextui-org/react'
import { useState, useRef, useEffect, localStorage } from 'react'
import { Router, useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import client from '../apollo-client'
import { logMissingFieldErrors } from '@apollo/client/core/ObservableQuery'




export async function getServerSideProps(context) {
    return {
      props: context.query, // will be passed to the page component as props
    }
  }

export default function amdinLanding(props) {



    console.log(props)


  return (

    <div>
        <div>Hello</div>
    </div>


  )
}
