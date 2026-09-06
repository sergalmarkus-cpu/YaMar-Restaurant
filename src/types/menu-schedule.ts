export interface MenuSchedule {
  id: number;
  menuId: number;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  active: boolean;
}

export interface CreateMenuScheduleInput {
  menuId: number;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  active?: boolean;
}

export interface UpdateMenuScheduleInput {
  menuId?: number;
  dayOfWeek?: number;
  openTime?: string;
  closeTime?: string;
  active?: boolean;
}

export interface MenuScheduleByDay {
  dayOfWeek: number;
  schedules: MenuSchedule[];
}