const fs = require('fs')
const path = require('path')

const featuresDir = path.resolve(__dirname, '../src/features')

if (fs.existsSync(featuresDir)) {
  const features = fs.readdirSync(featuresDir)
  let hasError = false

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

  if (hasError) {
    process.exit(1)
  }

  console.log('Kiểm tra cấu trúc thư mục features: HỢP LỆ (Tất cả folder đều có file index).')
}
