import React from 'react'

const PAGE_TITLE = 'Goals Page'
const PAGE_DESC = 'Quản lý các mục tiêu dài hạn.'

export const GoalsPage: React.FC = () => {
  return (
    <div>
      <h2>{PAGE_TITLE}</h2>
      <p>{PAGE_DESC}</p>
    </div>
  )
}
