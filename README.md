# HƯỚNG DẪN BÀN GIAO VÀ HƯỚNG DẪN PHÁT TRIỂN DỰ ÁN FRONTEND

Báo cáo này tài liệu hóa toàn bộ quy trình nhận bàn giao dự án, các quy chuẩn bắt buộc cần tuân thủ trong suốt quá trình phát triển mã nguồn, và hướng dẫn chi tiết các bước tạo mới một tính năng trong hệ thống.

---

## 1. QUY TRÌNH BÀN GIAO VÀ NHẬN DỰ ÁN (ONBOARDING WORKFLOW)

Khi nhận bàn giao dự án, lập trình viên cần thực hiện tuần tự các bước thiết lập môi trường phát triển ban đầu dưới đây:

### Bước 1.1: Chuẩn bị môi trường

Yêu cầu hệ thống cần cài đặt sẵn Node.js phiên bản LTS (khuyến nghị phiên bản 18 trở lên hoặc phiên bản 20).

### Bước 1.2: Di chuyển vào thư mục dự án frontend

Mở terminal và di chuyển vào thư mục phát triển frontend:

```bash
cd fe
```

### Bước 1.3: Cài đặt các gói thư viện phụ thuộc

Thực hiện cài đặt các thư viện được định nghĩa trong package.json:

```bash
npm install
```

### Bước 1.4: Khởi tạo cấu hình Husky

Đảm bảo Husky hooks được kích hoạt và liên kết với thư mục gốc của repository:

```bash
npm run prepare
```

### Bước 1.5: Khởi động môi trường phát triển cục bộ

Chạy lệnh khởi động máy chủ phát triển (dev server) của Vite:

```bash
npm run dev
```

Truy cập vào địa chỉ hiển thị trên terminal (mặc định cấu hình cổng 3000) để kiểm tra hoạt động của giao diện.

---

## 2. CÁC LƯU Ý QUAN TRỌNG KHI BÀN GIAO VÀ PHÁT TRIỂN

Hệ thống mã nguồn gốc đã được cấu hình chặt chẽ để đảm bảo tính nhất quán và chất lượng mã nguồn thông qua Eslint, Prettier và các Git Hooks. Lập trình viên bắt buộc phải tuân thủ các quy tắc sau:

### 2.1. Quy tắc đặt tên nhánh (Branch Naming Convention)

Mọi commit trên nhánh không hợp lệ sẽ bị từ chối bởi Husky hook.

- **Cú pháp quy định**: `loại-nhánh/HH-[Id_Task]-tên-ngắn-tiếng-anh`
- **Các loại nhánh hợp lệ**:
  - `feature/`: Sử dụng khi phát triển tính năng mới. Ví dụ: `feature/HH-12-login-api`
  - `bugfix/`: Sử dụng khi sửa lỗi trong các Sprint. Ví dụ: `bugfix/HH-45-fix-avatar-upload`
  - `hotfix/`: Sử dụng khi cần sửa lỗi khẩn cấp trên môi trường Production. Ví dụ: `hotfix/HH-99-critical-payment-error`
- **Nhánh ngoại lệ**: Nhánh `main`, `develop` và các nhánh bắt đầu bằng `backup/` sẽ được hệ thống bỏ qua bước kiểm tra tên nhánh này.

### 2.2. Quy tắc viết thông điệp Commit (Commit Message Convention)

Khi thực hiện commit, Husky hook sẽ kiểm tra định dạng và độ dài của tin nhắn:

- **Giới hạn độ dài**: Tin nhắn commit không được vượt quá 75 ký tự.
- **Quy tắc định dạng**:
  - Đối với loại `feat` và `fix`: Bắt buộc phải chứa Task ID dạng `HH-[số]` và nội dung viết thường hoàn toàn. Được phép đính kèm ID Issue (ví dụ: `#29` hoặc `(#29)`) ở cuối. Ví dụ: `feat(auth): HH-12 - add google login api (#29)`.
  - Đối với các loại khác (`docs`, `chore`, `style`, `refactor`, `perf`, `test`, `ci`): Task ID `HH-[số]` là tùy chọn nhưng nội dung vẫn bắt buộc viết thường hoàn toàn và có thể kèm ID Issue ở cuối. Ví dụ: `chore(git): HH-1 - add branch name validation hook (#29)`.

### 2.3. Các quy tắc kiểm tra mã nguồn (ESLint Rules)

Khi chạy lệnh build hoặc lint, hệ thống sẽ kiểm tra nghiêm ngặt các quy tắc sau:

