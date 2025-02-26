import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

//ToDo 항목의 타입을 정의
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  //로컬 스토리지에서 데이터를 불러오는 함수
  const loadTodosFromLocalStorage = () => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos); // 로컬 스토리지에서 데이터를 불러와 반환
    }
    return [];
  };

  //API에서 데이터 가져오는 함수
  const GetTodoFromAPI = async () => {
    try {
      const response = await axios.get<Todo[]>('/api');
      const apiTodos = response.data;

      //API에서 받아온 데이터가 로컬 스토리지에 없을 때만 로컬 스토리지에 저장
      const existingTodos = loadTodosFromLocalStorage();
      const updatedTodos = [
        ...existingTodos,
        ...apiTodos.filter(
          (apiTodo) => !existingTodos.some((existingTodo: { id: number; }) => existingTodo.id === apiTodo.id)
        ),
      ];

      //로컬 스토리지에 병합된 데이터를 저장
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      
      setTodos(updatedTodos); //상태에 병합된 데이터를 설정
    } catch (error) {
      console.error('API 요청 실패:', error);
    }
  };

  //페이지가 로드될 때 로컬 스토리지에서 데이터를 먼저 불러오고, 그 후 API에서 데이터를 가져옴
  useEffect(() => {
    const existingTodos = loadTodosFromLocalStorage(); //로컬 스토리지에서 데이터를 불러오기
    setTodos(existingTodos); //상태에 로컬 스토리지 데이터 설정

    GetTodoFromAPI(); //API에서 데이터를 불러옴
  }, []);

  //할 일을 추가하는 함수
  const addTodo = () => {
    if (newTodo.trim() === '') return;
    const newTodoItem: Todo = {
      userId: 1,
      id: Date.now(),
      title: newTodo,
      completed: false,
    };
    const updatedTodos = [...todos, newTodoItem];
    setTodos(updatedTodos);
    setNewTodo('');
    localStorage.setItem('todos', JSON.stringify(updatedTodos)); //로컬 스토리지에 데이터 저장
  };

  //입력값이 변경될 때 호출되는 함수
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  //할 일 삭제하는 함수
   const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          placeholder="새 할 일을 입력하세요"
        />
        <button onClick={addTodo}>추가</button>
      <div>
        {todos.map((todo) => (
          <div 
            key={todo.id}
          >
            {todo.title}
            <button onClick={(e) => {
              e.stopPropagation();
              deleteTodo(todo.id);
            }}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;
