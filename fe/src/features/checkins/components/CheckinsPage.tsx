import React from 'react'

const PAGE_TITLE = 'Checkins Page'
const PAGE_DESC = 'Daily check-in logs.'

export const CheckinsPage: React.FC = () => {
  return (
    <div>
      <h2>{PAGE_TITLE}</h2>
      <p>{PAGE_DESC}</p>
    </div>
  )
}
