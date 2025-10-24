// Script to upload CBSE board data to Firestore
import { uploadCompleteCBSEBoard } from './uploadCBSEBoard.js';

/**
 * Main function to run the CBSE board upload
 */
const runCBSEUpload = async () => {
  try {
    console.log('🚀 Starting CBSE Board Upload Process...');
    console.log('⏳ This may take a few moments...');
    
    const result = await uploadCompleteCBSEBoard();
    
    console.log('');
    console.log('✅ UPLOAD COMPLETED SUCCESSFULLY!');
    console.log('📊 Summary:');
    console.log(`   📚 Board: ${result.boardId}`);
    console.log(`   🏫 Classes: ${result.totalClasses}`);
    console.log(`   📖 Subjects: ${result.totalSubjects}`);
    console.log(`   📕 Books: ${result.totalBooks}`);
    console.log('');
    console.log('🎉 All CBSE board data has been stored in Firestore!');
    console.log('📁 Collections created: boards, classes, subjects, books');
    
    return result;
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    throw error;
  }
};

// Export for use in other files
export { runCBSEUpload };

// Auto-run if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - you can call runCBSEUpload() manually
  console.log('🌐 Browser environment detected');
  console.log('💡 To upload CBSE data, call: runCBSEUpload()');
} else {
  // Node.js environment - auto-run
  console.log('🖥️ Node.js environment detected');
  runCBSEUpload().catch(console.error);
}
