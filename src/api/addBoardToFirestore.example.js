// Example usage and test data for addBoardToFirestore function
// This file demonstrates how the function transforms nested data into flat Firestore structure

// Example input data from AddBoardsModal form:
const exampleFormData = {
  board: "CBSE",
  classes: {
    "1": { subject: ["English", "Maths"] },
    "2": { subject: ["Science", "Social Studies"] },
    "3": { subject: ["Hindi", "Computer Science"] }
  },
  isActive: true
};

// Expected Firestore structure after calling addBoardToFirestore(exampleFormData):

/*
BOARDS COLLECTION:
boards/cbse
{
  id: "cbse",
  name: "CBSE",
  isActive: true,
  createdAt: "2024-01-15T10:30:00.000Z"
}

CLASSES COLLECTION:
classes/cbse_class_1
{
  id: "cbse_class_1",
  name: "Class 1",
  boardId: "cbse",
  createdAt: "2024-01-15T10:30:00.000Z",
  isActive: true
}

classes/cbse_class_2
{
  id: "cbse_class_2",
  name: "Class 2",
  boardId: "cbse",
  createdAt: "2024-01-15T10:30:00.000Z",
  isActive: true
}

classes/cbse_class_3
{
  id: "cbse_class_3",
  name: "Class 3",
  boardId: "cbse",
  createdAt: "2024-01-15T10:30:00.000Z",
  isActive: true
}

SUBJECTS COLLECTION:
subjects/cbse_cbse_class_1_english
{
  id: "cbse_cbse_class_1_english",
  name: "English",
  classId: "cbse_class_1",
  boardId: "cbse",
  createdAt: "2024-01-15T10:30:00.000Z",
  isActive: true
}

subjects/cbse_cbse_class_1_maths
{
  id: "cbse_cbse_class_1_maths",
  name: "Maths",
  classId: "cbse_class_1",
  boardId: "cbse",
  createdAt: "2024-01-15T10:30:00.000Z",
  isActive: true
}

subjects/cbse_cbse_class_2_science
{
  id: "cbse_cbse_class_2_science",
  name: "Science",
  classId: "cbse_class_2",
  boardId: "cbse",
  createdAt: "2024-01-15T10:30:00.000Z",
  isActive: true
}

subjects/cbse_cbse_class_2_social_studies
{
  id: "cbse_cbse_class_2_social_studies",
  name: "Social Studies",
  classId: "cbse_class_2",
  boardId: "cbse",
  createdAt: "2024-01-15T10:30:00.000Z",
  isActive: true
}

subjects/cbse_cbse_class_3_hindi
{
  id: "cbse_cbse_class_3_hindi",
  name: "Hindi",
  classId: "cbse_class_3",
  boardId: "cbse",
  createdAt: "2024-01-15T10:30:00.000Z",
  isActive: true
}

subjects/cbse_cbse_class_3_computer_science
{
  id: "cbse_cbse_class_3_computer_science",
  name: "Computer Science",
  classId: "cbse_class_3",
  boardId: "cbse",
  createdAt: "2024-01-15T10:30:00.000Z",
  isActive: true
}
*/

// Function usage in component:
/*
import { addBoardToFirestore } from 'api/addBoardToFirestore';

const handleAddBoard = async (formData) => {
  try {
    const result = await addBoardToFirestore(formData);
    console.log("Board and classes added successfully!", result);
    // result contains:
    // {
    //   success: true,
    //   boardId: "cbse",
    //   classIds: ["cbse_class_1", "cbse_class_2", "cbse_class_3"],
    //   subjectIds: ["cbse_cbse_class_1_english", "cbse_cbse_class_1_maths", ...],
    //   totalClasses: 3,
    //   totalSubjects: 6
    // }
  } catch (error) {
    console.error("Error:", error);
  }
};
*/
