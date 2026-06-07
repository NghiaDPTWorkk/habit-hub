# BÁO CÁO KẾ HOẠCH TRIỂN KHAI DỰ ÁN TRACEX

**Đơn vị thực hiện:** Nhóm ByteBuilders  
**Giai đoạn:** 08/06/2026 – 17/06/2026  
**Nền tảng kỹ thuật:** React, TypeScript, Material UI (MUI), Zustand, LocalStorage, React Router, Husky, Eslint, Prettier  

---

## I. TỔNG QUAN PHÂN BỔ NGUỒN LỰC & VAI TRÒ DỰ ÁN

| Nhân sự | Vai trò | Trách nhiệm chuyên môn |
| :--- | :--- | :--- |
| **Dương P. T. Nghĩa** | Lead BA & PM | Quản lý nghiệp vụ, kiểm soát luồng dữ liệu, xét duyệt Pull Request (PR). Đã thiết lập mã nguồn gốc (Base Code) chuẩn hóa với React Router, Husky, Eslint, Prettier. Không trực tiếp lập trình tính năng. |
| **Lê N. M. Phương** | QA & Deployment | Thiết lập quy trình triển khai tự động (Staging/Production). Quản lý chất lượng (QA), thực thi kiểm thử (E2E Testing) và kiểm soát lỗi (Bug tracking). |
| **Nhóm Lập trình** | Developers | Triển khai mã nguồn bao gồm giao diện bằng MUI và xử lý trạng thái bằng Zustand. Cam kết tuân thủ quy tắc Eslint/Prettier qua Husky pre-commit hook. |

---

## II. TỔNG QUAN TÍNH NĂNG VÀ PHÂN CÔNG (FEATURE OVERVIEW)

*Phần này giải thích tóm tắt ý nghĩa của từng tính năng (Feature) trong hệ thống và người chịu trách nhiệm chính trước khi đi sâu vào chi tiết kỹ thuật.*

### Feature 1: Quản lý Thói quen (Habit Management) — Alrz & Xuân Ny
* **Giải thích:** Đây là phân hệ cốt lõi của ứng dụng. Cho phép người dùng tạo mới, chỉnh sửa, xóa, thiết lập tần suất (hàng ngày hoặc các ngày cụ thể trong tuần) và mức độ ưu tiên cho các thói quen. Phân hệ này cũng cung cấp bộ lọc nâng cao để người dùng dễ dàng tìm kiếm thói quen đang theo dõi.

### Feature 2: Ghi nhận Tiến độ (Check-ins) — Hạnh Trần
* **Giải thích:** Tính năng cho phép người dùng đánh dấu hoàn thành thói quen mỗi ngày. Hỗ trợ thao tác nhanh (Quick Toggle) đối với thói quen đơn giản, hoặc nhập số lượng chi tiết (Multi-Count) đối với thói quen có chỉ tiêu lớn (VD: uống 3/8 ly nước). Đi kèm là trang lịch sử để kiểm tra lại tiến độ các ngày trước.

### Feature 3: Mục tiêu & Cột mốc (Goals & Progress) — Trúc Quỳnh
* **Giải thích:** Tính năng thúc đẩy động lực cá nhân. Người dùng có thể tự đặt ra mục tiêu dài hạn (như duy trì chuỗi 30 ngày liên tiếp hoặc hoàn thành tổng cộng 100 lần). Hệ thống sẽ theo dõi và hiển thị thông báo chúc mừng (Toast/Snackbar) ngay khi người dùng chạm ngưỡng 80% và 100% mục tiêu.

### Feature 4: Bảng điều khiển Tổng quan (Dashboard & Analytics) — Bảo Như
* **Giải thích:** Trung tâm thống kê của ứng dụng. Cung cấp cái nhìn toàn cảnh về hiệu suất cá nhân thông qua các thẻ chỉ số (KPI), thống kê chuỗi ngày liên tiếp (streaks), tỷ lệ hoàn thành trong 7 ngày qua, và đặc biệt là hệ thống cảnh báo (At-Risk Banner) nhằm nhắc nhở các thói quen sắp bị đứt chuỗi.

---

## III. PHÂN TÁCH CHI TIẾT CÔNG VIỆC (UI & HOOK)

| Phân hệ (Feature) | Nhiệm vụ cụ thể (Tasks) |
| :--- | :--- |
| **F1. Quản lý Thói quen**<br>(Alrz & Xuân Ny) | - **Alrz (Logic):** Viết custom hook `useHabitStore` (Zustand) để xử lý CRUD; viết hàm tính toán lịch trình `ScheduleService` và logic Zod validation cho form.<br>- **Xuân Ny (UI):** Viết giao diện MUI cho `<HabitCard>`, `<HabitFormModal>`, trang `/habits` (gồm `<HabitList>`, `<FilterSidebar>`) và `<HabitOverflowMenu>`. |
| **F2. Ghi nhận Tiến độ**<br>(Hạnh Trần) | - **Hạnh (Hook & UI):** Viết hook `useCheckInStore` xử lý upsert, chặn ngày tương lai, chặn vượt target. Viết UI nút `<QuickToggle>`, hộp thoại `<MultiCountModal>` và trang lịch sử `/check-ins` kết hợp MUI DatePicker. |
| **F3. Mục tiêu & Cột mốc**<br>(Trúc Quỳnh) | - **Trúc Quỳnh (Hook & UI):** Viết hook `useGoalStore` quản lý mục tiêu và detect ngưỡng 80/100%. Viết UI `<GoalPanel>`, `<GoalForm>`, thanh `<ProgressBar>` (LinearProgress) và logic gọi MUI Snackbar (Toast). |
| **F4. Bảng điều khiển**<br>(Như) | - **Bảo Như (Logic & UI):** Viết hàm utility tính streaks, rates từ store. Viết UI trang `/dashboard`, thẻ `<KpiCard>`, cảnh báo `<AtRiskBanner>` và danh mục `<CategorySection>`. |

