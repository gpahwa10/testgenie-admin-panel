import React from 'react';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';

const DataDebugger = ({ boards, onRefresh }) => {
  const logBoardData = (board) => {
    console.log('🔍 Board Debug Info:', {
      id: board.id,
      name: board.name,
      isActive: board.isActive,
      hasClasses: !!board.classes,
      classesCount: board.classes ? Object.keys(board.classes).length : 0,
      classes: board.classes ? Object.keys(board.classes) : [],
      fullStructure: board
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <h5 className="mb-0">
          <i className="fas fa-bug me-2"></i>
          Data Debugger
        </h5>
      </CardHeader>
      <CardBody>
        <div className="mb-3">
          <strong>Total Boards:</strong> {boards.length}
        </div>
        
        <div className="mb-3">
          <strong>Boards Status:</strong>
          <ul className="mb-0">
            {boards.map(board => (
              <li key={board.id}>
                <strong>{board.name}</strong> (ID: {board.id})
                <br />
                <small className="text-muted">
                  Classes: {board.classes ? Object.keys(board.classes).length : 'None'} | 
                  Active: {board.isActive ? 'Yes' : 'No'}
                </small>
                <Button 
                  size="sm" 
                  color="outline-info" 
                  className="ms-2"
                  onClick={() => logBoardData(board)}
                >
                  Log to Console
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <Button color="primary" onClick={onRefresh}>
          <i className="fas fa-sync-alt me-1"></i>
          Refresh Data
        </Button>
      </CardBody>
    </Card>
  );
};

export default DataDebugger;
