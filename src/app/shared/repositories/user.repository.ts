import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserRepository {
  private firestore = inject(Firestore);
  private readonly COLLECTION_NAME = 'users';

/**
 * Converts a `User` object into a plain object suitable for storing in Firebase.
 *
 * - Ensures string fields are not undefined by providing default empty strings or nulls.
 * - Converts the `birthDate` property to an ISO string if present, otherwise sets it to null.
 *
 * @param user - The `User` object to convert.
 * @returns An object containing the user's data formatted for Firebase storage.
 */
  private userToFirebaseData(user: User): any {
    return {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      birthDate: user.birthDate ? user.birthDate.toISOString() : null,
        email: user.email || '',
      street: user.street || null,
      zipCode: user.zipCode || null,
      city: user.city || null
    };
  }

/**
 * Converts raw Firebase data into a `User` instance.
 *
 * @param id - The unique identifier for the user.
 * @param data - The raw data object retrieved from Firebase, containing user properties.
 * @returns A new `User` object populated with the provided data.
 */
  private firebaseDataToUser(id: string, data: any): User {
    return new User({
      id: id,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      birthDate: data.birthDate ? data.birthDate : undefined,
        email: data.email || '',
      street: data.street || '',
      zipCode: data.zipCode || '',
      city: data.city || ''
    });
  }

/**
 * Retrieves all users from the Firestore collection as an observable stream.
 *
 * @returns {Observable<User[]>} An observable that emits an array of `User` objects.
 * If an error occurs during fetching, the observable emits an empty array.
 *
 * @remarks
 * - Uses Firestore's `collectionData` to listen for real-time updates.
 * - Maps raw Firebase data to `User` objects using `firebaseDataToUser`.
 * - Handles and logs errors both in the observable pipeline and in the synchronous block.
 */
  getAllUsers(): Observable<User[]> {
    try {
      const usersCollection = collection(this.firestore, this.COLLECTION_NAME);
      return collectionData(usersCollection, { idField: 'id' }).pipe(
        map((data: any[]) => {
          console.log('Raw Firebase data:', data);
          return data.map(item => this.firebaseDataToUser(item.id, item));
        }),
        catchError(error => {
          console.error('Error fetching users:', error);
          return of([]);
        })
      );
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return of([]);
    }
  }

/**
 * Adds a new user to the Firestore collection.
 *
 * @param user - The user object to be added.
 * @returns A promise that resolves to the ID of the newly created user document.
 * @throws Will throw an error if the user could not be added to Firestore.
 */
  async addUser(user: User): Promise<string> {
    try {
      const usersCollection = collection(this.firestore, this.COLLECTION_NAME);
      const userData = this.userToFirebaseData(user);
      
      console.log('Adding user data:', userData);
      const docRef = await addDoc(usersCollection, userData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

/**
 * Updates an existing user document in the Firestore database.
 *
 * @param id - The unique identifier of the user to update.
 * @param user - The updated user data as a `User` object.
 * @returns A promise that resolves when the update is complete.
 * @throws Will throw an error if the update operation fails.
 */
  async updateUser(id: string, user: User): Promise<void> {
    try {
      const userDoc = doc(this.firestore, this.COLLECTION_NAME, id);
      const userData = this.userToFirebaseData(user);
      
      console.log('Updating user with data:', userData);
      await updateDoc(userDoc, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

/**
 * Deletes a user document from the Firestore collection by its ID.
 *
 * @param id - The unique identifier of the user to be deleted.
 * @returns A promise that resolves when the user has been successfully deleted.
 * @throws Will throw an error if the deletion fails.
 */
  async deleteUser(id: string): Promise<void> {
    try {
      const userDoc = doc(this.firestore, this.COLLECTION_NAME, id);
      await deleteDoc(userDoc);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

/**
 * Retrieves a user by their unique identifier from the Firestore database.
 *
 * @param id - The unique identifier of the user to retrieve.
 * @returns An Observable that emits the User object if found.
 * @throws Will throw an error if the user is not found or if there is an error fetching the user.
 *
 * @example
 * this.userRepository.getUserById('userId123').subscribe(user => {
 *   console.log(user);
 * });
 */
  getUserById(id: string): Observable<User> {
    try {
      const userDoc = doc(this.firestore, this.COLLECTION_NAME, id);
      return docData(userDoc, { idField: 'id' }).pipe(
        map((data: any) => {
          if (!data) throw new Error('User not found');
          return this.firebaseDataToUser(id, data);
        }),
        catchError(error => {
          console.error('Error fetching user by ID:', error);
          throw error;
        })
      );
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  }
}