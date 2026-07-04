import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { qrCode, tableNumber } = body;
    
    // URL que se abrirá al escanear el QR
    const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/table/${qrCode}`;
    
    // Generar QR code como imagen
    const qrImage = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    
    return NextResponse.json({
      success: true,
      data: {
        qrImage,
        url,
        tableNumber,
      },
    });
  } catch (error) {
    console.error('Error generating QR:', error);
    return NextResponse.json(
      { success: false, error: 'Error al generar código QR' },
      { status: 500 }
    );
  }
}