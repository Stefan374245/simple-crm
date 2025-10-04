import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore); // ✅ Bessere Injection

  constructor() {}

  getAllUsers(): Observable<User[]> {
    try {
      const usersCollection = collection(this.firestore, 'users');
      return collectionData(usersCollection, { idField: 'id' }).pipe(
        map((data: any[]) => {
          console.log('Raw Firebase data:', data);
          return data.map(item => User.fromFirebase(item.id, item));
        }),
        catchError(error => {
          console.error('Error fetching users:', error);
          return of([]); // Return empty array on error
        })
      );
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return of([]);
    }
  }

  async addUser(user: User): Promise<string> {
    try {
      const usersCollection = collection(this.firestore, 'users');
      
      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: user.birthdate?.toISOString() || null,
        street: user.street || null,
        zipCode: user.zipCode || null,
        city: user.city || null
      };
      
      console.log('Adding user data:', userData);
      const docRef = await addDoc(usersCollection, userData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  async updateUser(id: string, user: User): Promise<void> {
    try {
      const userDoc = doc(this.firestore, 'users', id);
      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: user.birthdate?.toISOString() || null,
        street: user.street || null,
        zipCode: user.zipCode || null,
        city: user.city || null
      };
      await updateDoc(userDoc, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const userDoc = doc(this.firestore, 'users', id);
      await deleteDoc(userDoc);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  getUserById(id: string): Observable<User> {
    try {
      const userDoc = doc(this.firestore, 'users', id);
      return docData(userDoc, { idField: 'id' }).pipe(
        map((data: any) => User.fromFirebase(data.id, data)),
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