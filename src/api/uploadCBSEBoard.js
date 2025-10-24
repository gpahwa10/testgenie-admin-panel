import { db } from '../lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';

// Your complete JSON data
const completeJsonData = {
  "CBSE": {
    "Classes": {
      "1": {
        "Subjects": {
          "English": {
            "Books": {
              "Book1": {
                "Name": "Mridang (NCERT)",
                "book_id": "C1ENG0MRIDANG0NCERT"
              }
            }
          },
          "Maths": {
            "Books": {
              "Book1": {
                "Name": "Joyful Mathematics (NCERT)",
                "book_id": "C1MAT0JOYFUL0NCERT"
              }
            }
          },
          "Hindi": {
            "Books": {
              "Book1": {
                "Name": "Sarangi (NCERT)",
                "book_id": "C1HIN0SARANGI0NCERT"
              }
            }
          }
        }
      },
      "2": {
        "Subjects": {
          "English": {
            "Books": {
              "Book1": {
                "Name": "Mridang (NCERT)",
                "book_id": "C2ENG0MRIDANG0NCERT"
              }
            }
          },
          "Hindi Grammar": {
            "Books": {
              "Book1": {
                "Name": "Basic Hindi Grammar",
                "book_id": "C2HING0SD0IB"
              }
            }
          },
          "English Grammar": {
            "Books": {
              "Book1": {
                "Name": "Enhanced Collins English Grammar And Composition 2",
                "book_id": "C2ENG0ENGG0ICSE"
              }
            }
          },
          "Maths": {
            "Books": {
              "Book1": {
                "Name": "Joyful Mathematics (NCERT)",
                "book_id": "C2MAT0JOYFUL0NCERT"
              }
            }
          },
          "Hindi": {
            "Books": {
              "Book1": {
                "Name": "Sarangi (NCERT)",
                "book_id": "C2HIN0SARANGI0NCERT"
              }
            }
          }
        }
      },
      "3": {
        "Subjects": {
          "English": {
            "Books": {
              "Book1": {
                "Name": "Santoor (NCERT)",
                "book_id": "C3ENG0SANTOOR0NCERT"
              }
            }
          },
          "Maths": {
            "Books": {
              "Book1": {
                "Name": "Joyful Mathematics (NCERT)",
                "book_id": "C3MAT0JOYFUL0NCERT"
              }
            }
          },
          "English Grammar": {
            "Books": {
              "Book1": {
                "Name": "Basic English Grammar",
                "book_id": "C3ENG0BEG0IB"
              }
            }
          },
          "Hindi Grammar": {
            "Books": {
              "Book1": {
                "Name": "Basic Hindi Grammar",
                "book_id": "C3HING0SD0IB"
              }
            }
          },
          "Hindi": {
            "Books": {
              "Book1": {
                "Name": "Veena (NCERT)",
                "book_id": "C3HIN0VEENA0NCERT"
              }
            }
          }
        }
      },
      "4": {
        "Subjects": {
          "English": {
            "Books": {
              "Book1": {
                "Name": "Marigold (NCERT)",
                "book_id": "C4ENG0MARIGOLD0NCERT"
              }
            }
          },
          "Maths": {
            "Books": {
              "Book1": {
                "Name": "Math-Magic (NCERT)",
                "book_id": "C4MAT0MAGIC0NCERT"
              }
            }
          },
          "Hindi": {
            "Books": {
              "Book1": {
                "Name": "Rimjhim (NCERT)",
                "book_id": "C4HIN0RIMJHIM0NCERT"
              }
            }
          },
          "English Grammar": {
            "Books": {
              "Book1": {
                "Name": "Basic English Grammar",
                "book_id": "C4EGG0SD0IB"
              }
            }
          },
          "Hindi Grammar": {
            "Books": {
              "Book1": {
                "Name": "Basic Hindi Grammar",
                "book_id": "C4HING0SD0IB"
              }
            }
          },
          "Environmental Science": {
            "Books": {
              "Book1": {
                "Name": "Look Around (NCERT)",
                "book_id": "C4EVS0AROUND0NCERT"
              }
            }
          }
        }
      },
      "5": {
        "Subjects": {
          "English": {
            "Books": {
              "Book1": {
                "Name": "Marigold (NCERT)",
                "book_id": "C5ENG0MARIGOLD0NCERT"
              }
            }
          },
          "Maths": {
            "Books": {
              "Book1": {
                "Name": "Math-Magic (NCERT)",
                "book_id": "C5MAT0MAGIC0NCERT"
              }
            }
          },
          "Hindi": {
            "Books": {
              "Book1": {
                "Name": "Rimjhim (NCERT)",
                "book_id": "C5HIN0RIMJHIM0NCERT"
              }
            }
          },
          "Hindi Grammar": {
            "Books": {
              "Book1": {
                "Name": "Basic Hindi Grammar",
                "book_id": "C5HING0SD0IB"
              }
            }
          },
          "English Grammar": {
            "Books": {
              "Book1": {
                "Name": "Basic English Grammar",
                "book_id": "C5ENG0ENGG0ICSE"
              }
            }
          },
          "Environmental Science": {
            "Books": {
              "Book1": {
                "Name": "Look Around (NCERT)",
                "book_id": "C5HIN0AROUND0NCERT"
              }
            }
          }
        }
      },
      "6": {
        "Subjects": {
          "English": {
            "Books": {
              "Book1": {
                "Name": "Marigold (NCERT)",
                "book_id": "C6ENG0MARIGOLD0NCERT"
              }
            }
          },
          "English Grammar": {
            "Books": {
              "Book1": {
                "Name": "Enhanced Collins English Grammar And Composition 2",
                "book_id": "C6ENGGIB"
              }
            }
          },
          "Hindi Grammar": {
            "Books": {
              "Book1": {
                "Name": "Basic Hindi Grammar",
                "book_id": "C5HING0SD0IB"
              }
            }
          },
          "Maths": {
            "Books": {
              "Book1": {
                "Name": "Math-Magic (NCERT)",
                "book_id": "C6MAT0MAGIC0NCERT"
              }
            }
          },
          "Hindi": {
            "Books": {
              "Book1": {
                "Name": "Rimjhim (NCERT)",
                "book_id": "C6HIN0RIMJHIM0NCERT"
              }
            }
          },
          "Science": {
            "Books": {
              "Book1": {
                "Name": "Look Around (NCERT)",
                "book_id": "C6SC0AROUND0NCERT"
              }
            }
          },
          "History": {
            "Books": {
              "Book1": {
                "Name": "Look Around (NCERT)",
                "book_id": "C6HIS0AROUND0NCERT"
              }
            }
          },
          "Civics": {
            "Books": {
              "Book1": {
                "Name": "Look Around (NCERT)",
                "book_id": "C6CIVICS0AROUND0NCERT"
              }
            }
          },
          "Geography": {
            "Books": {
              "Book1": {
                "Name": "Look Around (NCERT)",
                "book_id": "C5GEO0AROUND0NCERT"
              }
            }
          }
        }
      }
    }
  }
};

