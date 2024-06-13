import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState('');
  const [currentEditedItem, setCurrentEditedItem] = useState('');

  useEffect(() => {
    const savedTodo = JSON.parse(localStorage.getItem('todolist'));
    const savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));

    if (savedTodo) {
      setTodos(savedTodo);
      console.log('Loaded todos from local storage:', savedTodo);
    } else {
      console.log('No todos found in local storage.');
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
      console.log('Loaded completed todos from local storage:', savedCompletedTodo);
    } else {
      console.log('No completed todos found in local storage.');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todolist', JSON.stringify(allTodos));
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
    console.log('Saved todos to local storage:', allTodos);
    console.log('Saved completed todos to local storage:', completedTodos);
  }, [allTodos, completedTodos]);

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      completed: false,
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');
  };

  const handleDeleteTodo = index => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);
    setTodos(reducedTodo);
  };

  const handleComplete = index => {
    let now = new Date();
    let completedOn = now.toLocaleString();

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
      completed: true,
    };

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index);
  };

  const handleDeleteCompletedTodo = index => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);
    setCompletedTodos(reducedTodo);
  };

  const handleEdit = (ind, item) => {
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = value => {
    setCurrentEditedItem(prev => {
      return { ...prev, title: value };
    });
  };

  const handleUpdateDescription = value => {
    setCurrentEditedItem(prev => {
      return { ...prev, description: value };
    });
  };

  const handleUpdatePriority = value => {
    setCurrentEditedItem(prev => {
      return { ...prev, priority: value };
    });
  };

  const handleUpdateToDo = () => {
    let newToDo = [...allTodos];
    newToDo[currentEdit] = currentEditedItem;
    setTodos(newToDo);
    setCurrentEdit('');
  };

  const handleClearCompleted = () => {
    setCompletedTodos([]);
  };

  return (
    <div className="App">
      <h1>My Todos</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          <div className="todo-input-item">
            <label>Priority</label>
            <select value={newPriority} onChange={e => setNewPriority(e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>

        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false ? 'active' : ''}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true ? 'active' : ''}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {isCompleteScreen === false &&
            allTodos.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className="edit__wrapper" key={index}>
                    <input
                      placeholder="Updated Title"
                      onChange={e => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title}
                    />
                    <textarea
                      placeholder="Updated Description"
                      rows={4}
                      onChange={e => handleUpdateDescription(e.target.value)}
                      value={currentEditedItem.description}
                    />
                    <select value={currentEditedItem.priority} onChange={e => handleUpdatePriority(e.target.value)}>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleUpdateToDo}
                      className="primaryBtn"
                    >
                      Update
                    </button>
                  </div>
                );
              } else {
                return (
                  <div className={`todo-list-item ${item.priority}`} key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <p className="priority-label">{item.priority}</p>
                    </div>

                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteTodo(index)}
                        title="Delete?"
                      />
                      <BsCheckLg
                        className="check-icon"
                        onClick={() => handleComplete(index)}
                        title="Complete?"
                      />
                      <AiOutlineEdit
                        className="check-icon"
                        onClick={() => handleEdit(index, item)}
                        title="Edit?"
                      />
                    </div>
                  </div>
                );
              }
            })}

          {isCompleteScreen === true &&
            completedTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed on: {item.completedOn}</small></p>
                  </div>

                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedTodo(index)}
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}
          {isCompleteScreen && completedTodos.length > 0 && (
            <button className="clearBtn" onClick={handleClearCompleted}>
              Clear Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

