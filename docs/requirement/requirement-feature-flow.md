# Habit Tracker: Phân Công Công Việc & Lịch Trình Phát Triển

**Thời gian dự án:** 8/6/2026 (Thứ Hai) – 17/6/2026 (Thứ Tư)  
**Mục tiêu:** Hoàn thành toàn bộ quá trình phát triển trước hạn chót 20/6 khoảng 3 ngày để phục vụ tích hợp, kiểm thử và dự phòng.  
**Tech Stack (Công nghệ):** React, TypeScript, Material UI (MUI), Zustand, LocalStorage, React Router  
**Trạng thái hiện tại:** Cấu trúc dự án cơ bản (Base), Định tuyến (Routing), Theme MUI, và cấu hình Zustand đã được thiết lập thành công bởi Nghĩa.

---

## 1. Vai Trò & Trách Nhiệm Các Thành Viên

* **Dương Phạm Trọng Nghĩa (Lead BA & Quản lý dự án):** Đóng vai trò là Kiến trúc sư hệ thống (đã hoàn thành thiết lập base). Hiện tại làm Product Owner / Lead BA để đảm bảo tuân thủ các quy tắc nghiệp vụ. Chịu trách nhiệm review Pull Request (PR), kiểm soát chất lượng mã nguồn và điều phối quy trình làm việc.
* **Lê Ngọc Minh Phương (QA & Triển khai):** Chịu trách nhiệm thiết lập các pipeline tự động (Vercel/Netlify/GH Pages), viết các kịch bản kiểm thử (test cases), thực hiện kiểm thử thủ công liên tục trên môi trường Staging và quản lý các bản phát hành chính thức (release).
* **Đội ngũ Dev (Alrz, Ny, Hạnh, Quỳnh, Như):** Tập trung vào việc xây dựng các component giao diện (UI) bằng MUI và quản lý trạng thái/logic bằng các custom hook của Zustand.

---

## 2. Chi Tiết Phân Chia Công Việc (UI vs. Hooks)

### Tính năng 1: Quản lý Thói quen (Habit Management - Cốt lõi)
* **Thành viên:** Alrz Phuong & Xuân Ny
* **Alrz (Logic Lead):** Viết custom hook `useHabitStore` (Zustand) để xử lý CRUD Thói quen và đồng bộ dữ liệu vào LocalStorage. Viết logic lập lịch thói quen (`ScheduleService`) và xác thực dữ liệu form bằng thư viện Zod.
* **Xuân Ny (UI Dev):** Xây dựng các component giao diện bằng MUI bao gồm `<HabitCard>`, `<HabitFormModal>`, trang `/habits` (bao gồm `<HabitList>` & `<FilterSidebar>`), và `<HabitOverflowMenu>`.

### Tính năng 2: Điểm danh / Check-ins
* **Thành viên:** Hạnh Trần
* **Logic & Store:** Viết custom hook `useCheckInStore` (Zustand) để cập nhật check-in (upsert), kiểm tra ngăn chặn ngày trong tương lai (future-date guards) và các ràng buộc mục tiêu hàng ngày.
* **Component UI:**
  * Xây dựng giao diện nút check-in nhanh `<QuickToggle>` bên trong thẻ Habit Card.
  * Xây dựng giao diện nhập số lần check-in `<MultiCountModal>` sử dụng MUI Slider.
  * Xây dựng giao diện cho trang `/check-ins` với MUI DatePicker and `<CheckInRow>`.
  * Hỗ trợ xây dựng hộp thoại xác nhận `<ConfirmDialog>`.

### Tính năng 3: Mục tiêu & Tiến độ (Goals & Progress)
* **Thành viên:** Trúc Quỳnh
* **Logic & Store:** Viết custom hook `useGoalStore` (Zustand) để quản lý mục tiêu và phát hiện ngưỡng hoàn thành (đạt 80% / 100%).
* **Component UI:**
  * Xây dựng giao diện `<GoalPanel>` và `<GoalForm>` trong trang Chi tiết Thói quen (Habit Details).
  * Xây dựng giao diện thanh tiến trình `<ProgressBar>` sử dụng MUI LinearProgress.
  * Viết custom hook/logic để hiển thị thông báo nổi (toasts) bằng MUI Snackbar.

