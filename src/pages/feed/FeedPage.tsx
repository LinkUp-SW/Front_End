import React from 'react'
import { UserList, WithNavBar } from '../../components'

const FeedPage = () => {
  return (
    <div>
      <UserList/>
    </div>
  )
}

export default WithNavBar(FeedPage)