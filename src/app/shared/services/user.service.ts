import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  // ✅ Korrigiert: Richtige Transformation zu User-Objekten
  getAllUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'id' }).pipe(
      map((data: any[]) => data.map(item => User.fromFirebase(item.id, item)))
    );
  }

  // ✅ Korrigiert: Ohne ID senden
  async addUser(user: User): Promise<string> {
    const usersCollection = collection(this.firestore, 'users');
    
    // Nur die Daten ohne ID senden
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      birthdate: user.birthdate?.toISOString() || null,
      street: user.street || null,
      zipCode: user.zipCode || null,
      city: user.city || null
    };
    
    const docRef = await addDoc(usersCollection, userData);
    return docRef.id;
  }

  async updateUser(id: string, user: User): Promise<void> {
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
  }

  async deleteUser(id: string): Promise<void> {
    const userDoc = doc(this.firestore, 'users', id);
    await deleteDoc(userDoc);
  }

  getUserById(id: string): Observable<User> {
    const userDoc = doc(this.firestore, 'users', id);
    return docData(userDoc, { idField: 'id' }).pipe(
      map((data: any) => User.fromFirebase(data.id, data))
    );
  }
}