/**
 * Represents a user in the CRM system with personal and contact information
 */
export class User {
  id?: string;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  email?: string;
  street?: string;
  zipCode?: string;
  city?: string;

  /**
   * Creates a new User instance
   * @param obj - Optional object containing user data to initialize the instance
   */
  constructor(obj?: any) {
    this.id = obj?.id || undefined;
    this.firstName = this.ensureString(obj?.firstName);
    this.lastName = this.ensureString(obj?.lastName);
    this.birthDate = obj?.birthDate ? new Date(obj.birthDate) : undefined;
    this.email = this.ensureString(obj?.email);
    this.street = this.ensureString(obj?.street);
    this.zipCode = this.ensureString(obj?.zipCode);
    this.city = this.ensureString(obj?.city);
  }

  /**
   * Ensures a value is converted to a string, handling null/undefined cases
   * @param value - The value to convert to string
   * @returns Empty string if value is null/undefined, otherwise the string representation
   * @private
   */
  private ensureString(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value);
  }

  /**
   * Gets the user's full name by combining first and last name
   * @returns The full name as a trimmed string
   */
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /**
   * Calculates the user's current age based on their birth date
   * @returns The age in years, or null if no birth date is set
   */
  getAge(): number | null {
    if (!this.birthDate) return null;
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  /**
   * Constructs the full address from street, ZIP code, and city
   * @returns Formatted address string with non-empty parts joined by commas
   */
  getFullAddress(): string {
    const parts = [
      this.street,
      `${this.zipCode || ''} ${this.city || ''}`.trim(),
    ];
    return parts.filter((part) => part && part.trim()).join(', ');
  }

  /**
   * Validates if the user has the minimum required data
   * @returns True if both firstName and lastName are provided and not empty
   */
  isValid(): boolean {
    return !!(this.firstName?.trim() && this.lastName?.trim());
  }

  /**
   * Validates if the email format is correct (if provided)
   * @returns True if email is either empty or has valid format
   */
  isEmailValid(): boolean {
    if (!this.email || this.email.trim() === '') return true; // E-Mail ist optional

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email.trim());
  }

  /**
   * Comprehensive validation including email format
   * @returns True if user data is valid including email format
   */
  isFullyValid(): boolean {
    return this.isValid() && this.isEmailValid();
  }

  /**
   * Gets the user's initials from first and last name
   * @returns Two-character initials in uppercase, or 'UN' if names are not available
   */
  getInitials(): string {
    const firstName = this.firstName?.trim() || '';
    const lastName = this.lastName?.trim() || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'UN';
  }

  /**
   * Converts the user instance to a plain JSON object
   * @returns Plain object representation of the user data
   */
  toJSON(): any {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate,
      email: this.email,
      street: this.street,
      zipCode: this.zipCode,
      city: this.city,
    };
  }
}
