import QRCode from 'qrcode';

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};

export const generateTicketQRData = (
  ticketNumber: string,
  seminarId: string,
  userId: string
): string => {
  return JSON.stringify({
    ticketNumber,
    seminarId,
    userId,
    timestamp: new Date().toISOString(),
  });
};
