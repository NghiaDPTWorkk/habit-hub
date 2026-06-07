import React from 'react'

const PAGE_TITLE = 'Habits Page'
const PAGE_DESC = 'Manage your daily habits.'

export const HabitsPage: React.FC = () => {
  return (
    <div>
      <h2>{PAGE_TITLE}</h2>
      <p>{PAGE_DESC}</p>
    </div>
  )
}
