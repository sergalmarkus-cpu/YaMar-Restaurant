import { NextResponse } from 'next/server';

export class ApiResponse {
  static success<T>(
    data: T,
    message = 'Operación realizada correctamente.',
    status = 200
  ) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      {
        status,
      }
    );
  }

  static error(
    message = 'Ha ocurrido un error.',
    status = 500,
    errors?: unknown
  ) {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
      },
      {
        status,
      }
    );
  }

  static noContent() {
    return new NextResponse(null, {
      status: 204,
    });
  }
}