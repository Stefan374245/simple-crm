import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.class';
import { UserRepository } from '../repositories/user.repository';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Retrieves all users from the repository
   * @returns Observable of User array containing all users
   */
  getAllUsers(): Observable<User[]> {
    return this.userRepository.getAllUsers();
  }

  /**
   * Creates a new user in the repository
   * @param user - The user object to create
   * @returns Promise that resolves to the created user's ID
   * @throws Error if user data is invalid (missing firstName or lastName)
   */
  async createUser(user: User): Promise<string> {
    if (!user.isValid()) {
      throw new Error('User data is invalid: firstName and lastName are required');
    }
    
    return this.userRepository.addUser(user);
  }

  /**
   * Updates an existing user in the repository
   * @param id - The ID of the user to update
   * @param user - The updated user data
   * @returns Promise that resolves when update is complete
   * @throws Error if user ID is missing or user data is invalid
   */
  async updateUser(id: string, user: User): Promise<void> {
    if (!id) {
      throw new Error('User ID is required for update');
    }
    if (!user.isValid()) {
      throw new Error('User data is invalid: firstName and lastName are required');
    }
    
    return this.userRepository.updateUser(id, user);
  }

  /**
   * Deletes a user from the repository
   * @param id - The ID of the user to delete
   * @returns Promise that resolves when deletion is complete
   * @throws Error if user ID is missing
   */
  async deleteUser(id: string): Promise<void> {
    if (!id) {
      throw new Error('User ID is required for deletion');
    }
    
    return this.userRepository.deleteUser(id);
  }

  /**
   * Retrieves a specific user by their ID
   * @param id - The ID of the user to retrieve
   * @returns Observable of the User object
   * @throws Error if user ID is missing
   */
  getUserById(id: string): Observable<User> {
    if (!id) {
      throw new Error('User ID is required');
    }
    
    return this.userRepository.getUserById(id);
  }

  /**
   * Filters users by age range
   * @param minAge - Minimum age (inclusive)
   * @param maxAge - Maximum age (inclusive)
   * @returns Observable of User array containing users within the specified age range
   */
  getUsersByAge(minAge: number, maxAge: number): Observable<User[]> {
    return this.getAllUsers().pipe(
      map(users => users.filter(user => {
        const age = user.getAge();
        return age !== null && age >= minAge && age <= maxAge;
      }))
    );
  }

  /**
   * Gets users with birthdays coming up within a specified number of days
   * @param days - Number of days to look ahead for birthdays (default: 30)
   * @returns Observable of User array containing users with upcoming birthdays
   */
  getUsersWithUpcomingBirthdays(days: number = 30): Observable<User[]> {
    return this.getAllUsers().pipe(
      map(users => users.filter(user => {
        if (!user.birthDate) return false;
        
        const today = new Date();
        const birthday = new Date(user.birthDate);
        birthday.setFullYear(today.getFullYear());
        
        if (birthday < today) {
          birthday.setFullYear(today.getFullYear() + 1);
        }
        
        const diffTime = birthday.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays <= days;
      }))
    );
  }
}