---

## IV. LỊCH TRÌNH LẬP TRÌNH VÀ TÍCH HỢP THEO NGÀY (8/6 - 17/6)

| Ngày | Nghĩa (BA/PM) | Phương (QA/Deploy) | Alrz & Ny (Habits) | Hạnh (Check-ins) | Quỳnh (Goals) | Như (Dashboard) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **T2<br>08/06** | Phổ biến nghiệp vụ và rà soát data flow. Hướng dẫn rule Eslint/Husky. | Thiết lập môi trường Staging. Lập Test Plan. | **Alrz:** Viết hook `useHabitStore`. <br>**Ny:** Dựng layout `/habits` với React Router. | Viết hook `useCheckInStore` xử lý upsert. | Viết hook `useGoalStore` khởi tạo mục tiêu. | Dựng các hàm tính toán thống kê (Streaks/Rates). |
| **T3<br>09/06** | Review cấu trúc Store và xác nhận Layout UI. | Kiểm tra tính ổn định của Staging. Rà soát Test Cases. | **Alrz:** Thiết lập Zod Validation. <br>**Ny:** Dựng UI `<HabitCard>` & `<HabitFormModal>`. | Dựng UI nút `<QuickToggle>`. | Dựng UI `<GoalForm>` và thanh `<ProgressBar>`. | Dựng UI tổng quan `<KpiCard>` và ghép biến số. |
| **T4<br>10/06** | Kiểm tra tương tác dữ liệu chéo giữa các Zustand Stores. | Kiểm thử luồng Tạo/Cập nhật Thói quen trên Staging. | **Alrz:** Đổ dữ liệu từ Store vào UI Form. <br>**Ny:** Dựng UI `<FilterSidebar>`. | Dựng UI hộp thoại `<MultiCountModal>`. | Dựng UI `<GoalPanel>` hiển thị % mục tiêu. | Dựng UI danh mục thói quen `<CategorySection>`. |
| **T5<br>11/06** | Giám sát logic chặn ngày tương lai và chuẩn hóa Check-in. | Kiểm thử ranh giới (Biên ngày tháng, nhập quá chỉ tiêu). | **Alrz:** Đồng bộ trạng thái đa luồng. <br>**Ny:** Hoàn thiện UI trang `/habits`. | Dựng UI `/check-ins` tích hợp MUI DatePicker. | Viết hàm kích hoạt MUI Snackbar (Ngưỡng 80/100%). | Dựng UI hiển thị chuỗi ngày `<HabitStatsRow>`. |
| **T6<br>12/06** | Khớp nối dữ liệu Check-In với Dashboard và hệ thống Goals. | Tiêm Seed Data lên Staging để test E2E. | Hoàn thiện `<HabitOverflowMenu>` và Empty/Error UI. | Ghép nối logic lọc theo ngày cho trang lịch sử. | Khắc phục lỗi vòng lặp hiển thị tin nhắn Toast. | Dựng `<AtRiskBanner>`, chốt Dashboard. |
| **T7-CN<br>13-14/6** | **Giai đoạn dự phòng** | **Tối ưu mã nguồn** | **Theo quy chuẩn Prettier/Eslint** | | | |
| **T2<br>15/06** | Thực hiện nghiệm thu toàn bộ tính năng. | Quét lỗi toàn hệ thống, tạo báo cáo Bug Log. | Nhận báo cáo lỗi, tiến hành khắc phục Habit Store. | Nhận báo cáo lỗi, tối ưu hóa quy trình Check-in. | Nhận báo cáo lỗi, hiệu chỉnh tiến trình Goals. | Khắc phục độ trễ đồng bộ số liệu Dashboard. |
| **T3<br>16/06** | Tổ chức nghiệm thu các bản vá lỗi (Hotfix PRs). | Xác nhận khắc phục lỗi. Chuẩn bị bản Production. | Tinh chỉnh Responsive (MUI) trên toàn phân hệ. Đảm bảo 100% pass Husky Hooks. | Tinh chỉnh Responsive (MUI) trên toàn phân hệ. Đảm bảo 100% pass Husky Hooks. | Tinh chỉnh Responsive (MUI) trên toàn phân hệ. Đảm bảo 100% pass Husky Hooks. | Tinh chỉnh Responsive (MUI) trên toàn phân hệ. Đảm bảo 100% pass Husky Hooks. |
| **T4<br>17/06** | **[FEATURE FREEZE] ĐÓNG BĂNG MÃ NGUỒN** | **[RELEASE] TRIỂN KHAI PRODUCTION** | **[LOCK] KẾT THÚC CẬP NHẬT TÍNH NĂNG MỚI** | | | |
