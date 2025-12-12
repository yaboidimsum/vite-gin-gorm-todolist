import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Button } from "../ui/button";

interface Todo {
  id: number;
  title: string;
  description: string;
}

interface DeleteModalProps {
  todo: Todo;
  onClose: () => void;
}

export default function DeleteTodoModal({ todo, onClose }: DeleteModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Prefill data saat modal muncul

  useEffect(() => {
    setFormData({ title: todo.title, description: todo.description });
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(formData);

    try {
      const response = await fetch(`http://localhost:3000/v1/todo/${todo.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete todo");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Delete Todo</CardTitle>
          <CardDescription>Remove your todo.</CardDescription>
        </CardHeader>

        <CardContent>
          <span>
            Are you sure you want to delete the todo list (your action cannot be
            undo)
          </span>
        </CardContent>

        <CardFooter className="flex justify-between flex-col gap-2">
          {/* Tombol Delete */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            onClick={handleSubmit} // Trigger submit manual
            variant={"destructive"}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>

          {/* Tombol Cancel */}
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
