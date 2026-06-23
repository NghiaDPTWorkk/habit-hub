const { execSync } = require('child_process')

try {
  const branchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()

  // Bỏ qua kiểm tra đối với các nhánh chính hoặc nhánh backup
  const bypassBranches = ['main', 'develop', 'HEAD']
  if (bypassBranches.includes(branchName) || branchName.startsWith('backup/')) {
    process.exit(0)
  }

  // Cú pháp: loại-nhánh/HH-[Id_Task]-tên-ngắn-bằng-tiếng-Anh
  // loại-nhánh: feature | bugfix | hotfix
  const branchRegex = /^(feature|bugfix|hotfix)\/HH-\d+-[a-z0-9\-]+$/

  if (!branchRegex.test(branchName)) {
    console.error('\n[LỖI TÊN NHÁNH] Tên nhánh không hợp lệ!')
    console.error('Tên nhánh hiện tại: "' + branchName + '"')
    console.error('\nYêu cầu đặt tên nhánh theo đúng quy tắc:')
    console.error('  <loại-nhánh>/HH-[Id_Task]-<tên-tiếng-anh-viết-thường-ngăn-cách-bởi-dấu-gạch-ngang>')
    console.error('\nTrong đó <loại-nhánh> phải thuộc một trong các loại sau:')
    console.error('  - feature/ : Phát triển tính năng mới (Ví dụ: feature/HH-12-login-api)')
    console.error('  - bugfix/  : Sửa lỗi trong Sprint (Ví dụ: bugfix/HH-45-fix-avatar-upload)')
    console.error('  - hotfix/  : Sửa lỗi gấp trên Production (Ví dụ: hotfix/HH-99-critical-payment-error)')
    console.error('\nVui lòng đổi tên nhánh bằng lệnh sau và thử commit lại:')
    console.error('  git branch -m <tên_nhánh_mới>\n')
    process.exit(1)
  }
} catch (error) {
  console.error('Không thể kiểm tra tên nhánh:', error.message)
  process.exit(1)
}
