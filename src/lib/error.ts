export class AuthError extends Error {
  constructor(message = 'Unauthorized') {
    super(
      JSON.stringify({
        statusCode: 401,
        message,
      })
    );
    this.name = 'AuthError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(
      JSON.stringify({
        statusCode: 403,
        message,
      })
    );
    this.name = 'ForbiddenError';
  }
}
