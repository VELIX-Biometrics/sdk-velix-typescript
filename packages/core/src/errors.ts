export class VelixError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'VelixError'
  }
}

export class VelixApiError extends VelixError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'VelixApiError'
  }
}

export class VelixNetworkError extends VelixError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'VelixNetworkError'
  }
}