- **Hạn chế dùng chuỗi thô trong JSX (react/jsx-no-literals)**: Không được viết trực tiếp văn bản dạng chuỗi trong JSX (ví dụ: không viết `<h2>Goals Page</h2>`). Phải đưa chuỗi văn bản vào các hằng số, biến hoặc thông qua cấu hình đa ngôn ngữ để đảm bảo cấu trúc dự án.
- **Không hardcode mã màu**: Không được sử dụng mã màu trực tiếp dạng Hex (`#ffffff`) hoặc RGB/RGBA trong prop `sx` của các component Material UI. Bắt buộc phải gọi màu từ Theme (ví dụ: `primary.main`, `background.paper`, `text.primary`).
- **Không dùng đơn vị px hoặc em**: Không được sử dụng đơn vị `px` hoặc `em` trong prop `sx`. Bắt buộc dùng giá trị số (number, hệ thống sẽ tự quy đổi) hoặc dùng đơn vị `rem` / helper `pxToRem`.
- **Hạn chế import trực tiếp từ @mui/material**: Cấm import trực tiếp component từ thư viện MUI (ngoại trừ các file trong `@/components/ui` và file `src/main.tsx`). Phải sử dụng các component tùy biến dùng chung đã được cấu hình tại thư mục `@/components/ui`.
- **Hạn chế import trực tiếp từ @mui/icons-material**: Cấm import trực tiếp icon từ thư viện MUI. Phải sử dụng các icon đã được tái xuất thông qua file dùng chung `@/components/ui/icons`.

---

## 3. HƯỚNG DẪN CHI TIẾT TẠO MỚI MỘT TÍNH NĂNG (CREATING A FEATURE)

Để thêm mới một phân hệ tính năng vào hệ thống (ví dụ tính năng quản lý hồ sơ cá nhân có tên là `profile`), lập trình viên cần đi qua các bước kỹ thuật và các thư mục tương ứng như sau:

### Bước 3.1: Tạo thư mục cấu trúc tính năng

Tạo thư mục `fe/src/features/profile` với cấu trúc chuẩn hóa như sau:

- `fe/src/features/profile/components/`: Nơi chứa các component giao diện. Thành phần trang chính của tính năng đặt tên dạng `ProfilePage.tsx`.
- `fe/src/features/profile/services/`: Nơi chứa các hàm xử lý logic nghiệp vụ độc lập (pure functions), ví dụ `ProfileService.ts`.
- `fe/src/features/profile/hooks/`: Chứa các custom React Hook riêng của tính năng (nếu có).
- `fe/src/features/profile/constants/`: Chứa các định nghĩa hằng số dùng riêng trong nội bộ tính năng.
- `fe/src/features/profile/routes.tsx`: Định nghĩa cấu hình định tuyến cho tính năng.
- `fe/src/features/profile/index.ts`: File đóng gói chính của tính năng.

### Bước 3.2: Khai báo định tuyến cho tính năng mới

Trong file `fe/src/features/profile/routes.tsx`, định nghĩa mảng định tuyến dạng `RouteObject[]`:

```tsx
import type { RouteObject } from "react-router-dom";
import { ProfilePage } from "./components/ProfilePage";

export const profileRoutes: RouteObject[] = [
  {
    path: "profile",
    element: <ProfilePage />,
  },
];
```

Trong file `fe/src/features/profile/index.ts`, xuất các thành phần ra ngoài để các module khác sử dụng:

```typescript
export * from "./components/ProfilePage";
export * from "./routes";
```

### Bước 3.3: Tích hợp định tuyến toàn cục

Mở file định tuyến chính toàn dự án [routes.tsx](file:///d:/FOR_LEARN/TU_HOC/habit-tracer/fe/src/routes.tsx), tiến hành import mảng định tuyến của tính năng mới và đưa vào mảng `children` của `MainLayout`:

```diff
 import { checkinsRoutes } from '@/features/checkins'
+import { profileRoutes } from '@/features/profile'

 export const router = createBrowserRouter([
   {
     path: '/',
     element: <MainLayout />,
-    children: [...dashboardRoutes, ...habitsRoutes, ...goalsRoutes, ...checkinsRoutes],
+    children: [...dashboardRoutes, ...habitsRoutes, ...goalsRoutes, ...checkinsRoutes, ...profileRoutes],
   },
 ])
```

### Bước 3.4: Định nghĩa và quản lý State (Zustand Slices)

Nếu tính năng mới cần quản lý dữ liệu toàn cục và đồng bộ dữ liệu chéo:

1. Tạo một slice mới tại `fe/src/store/profileSlice.ts`.
2. Định nghĩa interface state và các hàm cập nhật state, sau đó xuất ra hàm khởi tạo slice.
3. Trong file định nghĩa kiểu dữ liệu của store [types.ts](file:///d:/FOR_LEARN/TU_HOC/habit-tracer/fe/src/store/types.ts), import interface của slice vừa tạo và tích hợp nó vào kiểu `BoundStore`.
4. Trong file cấu hình store chính [useBoundStore.ts](file:///d:/FOR_LEARN/TU_HOC/habit-tracer/fe/src/store/useBoundStore.ts), import hàm khởi tạo slice và gộp vào hàm tạo store.

### Bước 3.5: Khai báo Kiểu dữ liệu và Hằng số dùng chung

- Đối với kiểu dữ liệu nghiệp vụ dùng chung, tạo file định nghĩa kiểu tại `fe/src/types/profile.ts` và xuất ra thông qua file trung gian `fe/src/types/index.ts`.
- Đối với các hằng số dùng chung toàn cục hoặc các hằng số cấu hình hệ thống, định nghĩa chúng tại `fe/src/constants/`.
