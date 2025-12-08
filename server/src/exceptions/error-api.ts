export class ApiError extends Error {
  status;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  public static UnauthorizedError(message?: string) {
    return new ApiError(401, message || 'Пользователь не авторизован');
  }

  public static BadRequest(status: number, message: string) {
    return new ApiError(status, message);
  }
}
