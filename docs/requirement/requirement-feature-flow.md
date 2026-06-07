# BÁO CÁO KẾ HOẠCH TRIỂN KHAI DỰ ÁN TRACEX (V6)

**Đơn vị thực hiện:** Nhóm ByteBuilders  
**Giai đoạn:** 08/06/2026 – 17/06/2026  
**Nền tảng kỹ thuật:** React, TypeScript, Material UI (MUI), Zustand, LocalStorage, React Router, Husky, Eslint, Prettier  
**Trạng thái hiện tại:** Base Structure, Routing, Theme MUI, và cấu hình Zustand đã được thiết lập thành công bởi Nghĩa.

---

## I. TỔNG QUAN PHÂN BỔ NGUỒN LỰC

### Nhân sự & Vai trò

* **Dương P. T. Nghĩa (Lead BA & PM):** Quản lý nghiệp vụ, kiểm soát luồng dữ liệu, xét duyệt Pull Request (PR) và giám sát tiến độ. Đã thiết lập mã nguồn gốc (Base Code) chuẩn hóa với React Router, Husky, Eslint, Prettier để đảm bảo code format đồng nhất trước khi commit. Không trực tiếp lập trình tính năng.
* **Lê N. M. Phương (QA & Deployment):** Thiết lập quy trình triển khai tự động (Staging/Production). Quản lý chất lượng (QA), thực thi kiểm thử (E2E Testing) và kiểm soát lỗi (Bug tracking).
* **Nhóm Lập trình (Developers - Alrz, Ny, Hạnh, Quỳnh, Như):** Triển khai mã nguồn độc lập bao gồm giao diện (UI) bằng MUI và xử lý trạng thái (State Hook) bằng Zustand. Cam kết tuân thủ quy tắc Eslint/Prettier qua Husky pre-commit hook.

---

## II. KẾ HOẠCH LẬP TRÌNH VÀ TÍCH HỢP THEO NGÀY (8/6 - 17/6)

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
