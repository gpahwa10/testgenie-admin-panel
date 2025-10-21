import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';

export const usersService = {
  // ✅ Fetch users with pagination using doc ID
  async fetchUsers(pageSize = 10, lastVisible = null) {
    try {
      const usersRef = collection(db, "users");
      let q;

      if (lastVisible) {
        q = query(
          usersRef,
          orderBy("uid"), // sort by document ID
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        q = query(
          usersRef,
          orderBy("uid"),
          limit(pageSize)
        );
      }

      const snapshot = await getDocs(q);

      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Store the last doc's ID to pass for next page
      const lastDoc = snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null;

      console.log(`Fetched ${users.length} users from Firebase`);

      return { users, lastVisible: lastDoc };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Add a new user
  async addUser(userData) {
    try {
      const usersRef = collection(db, "users");
      const docRef = await addDoc(usersRef, userData);
      
      // Update the document with the uid field (Firebase document ID)
      await updateDoc(docRef, { uid: docRef.id });
      
      return { id: docRef.id, uid: docRef.id, ...userData };
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  // Update a user
  async updateUser(userId, userData) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, userData);
      return { id: userId, ...userData };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete a user
  async deleteUser(userId) {
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }
};
