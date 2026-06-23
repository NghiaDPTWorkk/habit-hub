const fs = require('fs')
const path = require('path')

let hasError = false

// 1. Kiểm tra các thư mục tính năng (features/*)
const featuresDir = path.resolve(__dirname, '../src/features')
if (fs.existsSync(featuresDir)) {
  const features = fs.readdirSync(featuresDir)
  features.forEach((feature) => {
    const featurePath = path.join(featuresDir, feature)
    if (fs.statSync(featurePath).isDirectory()) {
      const files = fs.readdirSync(featurePath)
      const hasIndex = files.some(file => file === 'index.ts' || file === 'index.tsx')
      if (!hasIndex) {
        console.error(`[Lỗi Cấu Trúc] Thư mục tính năng "src/features/${feature}" bắt buộc phải có file "index.ts" hoặc "index.tsx" để làm Public API!`)
        hasError = true
      }
    }
  })
}

// 2. Kiểm tra các thư mục chung bắt buộc có file index
const requiredDirs = [
  'src/components/ui',
  'src/components/layouts',
  'src/constants',
  'src/store',
  'src/types',
]

requiredDirs.forEach((dirRelativePath) => {
  const dirPath = path.resolve(__dirname, '../', dirRelativePath)
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    const files = fs.readdirSync(dirPath)
    const hasIndex = files.some(file => file === 'index.ts' || file === 'index.tsx')
    if (!hasIndex) {
      console.error(`[Lỗi Cấu Trúc] Thư mục chung "${dirRelativePath}" bắt buộc phải có file "index.ts" hoặc "index.tsx"!`)
      hasError = true
    }
  }
})

if (hasError) {
  process.exit(1)
}

console.log('Kiểm tra cấu trúc file index: HỢP LỆ cho toàn bộ dự án.')
