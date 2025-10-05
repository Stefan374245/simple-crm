export class User {
  id?: string;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  street?: string;
  zipCode?: string;
  city?: string;

  constructor(obj?: any) {
    // ✅ ID-Handling verbessert
    this.id = obj?.id || undefined;
    this.firstName = obj?.firstName ?? '';
    this.lastName = obj?.lastName ?? '';
    this.birthDate = obj?.birthDate ? new Date(obj.birthDate) : undefined;
    this.street = obj?.street ?? '';
    this.zipCode = obj?.zipCode ?? '';
    this.city = obj?.city ?? '';
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  getAge(): number | null {
    if (!this.birthDate) return null;
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // ✅ Genauere Altersberechnung
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getFullAddress(): string {
    const parts = [this.street, `${this.zipCode || ''} ${this.city || ''}`.trim()];
    return parts.filter(part => part && part.trim()).join(', ');
  }

  // ✅ Für Firebase-Speicherung (ohne ID)
  toFirebaseData(): any {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate?.toISOString() || null,
      street: this.street || null,
      zipCode: this.zipCode || null,
      city: this.city || null
    };
  }

  // ✅ Für allgemeine Verwendung (mit ID falls vorhanden)
  toJSON(): any {
    const data = this.toFirebaseData();
    if (this.id) {
      data.id = this.id;
    }
    return data;
  }

  // ✅ Statische Methode für Firebase-Daten
  static fromFirebase(id: string, data: any): User {
    return new User({
      id: id,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      birthDate: data.birthDate ? data.birthDate : undefined, // Firebase gibt ISO-String zurück
      street: data.street || '',
      zipCode: data.zipCode || '',
      city: data.city || ''
    });
  }

  // ✅ Hilfsmethode um zu prüfen ob User gültig ist
  isValid(): boolean {
    return !!(this.firstName?.trim() && this.lastName?.trim());
  }

  // ✅ Hilfsmethode für User-Initialen
  getInitials(): string {
    const firstName = this.firstName?.trim() || '';
    const lastName = this.lastName?.trim() || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'UN';
  }
}