/**
 * Upload complete CBSE board data to Firestore
 */
export const uploadCompleteCBSEBoard = async () => {
  try {
    console.log('🚀 Starting CBSE board upload...');
    
    const boardName = "CBSE";
    const boardId = boardName.toLowerCase();
    const timestamp = new Date().toISOString();
    
    // Track created documents
    const createdClasses = [];
    const createdSubjects = [];
    const createdBooks = [];
    
    // Create board document
    const boardRef = doc(db, 'boards', boardId);
    await setDoc(boardRef, {
      id: boardId,
      name: boardName,
      isActive: true,
      createdAt: timestamp
    });
    
    console.log(`✅ Board created: ${boardId}`);
    
    // Process each class
    const classes = completeJsonData.CBSE.Classes;
    
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
    
    console.log('🎉 CBSE board upload completed successfully!');
    console.log('📊 Final Summary:', result);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error uploading CBSE board:', error);
    throw new Error(`Failed to upload CBSE board: ${error.message}`);
  }
};

// Auto-run the upload when this file is imported
console.log('📋 CBSE Board Data Ready for Upload');
console.log('📊 Expected Results:');
console.log('   - 1 Board: CBSE');
console.log('   - 6 Classes: Class 1-6');
console.log('   - ~35 Subjects: English, Maths, Hindi, Science, etc.');
console.log('   - ~35 Books: One book per subject');
console.log('');
console.log('🚀 To upload, call: uploadCompleteCBSEBoard()');
