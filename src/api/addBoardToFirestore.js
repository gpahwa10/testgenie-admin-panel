import { db } from '../lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';

/**
 * Adds a board with its classes and subjects to Firestore using a flat structure
 * @param {Object} data - The form data from AddBoardsModal
 * @param {string} data.board - Board name
 * @param {Object} data.classes - Classes object with subjects
 * @param {boolean} data.isActive - Board active status
 * @returns {Promise<Object>} - Result object with success status and created IDs
 */
export const addBoardToFirestore = async (data) => {
  try {
    const { board, classes, isActive = true } = data;
    
    // Generate board ID (lowercase, replace spaces with underscores)
    const boardId = board.toLowerCase().replace(/\s+/g, '_');
    const timestamp = new Date().toISOString();
    
    // Create board document
    const boardRef = doc(db, 'boards', boardId);
    await setDoc(boardRef, {
      id: boardId,
      name: board,
      isActive,
      createdAt: timestamp
    });
    
    console.log(`✅ Board created: ${boardId}`);
    
    // Create classes and subjects
    const createdClasses = [];
    const createdSubjects = [];
    
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
      
      // Create subjects for this class
      if (classData.subject && Array.isArray(classData.subject)) {
        for (const subjectName of classData.subject) {
          if (subjectName.trim()) {
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
          }
        }
      }
    }
    
    const result = {
      success: true,
      boardId,
      classIds: createdClasses,
      subjectIds: createdSubjects,
      totalClasses: createdClasses.length,
      totalSubjects: createdSubjects.length
    };
    
    console.log('🎉 Board and classes added successfully!', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error adding board to Firestore:', error);
    throw new Error(`Failed to add board: ${error.message}`);
  }
};
