import { db } from '../lib/firebase';
import { doc, collection, writeBatch, getDocs, query, where } from 'firebase/firestore';

/**
 * Enhanced board services for complete CRUD operations
 */
export const enhancedBoardServices = {
  /**
   * Add complete board structure (board, classes, subjects, books, topics)
   */
  addCompleteBoard: async (boardData) => {
    try {
      const { board, classes, isActive = true } = boardData;
      
      // Generate board ID
      const boardId = board.toLowerCase().replace(/\s+/g, '_');
      const timestamp = new Date().toISOString();
      
      // Create batch for atomic operations
      const batch = writeBatch(db);
      
      // Create board document
      const boardRef = doc(db, 'boards', boardId);
      batch.set(boardRef, {
        id: boardId,
        name: board,
        isActive,
        createdAt: timestamp
      });
      
      console.log(`✅ Board created: ${boardId}`);
      
      // Process classes, subjects, books, and topics
      for (const [classNumber, classData] of Object.entries(classes)) {
        // Generate class ID
        const classId = `${boardId}_class_${classNumber}`;
        
        // Create class document
        const classRef = doc(db, 'classes', classId);
        batch.set(classRef, {
          id: classId,
          name: `Class ${classNumber}`,
          boardId: boardId,
          createdAt: timestamp,
          isActive: true
        });
        
        console.log(`✅ Class created: ${classId}`);
        
        // Process subjects for this class
        if (classData.subjects) {
          for (const [subjectName, subjectData] of Object.entries(classData.subjects)) {
            // Generate subject ID
            const subjectId = `${boardId}_${classId}_${subjectName.toLowerCase().replace(/\s+/g, '_')}`;
            
            // Create subject document
            const subjectRef = doc(db, 'subjects', subjectId);
            batch.set(subjectRef, {
              id: subjectId,
              name: subjectName,
              classId: classId,
              boardId: boardId,
              createdAt: timestamp,
              isActive: true
            });
            
            console.log(`✅ Subject created: ${subjectId}`);
            
            // Process books for this subject
            if (subjectData.books) {
              for (const bookData of subjectData.books) {
                // Generate book ID
                const bookId = `${boardId}_${classId}_${subjectName.toLowerCase().replace(/\s+/g, '_')}_${bookData.book_id}`;
                
                // Create book document with topics array
                const bookRef = doc(db, 'books', bookId);
                batch.set(bookRef, {
                  id: bookId,
                  name: bookData.name,
                  bookId: bookData.book_id, // Use bookId field name as per your structure
                  subjectId: subjectId,
                  classId: classId,
                  boardId: boardId,
                  topics: bookData.topics || [],
                  createdAt: timestamp,
                  isActive: true
                });
                
                console.log(`✅ Book created: ${bookId} with ${bookData.topics?.length || 0} topics`);
              }
            }
          }
        }
      }
      
      // Commit all operations
      await batch.commit();
      
      const result = {
        success: true,
        boardId,
        message: 'Complete board structure added successfully!'
      };
      
      console.log('🎉 Complete board structure added successfully!', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error adding complete board:', error);
      throw new Error(`Failed to add board: ${error.message}`);
    }
  },

  /**
   * Update complete board structure
   */
  updateCompleteBoard: async (boardId, boardData) => {
    try {
      const { board, classes, isActive } = boardData;
      
      // First, delete existing structure
      await enhancedBoardServices.deleteCompleteBoard(boardId);
      
      // Then add the updated structure
      const updatedBoardData = {
        board: board || boardId.replace(/_/g, ' ').toUpperCase(),
        classes,
        isActive: isActive !== undefined ? isActive : true
      };
      
      return await enhancedBoardServices.addCompleteBoard(updatedBoardData);
      
    } catch (error) {
      console.error('❌ Error updating complete board:', error);
      throw new Error(`Failed to update board: ${error.message}`);
    }
  },

  /**
   * Delete complete board structure
   */
  deleteCompleteBoard: async (boardId) => {
    try {
      console.log(`🗑️ Deleting complete board structure: ${boardId}`);
      
      // Get all related documents
      const [classesSnapshot, subjectsSnapshot, booksSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'classes'), where('boardId', '==', boardId))),
        getDocs(query(collection(db, 'subjects'), where('boardId', '==', boardId))),
        getDocs(query(collection(db, 'books'), where('boardId', '==', boardId)))
      ]);
      
      // Create batch for deletion
      const batch = writeBatch(db);
      
      // Delete board
      const boardRef = doc(db, 'boards', boardId);
      batch.delete(boardRef);
      
      // Delete classes
      classesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      // Delete subjects
      subjectsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      // Delete books
      booksSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      // Commit deletion
      await batch.commit();
      
      const result = {
        success: true,
        boardId,
        deletedClasses: classesSnapshot.size,
        deletedSubjects: subjectsSnapshot.size,
        deletedBooks: booksSnapshot.size,
        message: 'Complete board structure deleted successfully!'
      };
      
      console.log('🎉 Complete board structure deleted successfully!', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error deleting complete board:', error);
      throw new Error(`Failed to delete board: ${error.message}`);
    }
  },

  /**
   * Get complete board structure
   */
  getCompleteBoard: async (boardId) => {
    try {
      console.log(`📖 Fetching complete board structure: ${boardId}`);
      
      // Get board document
      const boardDoc = await getDocs(query(collection(db, 'boards'), where('id', '==', boardId)));
      
      if (boardDoc.empty) {
        throw new Error('Board not found');
      }
      
      const boardData = boardDoc.docs[0].data();
      
      // Get all related documents
      const [classesSnapshot, subjectsSnapshot, booksSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'classes'), where('boardId', '==', boardId))),
        getDocs(query(collection(db, 'subjects'), where('boardId', '==', boardId))),
        getDocs(query(collection(db, 'books'), where('boardId', '==', boardId)))
      ]);
      
      
      // Organize data into hierarchical structure
      const classes = {};
      
      // Process classes
      classesSnapshot.forEach(doc => {
        const classData = doc.data();
        const classNumber = classData.name.split(' ')[1]; // Extract number from "Class 1"
        classes[classNumber] = {
          id: classData.id,
          name: classData.name,
          subjects: {}
        };
      });
      
      // Process subjects
      subjectsSnapshot.forEach(doc => {
        const subjectData = doc.data();
        const classNumber = subjectData.classId.split('_').pop().replace('class_', '');
        const subjectName = subjectData.name;
        
        console.log(`Processing subject: ${subjectName} for class ${classNumber}`);
        console.log(`  subjectId: ${subjectData.id}`);
        console.log(`  classId: ${subjectData.classId}`);
        
        if (!classes[classNumber]) {
          classes[classNumber] = { subjects: {} };
        }
        
        classes[classNumber].subjects[subjectName] = {
          id: subjectData.id,
          name: subjectData.name,
          books: []
        };
      });
      
      // Process books
      booksSnapshot.forEach(doc => {
        const bookData = doc.data();
        const classNumber = bookData.classId.split('_').pop().replace('class_', '');
        
        // Extract subject name from subjectId
        // subjectId format: boardId_boardId_class_classNumber_subjectName
        // Examples: "bieap_bieap_class_1_maths", "bieap_bieap_class_2_english_grammar"
        const subjectIdParts = bookData.subjectId.split('_');
        
        // Find the pattern: boardId_boardId_class_classNumber_subjectName
        // We need to skip: boardId, boardId, class, classNumber
        // Then take the remaining parts as subject name (in case subject has underscores)
        let subjectName = '';
        if (subjectIdParts.length >= 5) {
          // Skip first 4 parts: boardId_boardId_class_classNumber
          // Take the remaining parts as subject name (handles subjects with underscores)
          subjectName = subjectIdParts.slice(4).join('_');
        } else if (subjectIdParts.length === 4) {
          // Handle case where subjectId is exactly 4 parts: boardId_boardId_class_classNumber
          // This shouldn't happen, but just in case
          subjectName = subjectIdParts[3];
        } else {
          // Fallback: try to extract from the end
          subjectName = subjectIdParts[subjectIdParts.length - 1];
        }
        
        
        if (classes[classNumber]?.subjects[subjectName]) {
          classes[classNumber].subjects[subjectName].books.push({
            id: doc.id, // Use Firestore document ID
            name: bookData.name,
            bookId: bookData.bookId, // Use bookId field as per your structure
            topics: bookData.topics || []
          });
        } else {
          // Try to find a matching subject by checking if any subject name contains the extracted name
          const availableSubjects = Object.keys(classes[classNumber]?.subjects || {});
          const matchingSubject = availableSubjects.find(subject => 
            subject.toLowerCase().includes(subjectName.toLowerCase()) || 
            subjectName.toLowerCase().includes(subject.toLowerCase())
          );
          
          if (matchingSubject) {
            classes[classNumber].subjects[matchingSubject].books.push({
              id: doc.id,
              name: bookData.name,
              bookId: bookData.bookId,
              topics: bookData.topics || []
            });
          } else {
            // Create the missing subject automatically
            if (!classes[classNumber]) {
              classes[classNumber] = { subjects: {} };
            }
            classes[classNumber].subjects[subjectName] = {
              id: `${boardId}_${boardId}_class_${classNumber}_${subjectName.toLowerCase().replace(/\s+/g, '_')}`,
              name: subjectName,
              books: []
            };
            
            // Add the book to the newly created subject
            classes[classNumber].subjects[subjectName].books.push({
              id: doc.id,
              name: bookData.name,
              bookId: bookData.bookId,
              topics: bookData.topics || []
            });
          }
        }
      });
      
      const result = {
        ...boardData,
        classes
      };
      
      return result;
      
    } catch (error) {
      console.error('❌ Error fetching complete board:', error);
      throw new Error(`Failed to fetch board: ${error.message}`);
    }
  },

  /**
   * Get all boards with basic info
   */
  getAllBoards: async () => {
    try {
      const boardsSnapshot = await getDocs(collection(db, 'boards'));
      const boards = [];
      
      boardsSnapshot.forEach(doc => {
        boards.push(doc.data());
      });
      
      return boards;
    } catch (error) {
      console.error('❌ Error fetching boards:', error);
      throw new Error(`Failed to fetch boards: ${error.message}`);
    }
  }


};
