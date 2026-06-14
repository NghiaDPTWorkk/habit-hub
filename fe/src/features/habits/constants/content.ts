import type { Category, Frequency, Priority } from '@/types'

export const HABIT_FORM_CONTENT = {
  TITLE_CREATE: 'Tạo thói quen mới',
  TITLE_EDIT: 'Chỉnh sửa thói quen',
  SPECIFIC_DAYS_LABEL: 'Chọn ngày trong tuần',
  DAY_LABELS: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  CATEGORY_OPTIONS: [
    { value: 'Health' as Category, label: 'Health' },
    { value: 'Study' as Category, label: 'Study' },
    { value: 'Work' as Category, label: 'Work' },
    { value: 'Mindfulness' as Category, label: 'Mindfulness' },
    { value: 'Other' as Category, label: 'Other' },
  ],
  FREQUENCY_OPTIONS: [
    { value: 'Daily' as Frequency, label: 'Hàng ngày' },
    { value: 'Specific' as Frequency, label: 'Ngày cụ thể' },
  ],
  PRIORITY_OPTIONS: [
    { value: 'Low' as Priority, label: 'Thấp' },
    { value: 'Medium' as Priority, label: 'Trung bình' },
    { value: 'High' as Priority, label: 'Cao' },
  ],
}

export const HABITS_CONTENT = {
  TITLE: 'Quản lý Thói quen',
  SUBTITLE: 'Xây dựng lối sống lành mạnh mỗi ngày cùng Habit Tracker',
  BUTTONS: {
    CREATE: 'Tạo thói quen mới',
    EDIT: 'Chỉnh sửa',
    DELETE: 'Xóa thói quen',
    PAUSE: 'Tạm dừng',
    RESUME: 'Kích hoạt lại',
    ARCHIVE: 'Lưu trữ',
    CONFIRM_DELETE: 'Xác nhận xóa',
    CANCEL: 'Hủy bỏ',
  },
  FORM: {
    NAME_LABEL: 'Tên thói quen',
    NAME_PLACEHOLDER: 'Ví dụ: Chạy bộ, Đọc sách...',
    CATEGORY_LABEL: 'Danh mục',
    FREQUENCY_LABEL: 'Tần suất',
    PRIORITY_LABEL: 'Độ ưu tiên',
    TARGET_LABEL: 'Mục tiêu số lần một ngày',
  },
  PLACEHOLDERS: {
    EMPTY_LIST: 'Bạn chưa tạo thói quen nào. Hãy bấm nút phía trên để tạo thói quen đầu tiên!',
    NO_MATCH_FILTER: 'Không tìm thấy thói quen nào khớp với bộ lọc hiện tại.',
  },
}
