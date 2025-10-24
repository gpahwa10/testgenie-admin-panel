// Script to upload topics to existing books collection
import { uploadTopicsToBooks, getTopicsStats, previewTopicsMapping } from './uploadTopicsToBooks.js';

/**
 * Main function to run the topics upload
 */
const runTopicsUpload = async () => {
  try {
    console.log('🚀 Starting Topics Upload Process...');
    
    // First, show stats
    const stats = getTopicsStats();
    console.log('📊 Topics Data Statistics:');
    console.log(`   📚 Boards: ${stats.totalBoards}`);
    console.log(`   🏫 Classes: ${stats.totalClasses}`);
    console.log(`   📖 Subjects: ${stats.totalSubjects}`);
    console.log(`   📕 Topics: ${stats.totalTopics}`);
    console.log('');
    
    console.log('📋 Board Breakdown:');
    Object.entries(stats.boards).forEach(([boardName, boardStats]) => {
      console.log(`   ${boardName}: ${boardStats.classes} classes, ${boardStats.subjects} subjects, ${boardStats.topics} topics`);
    });
    console.log('');
    
    // Show preview of mapping
    console.log('🔍 Topics Mapping Preview:');
    const preview = previewTopicsMapping();
    console.log(`   📋 Total mappings: ${Object.keys(preview).length}`);
    console.log('');
    
    console.log('⏳ Starting upload... This will match topics with existing books...');
    
    const result = await uploadTopicsToBooks();
    
    console.log('');
    console.log('✅ UPLOAD COMPLETED SUCCESSFULLY!');
    console.log('📊 Final Summary:');
    console.log(`   📚 Total existing books: ${result.totalBooks}`);
    console.log(`   ✅ Matched books: ${result.matchedBooks}`);
    console.log(`   📖 Total topics uploaded: ${result.totalTopics}`);
    console.log(`   📦 Batches processed: ${result.batches}`);
    console.log('');
    console.log('🎉 All topics have been added to existing books!');
    console.log('📁 Books collection now contains topics arrays');
    console.log('');
    console.log('💡 Next steps:');
    console.log('   - Update UI to display topics from books');
    console.log('   - Add topic management features');
    console.log('   - Implement topic-based filtering');
    
    return result;
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    throw error;
  }
};

// Export for use in other files
export { runTopicsUpload };

// Auto-run if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - you can call runTopicsUpload() manually
  console.log('🌐 Browser environment detected');
  console.log('💡 To upload topics to books, call: runTopicsUpload()');
} else {
  // Node.js environment - auto-run
  console.log('🖥️ Node.js environment detected');
  runTopicsUpload().catch(console.error);
}
