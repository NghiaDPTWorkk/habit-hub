import React from 'react'

const PAGE_TITLE = 'Habits Page'
const PAGE_DESC = 'Quản lý các thói quen hàng ngày.'

export const HabitsPage: React.FC = () => {
  return (
    <div>
      <h2>{PAGE_TITLE}</h2>
      <p>{PAGE_DESC}</p>
    </div>
  )
}
