export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthdate?: Date;
  address?: string;
  
}