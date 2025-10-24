import { db } from '../lib/firebase';
import { doc, getDocs, collection, writeBatch, query, where } from 'firebase/firestore';
import categoryData from '../assets/category.json';
import topicsData from '../assets/topics.json';

/**
 * Upload topics to existing books collection by matching category and topics data
 */
export const uploadTopicsToBooks = async () => {
  try {
    console.log('🚀 Starting topics upload to books collection...');
    
    // First, get all existing books from Firestore
    console.log('📚 Fetching existing books from Firestore...');
    const booksRef = collection(db, 'books');
    const booksSnapshot = await getDocs(booksRef);
    
    const existingBooks = {};
    booksSnapshot.forEach(doc => {
      existingBooks[doc.id] = doc.data();
    });
    
    console.log(`✅ Found ${Object.keys(existingBooks).length} existing books`);
    
    // Create mapping from topics.json
    const topicsMapping = createTopicsMapping(topicsData);
    console.log('📋 Created topics mapping from topics.json');
    
    // Create book updates
    const bookUpdates = [];
    let matchedBooks = 0;
    let totalTopics = 0;
    
    for (const bookId in existingBooks) {
      const book = existingBooks[bookId];
      const { boardId, classId, subjectId } = book;
      
      // Extract class number from classId (e.g., "cbse_class_1" -> "1")
      const classNumber = classId.split('_').pop();
      
      // Extract subject name from subjectId (e.g., "cbse_cbse_class_1_english" -> "english")
      const subjectName = subjectId.split('_').pop();
      
      // Create key for topics mapping
      const topicsKey = `${boardId}_${classNumber}_${subjectName}`;
      
      if (topicsMapping[topicsKey]) {
        bookUpdates.push({
          bookId,
          topics: topicsMapping[topicsKey],
          boardId,
          classId,
          subjectId
        });
        matchedBooks++;
        totalTopics += topicsMapping[topicsKey].length;
        console.log(`✅ Matched book: ${bookId} with ${topicsMapping[topicsKey].length} topics`);
      } else {
        console.log(`⚠️ No topics found for: ${bookId} (${topicsKey})`);
      }
    }
    
    console.log(`\n📊 Matching Summary:`);
    console.log(`   📚 Total existing books: ${Object.keys(existingBooks).length}`);
    console.log(`   ✅ Matched books: ${matchedBooks}`);
    console.log(`   📖 Total topics to upload: ${totalTopics}`);
    
    // Update books in batches
    console.log('\n🔄 Updating books with topics...');
    const batchSize = 500; // Firestore batch limit
    const batches = Math.ceil(bookUpdates.length / batchSize);
    
    for (let i = 0; i < batches; i++) {
      const batch = writeBatch(db);
      const startIndex = i * batchSize;
      const endIndex = Math.min(startIndex + batchSize, bookUpdates.length);
      const batchUpdates = bookUpdates.slice(startIndex, endIndex);
      
      console.log(`📦 Processing batch ${i + 1}/${batches} (${batchUpdates.length} books)`);
      
      for (const { bookId, topics } of batchUpdates) {
        const bookRef = doc(db, 'books', bookId);
        batch.update(bookRef, { 
          topics,
          topicsUpdatedAt: new Date().toISOString()
        });
      }
      
      await batch.commit();
      console.log(`✅ Batch ${i + 1} completed`);
    }
    
    const result = {
      success: true,
      totalBooks: Object.keys(existingBooks).length,
      matchedBooks,
      totalTopics,
      batches
    };
    
    console.log('\n🎉 Topics upload completed successfully!');
    console.log('📊 Final Summary:', result);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error uploading topics to books:', error);
    throw new Error(`Failed to upload topics: ${error.message}`);
  }
};

/**
 * Create topics mapping from topics.json
 */
const createTopicsMapping = (topicsData) => {
  const mapping = {};
  
  for (const [boardName, boardData] of Object.entries(topicsData)) {
    const boardId = boardName.toLowerCase();
    
    for (const [classNumber, classData] of Object.entries(boardData)) {
      for (const [subjectName, subjectData] of Object.entries(classData)) {
        const normalizedSubjectName = subjectName.toLowerCase().replace(/\s+/g, '_');
        const key = `${boardId}_${classNumber}_${normalizedSubjectName}`;
        
        // Transform topics to array format
        const topics = Object.entries(subjectData).map(([topicNumber, topicName]) => ({
          topicNumber: parseInt(topicNumber),
          name: topicName
        }));
        
        mapping[key] = topics;
      }
    }
  }
  
  return mapping;
};

/**
 * Get statistics about topics data
 */
export const getTopicsStats = () => {
  const stats = {
    totalBoards: Object.keys(topicsData).length,
    boards: {},
    totalClasses: 0,
    totalSubjects: 0,
    totalTopics: 0
  };
  
  for (const [boardName, boardData] of Object.entries(topicsData)) {
    const boardStats = {
      classes: 0,
      subjects: 0,
      topics: 0
    };
    
    for (const [classNumber, classData] of Object.entries(boardData)) {
      boardStats.classes++;
      stats.totalClasses++;
      
      for (const [subjectName, subjectData] of Object.entries(classData)) {
        boardStats.subjects++;
        stats.totalSubjects++;
        
        const topicCount = Object.keys(subjectData).length;
        boardStats.topics += topicCount;
        stats.totalTopics += topicCount;
      }
    }
    
    stats.boards[boardName] = boardStats;
  }
  
  return stats;
};

/**
 * Preview what topics will be added to books
 */
export const previewTopicsMapping = () => {
  const topicsMapping = createTopicsMapping(topicsData);
  
  console.log('📋 Topics Mapping Preview:');
  console.log('='.repeat(50));
  
  Object.entries(topicsMapping).slice(0, 10).forEach(([key, topics]) => {
    console.log(`\n🔑 Key: ${key}`);
    console.log(`📖 Topics (${topics.length}):`);
    topics.slice(0, 3).forEach(topic => {
      console.log(`   ${topic.topicNumber}. ${topic.name}`);
    });
    if (topics.length > 3) {
      console.log(`   ... and ${topics.length - 3} more topics`);
    }
  });
  
  if (Object.keys(topicsMapping).length > 10) {
    console.log(`\n... and ${Object.keys(topicsMapping).length - 10} more mappings`);
  }
  
  return topicsMapping;
};
