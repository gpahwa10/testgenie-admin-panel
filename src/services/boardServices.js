import { db } from "../lib/firebase";
import { collection, getDocs, query, doc, updateDoc, addDoc, deleteDoc, orderBy, limit, startAfter, getCountFromServer } from "firebase/firestore";
export const boardServices = {
  async fetchBoards(pageSize = 10, lastVisible = null) {
    try {
        const boardsRef = collection(db, "boards");
        let q;
        
        if (lastVisible) {
          q = query(
            boardsRef,
            orderBy("board"), // sort by board name
            startAfter(lastVisible),
            limit(pageSize)
          );
        } else {
          q = query(
            boardsRef,
            orderBy("board"),
            limit(pageSize)
          );
        }
        
        const snapshot = await getDocs(q);
        const boards = snapshot.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }));
        
        // Store the last doc for pagination
        const lastDoc = snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1]
          : null;
        
        console.log(`Fetched ${boards.length} board(s) from Firebase`);
        return {boards, lastVisible: lastDoc};
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw error;
    }
  },

  async getBoardsCount() {
    try {
      const boardsRef = collection(db, "boards");
      const snapshot = await getCountFromServer(boardsRef);
      return snapshot.data().count;
    } catch (error) {
      console.error("Error getting boards count:", error);
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
