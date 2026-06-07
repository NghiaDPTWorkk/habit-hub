import React from 'react'

const PAGE_TITLE = 'Dashboard Page'
const PAGE_DESC = 'Trang tổng quan hệ thống.'

export const DashboardPage: React.FC = () => {
  return (
    <div>
      <h2>{PAGE_TITLE}</h2>
      <p>{PAGE_DESC}</p>
    </div>
  )
}
