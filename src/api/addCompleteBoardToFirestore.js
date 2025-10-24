import { db } from '../lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';

/**
 * Enhanced function to add a board with classes, subjects, and books to Firestore using a flat structure
 * @param {Object} data - The complete board data structure
 * @param {string} data.boardName - Board name (e.g., "CBSE")
 * @param {Object} data.classes - Classes object with subjects and books
 * @param {boolean} data.isActive - Board active status
 * @returns {Promise<Object>} - Result object with success status and created IDs
 */
export const addCompleteBoardToFirestore = async (data) => {
  try {
    const { boardName, classes, isActive = true } = data;
    
    // Generate board ID (lowercase, replace spaces with underscores)
    const boardId = boardName.toLowerCase().replace(/\s+/g, '_');
    const timestamp = new Date().toISOString();
    
    // Create board document
    const boardRef = doc(db, 'boards', boardId);
    await setDoc(boardRef, {
      id: boardId,
      name: boardName,
      isActive,
      createdAt: timestamp
    });
    
    console.log(`✅ Board created: ${boardId}`);
    
    // Track created documents
    const createdClasses = [];
    const createdSubjects = [];
    const createdBooks = [];
    
    // Process each class
    for (const [classNumber, classData] of Object.entries(classes)) {
      // Generate class ID
      const classId = `${boardId}_class_${classNumber}`;
      
      // Create class document
      const classRef = doc(db, 'classes', classId);
      await setDoc(classRef, {
        id: classId,
        name: `Class ${classNumber}`,
        boardId: boardId,
        createdAt: timestamp,
        isActive: true
      });
      
      createdClasses.push(classId);
      console.log(`✅ Class created: ${classId}`);
      
      // Process subjects for this class
      if (classData.Subjects) {
        for (const [subjectName, subjectData] of Object.entries(classData.Subjects)) {
          // Generate subject ID
          const subjectId = `${boardId}_${classId}_${subjectName.toLowerCase().replace(/\s+/g, '_')}`;
          
          // Create subject document
          const subjectRef = doc(db, 'subjects', subjectId);
          await setDoc(subjectRef, {
            id: subjectId,
            name: subjectName,
            classId: classId,
            boardId: boardId,
            createdAt: timestamp,
            isActive: true
          });
          
          createdSubjects.push(subjectId);
          console.log(`✅ Subject created: ${subjectId}`);
          
          // Process books for this subject
          if (subjectData.Books) {
            for (const [bookKey, bookData] of Object.entries(subjectData.Books)) {
              // Generate book ID
              const bookId = `${boardId}_${classId}_${subjectName.toLowerCase().replace(/\s+/g, '_')}_${bookData.book_id}`;
              
              // Create book document
              const bookRef = doc(db, 'books', bookId);
              await setDoc(bookRef, {
                id: bookId,
                name: bookData.Name,
                book_id: bookData.book_id,
                subjectId: subjectId,
                classId: classId,
                boardId: boardId,
                createdAt: timestamp,
                isActive: true
              });
              
              createdBooks.push(bookId);
              console.log(`✅ Book created: ${bookId}`);
            }
          }
        }
      }
    }
    
    const result = {
      success: true,
      boardId,
      classIds: createdClasses,
      subjectIds: createdSubjects,
      bookIds: createdBooks,
      totalClasses: createdClasses.length,
      totalSubjects: createdSubjects.length,
      totalBooks: createdBooks.length
    };
    
    console.log('🎉 Complete board structure added successfully!', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error adding complete board to Firestore:', error);
    throw new Error(`Failed to add board: ${error.message}`);
  }
};

/**
 * Transform the provided JSON structure into the format expected by addCompleteBoardToFirestore
 * @param {Object} jsonData - The raw JSON data
 * @returns {Object} - Transformed data structure
 */
export const transformJsonToBoardData = (jsonData) => {
  const boardName = Object.keys(jsonData)[0]; // e.g., "CBSE"
  const boardData = jsonData[boardName];
  
  return {
    boardName: boardName,
    classes: boardData.Classes,
    isActive: true
  };
};
