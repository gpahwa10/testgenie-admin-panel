import { db } from "../lib/firebase";
import { collection, getDocs, query, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
export const boardServices = {
  async fetchBoards() {
    try {
        const boardsRef = collection(db, "boards");
        let q;
        q = query(boardsRef);
        const snapshot = await getDocs(q);
        const boards = snapshot.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }))
        console.log(`Fetched ${boards.length} board(s) from Firebase`);
        console.log(boards);
        return {boards};
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw error;
    }
  },

  async addBoard(boardData){
    try {
      const boardRef = collection(db,"boards");
      await addDoc(boardRef,boardData);
      return {id:boardRef.id, ...boardData};
    } catch (error) {
      console.error("Error adding board:", error);
      throw error;
    }
  },

  async updateBoardStatus(boardId,newStatus){
    try {
      const boardRef = doc(db,"boards",boardId);
      await updateDoc(boardRef,{isActive:newStatus});
      return {id:boardId,isActive:newStatus};
    } catch (error) {
      console.error("Error updating board status:", error);
      throw error;
    }
  },

  async updateBoard(boardId, boardData){
    try {
      const boardRef = doc(db,"boards",boardId);
      const updateData = {
        ...boardData,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(boardRef, updateData);
      return {id: boardId, ...updateData};
    } catch (error) {
      console.error("Error updating board:", error);
      throw error;
    }
  },

  async deleteBoard(boardId){
    try {
      const boardRef = doc(db,"boards",boardId);
      await deleteDoc(boardRef);
      return {id: boardId};
    } catch (error) {
      console.error("Error deleting board:", error);
      throw error;
    }
  }
};
