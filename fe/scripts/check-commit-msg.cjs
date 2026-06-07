const fs = require('fs')
const path = require('path')

const commitMsgFile = process.argv[2]
if (!commitMsgFile) {
  console.error('Không tìm thấy file tin nhắn commit.')
  process.exit(1)
}

const commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim()

// Bỏ qua kiểm tra đối với các commit tự động (Merge, Revert)
if (commitMsg.startsWith('Merge ') || commitMsg.startsWith('Revert ') || commitMsg.startsWith('merge ')) {
  process.exit(0)
}

// Regex kiểm tra định dạng
// 1. Đối với feat và fix: BẮT BUỘC phải có ID Task dạng HH-[số] và viết thường
const featFixRegex = /^(feat|fix)(\([a-z0-9\-]+\))?: HH-\d+ - [a-z0-9\s\-\.\,\'\(\)\[\]\/_]+$/

// 2. Đối với docs, chore, style, refactor, test, ci: ID Task là tùy chọn (optional) nhưng vẫn bắt buộc viết thường
const otherRegex = /^(docs|chore|style|refactor|perf|test|ci)(\([a-z0-9\-]+\))?: (HH-\d+ - )?[a-z0-9\s\-\.\,\'\(\)\[\]\/_]+$/

const isValid = featFixRegex.test(commitMsg) || otherRegex.test(commitMsg)

if (!isValid) {
  console.error('\n[LỖI ĐỊNH DẠNG COMMIT] Tin nhắn commit không hợp lệ!')
  console.error('Nội dung bạn đã gõ: "' + commitMsg + '"')
  console.error('\nYêu cầu tuân thủ đúng quy tắc:')
  console.error('1. Với feat/fix: <type>(scope): HH-[Id_Task] - <nội dung bằng tiếng Anh, viết thường>')
  console.error('   Ví dụ: feat(auth): HH-12 - add google login api.')
  console.error('   Ví dụ: fix(ui): HH-45 - resolve overflow button on mobile\n')
  console.error('2. Với docs/chore/other: <type>: <nội dung viết thường> hoặc có thêm scope & Task ID')
  console.error('   Ví dụ: docs: update setup instruction in readme')
  console.error('   Ví dụ: chore(deps): HH-1 - install material ui\n')
  console.error('Lưu ý: Nội dung mô tả commit phải viết THƯỜNG hoàn toàn (không viết hoa chữ cái đầu).\n')
  process.exit(1)
}

console.log('Kiểm tra định dạng commit: HỢP LỆ.')
process.exit(0)
