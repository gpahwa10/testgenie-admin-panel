import { db } from '../lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import categoryData from '../assets/category.json';

/**
 * Upload complete category data from category.json to Firestore
 * This will process all boards, classes, subjects, and books
 */
export const uploadCompleteCategoryData = async () => {
  try {
    console.log('🚀 Starting complete category data upload...');
    console.log('📊 Processing all boards from category.json');
    
    const timestamp = new Date().toISOString();
    
    // Track all created documents
    const allResults = {
      boards: [],
      classes: [],
      subjects: [],
      books: [],
      summary: {
        totalBoards: 0,
        totalClasses: 0,
        totalSubjects: 0,
        totalBooks: 0
      }
    };
    
    // Process each board
    const boards = categoryData.Boards;
    
    for (const [boardName, boardData] of Object.entries(boards)) {
      console.log(`\n📚 Processing Board: ${boardName}`);
      
      // Generate board ID
      const boardId = boardName.toLowerCase().replace(/\s+/g, '_');
      
      // Create board document
      const boardRef = doc(db, 'boards', boardId);
      await setDoc(boardRef, {
        id: boardId,
        name: boardName,
        isActive: true,
        createdAt: timestamp
      });
      
      allResults.boards.push(boardId);
      allResults.summary.totalBoards++;
      console.log(`✅ Board created: ${boardId}`);
      
      // Process classes for this board
      if (boardData.Classes) {
        for (const [classNumber, classData] of Object.entries(boardData.Classes)) {
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
          
          allResults.classes.push(classId);
          allResults.summary.totalClasses++;
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
              
              allResults.subjects.push(subjectId);
              allResults.summary.totalSubjects++;
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
                  
                  allResults.books.push(bookId);
                  allResults.summary.totalBooks++;
                  console.log(`✅ Book created: ${bookId}`);
                }
              }
            }
          }
        }
      }
    }
    
    console.log('\n🎉 Complete category data upload finished!');
    console.log('📊 Final Summary:', allResults.summary);
    
    return allResults;
    
  } catch (error) {
    console.error('❌ Error uploading category data:', error);
    throw new Error(`Failed to upload category data: ${error.message}`);
  }
};

/**
 * Get statistics about the category data before uploading
 */
export const getCategoryDataStats = () => {
  const boards = categoryData.Boards;
  const stats = {
    totalBoards: Object.keys(boards).length,
    boards: {},
    totalClasses: 0,
    totalSubjects: 0,
    totalBooks: 0
  };
  
  for (const [boardName, boardData] of Object.entries(boards)) {
    const boardStats = {
      classes: 0,
      subjects: 0,
      books: 0
    };
    
    if (boardData.Classes) {
      boardStats.classes = Object.keys(boardData.Classes).length;
      stats.totalClasses += boardStats.classes;
      
      for (const [classNumber, classData] of Object.entries(boardData.Classes)) {
        if (classData.Subjects) {
          const subjectCount = Object.keys(classData.Subjects).length;
          boardStats.subjects += subjectCount;
          stats.totalSubjects += subjectCount;
          
          for (const [subjectName, subjectData] of Object.entries(classData.Subjects)) {
            if (subjectData.Books) {
              const bookCount = Object.keys(subjectData.Books).length;
              boardStats.books += bookCount;
              stats.totalBooks += bookCount;
            }
          }
        }
      }
    }
    
    stats.boards[boardName] = boardStats;
  }
  
  return stats;
};
