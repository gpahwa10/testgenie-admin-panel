// import React, {useState} from 'react'
// import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input,Row, Col, Alert } from 'reactstrap'
// const AddBooksModal = ({isOpen,toggle}) => {
//     const [formData,setFormData] = useState({
//         board:"",
//         class:"",
//         subject:"",
//         bookId:"",
//         bookFile:"",
//         isActive:true,
//     })
//     const [errors,setErrors] = useState({});
//     const [isSubmitting,setIsSubmitting] = useState(false);
//   return (
//     <Modal isOpen={isOpen} toggle={toggle}>
//         <ModalHeader>Add Book</ModalHeader>
//         <ModalBody>
//             {errors.submit && (
//             <Alert color="danger">
//               {errors.submit}
//             </Alert>
//           )}
//             <Form>
//                 <Row>
//                     <Col md="6">
//                     <FormGroup>
//                         <Label>Board</Label>
//                         <Input>
//                         type="text"
//                         name="board"
//                         value={formData.board}
//                         onChange={handleInputChange}
//                         placeholder="Enter board name"
//                         invalid={!!errors.board}
//                         </Input>
//                     </FormGroup>
//                     </Col>
//                 </Row>
//             </Form>
//         </ModalBody>
//     </Modal>
//   )
// }

// export default AddBooksModal