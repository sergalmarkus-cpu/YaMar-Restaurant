export type TableStatus =
  | 'available'
  | 'occupied'
  | 'reserved'
  | 'cleaning';

export interface Table {
  id: number;
  establishmentId: number;
  areaId: number | null;

  code: string;
  qrCode: string | null;

  capacity: number | null;

  status: TableStatus | null;

  latitude: string | null;
  longitude: string | null;
  floor: number | null;

  active: boolean;

  createdAt: string;
  updatedAt: string;
}