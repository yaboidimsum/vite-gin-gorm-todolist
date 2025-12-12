import { useState, useEffect } from "react";
import { Button } from "../ui/button";

import EditTodoModal from "./EditModalTodo";
import DeleteTodoModal from "./DeleteModalTodo";

interface Todo {
  id: number;
  title: string;
  description: string;
}

export default function CardList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/v1/todo")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      })
      .catch((err) => console.log("Failed to fetch data:", err));
  }, []);

  return (
    <>
      <div className="w-3/4 ">
        {/* <span>This is Card List</span> */}
        <ul className="grid grid-cols-2 gap-4">
          {todos &&
            todos.map((item) => (
              <li
                key={item.id}
                className="group flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* ID Badge - Style ala 'Badge' shadcn */}
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                      {item.id}
                    </span>
                    {/* Title - Typography tebal dan rapi */}
                    <h3 className="font-semibold leading-none tracking-tight text-slate-900">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant={"destructive"}
                      size={`sm`}
                      onClick={() => setDeletingTodo(item)}
                    >
                      <span className="text-sm font-semibold">Delete</span>
                    </Button>
                    <Button
                      variant={"secondary"}
                      size={`sm`}
                      onClick={() => setEditingTodo(item)}
                    >
                      <span className="text-sm font-semibold">Update</span>
                    </Button>
                  </div>
                </div>

                {/* Description - Warna text-muted-foreground (abu-abu) */}
                <p className="text-sm text-slate-500 text-start">
                  {item.description}
                </p>
              </li>
            ))}
        </ul>
      </div>
      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
        />
      )}

      {deletingTodo && (
        <DeleteTodoModal
          todo={deletingTodo}
          onClose={() => setDeletingTodo(null)}
        />
      )}
    </>
  );
}
