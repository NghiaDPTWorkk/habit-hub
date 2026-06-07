export class AppError extends Error {
  code: string
  field: string | undefined

  constructor(code: string, message: string, field?: string) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.field = field
    Object.setPrototypeOf(this, AppError.prototype)
  }
}
