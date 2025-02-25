import { useState, useEffect } from 'react';
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

  //API에서 데이터 가져오는 함수
  const GetTodoFromAPI = async () => {
    try {
      const response = await axios.get<Todo[]>('/api');
      setTodos(prevTodos => [...prevTodos, ...response.data]);
    } catch (error) {
      console.error('API 요청 실패:', error);
    }
  };

  //페이지가 로드될 때 API에서 데이터를 불러옴
  useEffect(() => {
    GetTodoFromAPI();
  }, []);


  return (
    <div>
      <h1>To-Do List</h1>
      <div>
        {todos.map((todo) => (
          <div 
            key={todo.id}
          >
            {todo.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;
