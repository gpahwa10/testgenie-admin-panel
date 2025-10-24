// Script to upload complete category data from category.json
import { uploadCompleteCategoryData, getCategoryDataStats } from './uploadCategoryData.js';

/**
 * Main function to run the complete category data upload
 */
const runCategoryUpload = async () => {
  try {
    console.log('🚀 Starting Complete Category Data Upload Process...');
    
    // First, show stats
    const stats = getCategoryDataStats();
    console.log('📊 Data Statistics:');
    console.log(`   📚 Boards: ${stats.totalBoards}`);
    console.log(`   🏫 Classes: ${stats.totalClasses}`);
    console.log(`   📖 Subjects: ${stats.totalSubjects}`);
    console.log(`   📕 Books: ${stats.totalBooks}`);
    console.log('');
    
    console.log('📋 Board Breakdown:');
    Object.entries(stats.boards).forEach(([boardName, boardStats]) => {
      console.log(`   ${boardName}: ${boardStats.classes} classes, ${boardStats.subjects} subjects, ${boardStats.books} books`);
    });
    console.log('');
    
    console.log('⏳ Starting upload... This may take several minutes...');
    
    const result = await uploadCompleteCategoryData();
    
    console.log('');
    console.log('✅ UPLOAD COMPLETED SUCCESSFULLY!');
    console.log('📊 Final Summary:');
    console.log(`   📚 Boards: ${result.summary.totalBoards}`);
    console.log(`   🏫 Classes: ${result.summary.totalClasses}`);
    console.log(`   📖 Subjects: ${result.summary.totalSubjects}`);
    console.log(`   📕 Books: ${result.summary.totalBooks}`);
    console.log('');
    console.log('🎉 All category data has been stored in Firestore!');
    console.log('📁 Collections created: boards, classes, subjects, books');
    console.log('');
    console.log('📋 Created Boards:', result.boards);
    
    return result;
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    throw error;
  }
};

// Export for use in other files
export { runCategoryUpload };

// Auto-run if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - you can call runCategoryUpload() manually
  console.log('🌐 Browser environment detected');
  console.log('💡 To upload complete category data, call: runCategoryUpload()');
} else {
  // Node.js environment - auto-run
  console.log('🖥️ Node.js environment detected');
  runCategoryUpload().catch(console.error);
}