### Tính năng 4: Bảng điều khiển & Phân tích (Dashboard & Analytics)
* **Thành viên:** Bảo Như
* **Logic & Tiện ích:** Viết các hàm tiện ích thuần túy (pure utility functions) để tính toán các chỉ số dashboard ngay lập tức (chuỗi ngày liên tục - streaks, tỷ lệ hoàn thành, tổng số) từ dữ liệu Zustand stores.
* **Component UI:**
  * Xây dựng giao diện cho trang `/dashboard` và các thẻ thống kê `<KpiCard>` phía trên.
  * Xây dựng giao diện cho banner cảnh báo đứt chuỗi `<AtRiskBanner>` (sử dụng MUI Alert), phần danh mục thói quen `<CategorySection>` (MUI Accordion), và hàng số liệu thống kê thói quen `<HabitStatsRow>`.
  * Xây dựng giao diện cho các tag trạng thái `<StatusPill>`.

---

## 3. Lịch Trình Chi Tiết (8/6 - 17/6)

| Ngày | Nghĩa (Leader) | Phương (QA & Deploy) | Alrz & Ny (Habits) | Hạnh (Check-ins) | Quỳnh (Goals) | Như (Dashboard) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Thứ Hai 8/6** | Phổ biến logic BA & quy trình làm việc. | Thiết lập môi trường Staging & Kế hoạch test. | **Alrz:** hook `useHabitStore`. <br>**Ny:** Bố cục UI cho `/habits`. | Hook `useCheckInStore`. | Hook `useGoalStore`. | Viết các hàm phân tích số liệu. |
| **Thứ Ba 9/6** | Review các PR về layout & stores. | Xác thực triển khai staging & các test cases. | **Alrz:** Logic xác thực dữ liệu Form. <br>**Ny:** UI `<HabitCard>` & Modal tạo mới. | UI `<QuickToggle>` & ánh xạ trạng thái. | UI `<GoalForm>` & `<ProgressBar>`. | UI `<KpiCard>` & kết nối số liệu. |
| **Thứ Tư 10/6** | Đồng bộ cập nhật store state giữa các dev. | Kiểm thử tạo/sửa Thói quen trên staging. | **Alrz:** Đổ dữ liệu store vào Form. <br>**Ny:** UI `<FilterSidebar>`. | UI `<MultiCountModal>`. | UI `<GoalPanel>` & thanh tiến độ. | UI `<CategorySection>`. |
| **Thứ Năm 11/6** | Review logic xác thực & quy tắc check-in. | Kiểm thử các trường hợp biên của check-in. | **Alrz:** Logic xác thực chéo các store. <br>**Ny:** Hoàn thiện trang `/habits`. | UI trang `/check-ins` + DatePicker. | Hook hiển thị snackbar cảnh báo đạt ngưỡng. | UI `<HabitStatsRow>`. |
| **Thứ Sáu 12/6** | Đồng bộ Check-in với các chỉ số Dashboard. | Đẩy dữ liệu mẫu lên staging để test E2E. | MUI Overflow Menu, UI trống/lỗi. | Cấu hình bộ lọc ngày trên trang `/check-ins`. | Sửa lỗi lặp thông báo toast. | UI `<AtRiskBanner>` & Layout Dashboard. |
| **13/6 - 14/6** | **Ngày dự phòng** | **Hỗ trợ thêm** | **Tự tối ưu hóa code** | | | |
| **Thứ Hai 15/6** | Kiểm thử nghiệm thu BA (Acceptance). | Chạy Test E2E Giai đoạn 1 & log lỗi. | Sửa lỗi Habit Store & logic. | Sửa lỗi luồng Check-in. | Sửa lỗi hiển thị tiến độ Mục tiêu. | Sửa lỗi tính toán dashboard. |
| **Thứ Ba 16/6** | Review và duyệt các PR sửa lỗi cuối. | Test lại các lỗi đã sửa & chuẩn bị bản Prod. | Tối ưu hiển thị responsive (MUI). | Tối ưu hiển thị responsive (MUI). | Tối ưu hiển thị responsive (MUI). | Tối ưu hiển thị responsive (MUI). |
| **Thứ Tư 17/6** | **ĐÓNG BĂNG TÍNH NĂNG** | Triển khai Production & ký nghiệm thu. | **ĐÓNG BĂNG TÍNH NĂNG** | **ĐÓNG BĂNG TÍNH NĂNG** | **ĐÓNG BĂNG TÍNH NĂNG** | **ĐÓNG BĂNG TÍNH NĂNG** |
