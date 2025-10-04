export class User {
  id?: string;
  firstName: string;
  lastName: string;
  birthdate?: Date;
  street?: string;
  zipCode?: string;
  city?: string;

  constructor(obj?: any) {
    // ID nur setzen wenn sie existiert
    if (obj?.id) {
      this.id = obj.id;
    }
    this.firstName = obj?.firstName ?? '';
    this.lastName = obj?.lastName ?? '';
    this.birthdate = obj?.birthdate ? new Date(obj.birthdate) : undefined;
    this.street = obj?.street ?? '';
    this.zipCode = obj?.zipCode ?? '';
    this.city = obj?.city ?? '';
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getAge(): number | null {
    if (!this.birthdate) return null;
    const today = new Date();
    const birthYear = this.birthdate.getFullYear();
    return today.getFullYear() - birthYear;
  }

  getFullAddress(): string {
    return `${this.street || ''}, ${this.zipCode || ''} ${this.city || ''}`.trim();
  }

  // ✅ Korrigierte toJSON Methode
  toJSON(): any {
    const data: any = {
      firstName: this.firstName,
      lastName: this.lastName,
      birthdate: this.birthdate?.toISOString() || null,
      street: this.street || null,
      zipCode: this.zipCode || null,
      city: this.city || null
    };
    
    // ID nur hinzufügen wenn sie existiert (für Updates)
    if (this.id) {
      data.id = this.id;
    }
    
    return data;
  }

  // ✅ Korrigierte fromFirebase Methode
  static fromFirebase(id: string, data: any): User {
    return new User({
      id: id,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
      street: data.street || '',
      zipCode: data.zipCode || '',
      city: data.city || ''
    });
  }
}