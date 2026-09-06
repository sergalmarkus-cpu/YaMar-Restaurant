export interface CategoryName {
  [language: string]: string;
}

export interface CategoryDescription {
  [language: string]: string;
}

export interface Category {
  id: number;
  menuId: number;
  name: CategoryName;
  description: CategoryDescription | null;
  displayOrder: number;
  active: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CategoryCreateInput {
  menuId: number;
  name: CategoryName;
  description?: CategoryDescription;
  displayOrder?: number;
  active?: boolean;
}

export interface CategoryUpdateInput {
  menuId?: number;
  name?: CategoryName;
  description?: CategoryDescription;
  displayOrder?: number;
  active?: boolean;
}