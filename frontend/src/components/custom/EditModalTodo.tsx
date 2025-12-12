import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface Todo {
  id: number;
  title: string;
  description: string;
}

interface EditModalProps {
  todo: Todo;
  onClose: () => void;
}

export default function EditTodoModal({ todo, onClose }: EditModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Prefill data saat modal muncul

  useEffect(() => {
    setFormData({ title: todo.title, description: todo.description });
  }, [todo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(formData)

    try {
      const response = await fetch(
        `http://localhost:3000/v1/todo/${todo.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to update todo");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating:", error);
      setIsLoading(false);
    }
  };

  return (
    // 1. Overlay Hitam (Background Modal)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* 2. Card Component (Gaya Shadcn seperti request Anda) */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Todo</CardTitle>
          <CardDescription>Make changes to your task here.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Title Input */}
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  type="text"
                  name="title"
                  placeholder="Todo Title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Description Input */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="edit-description">Description</Label>
                </div>
                <Input
                  id="edit-description"
                  type="text"
                  name="description"
                  placeholder="Details..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between flex-col gap-2">
          {/* Tombol Save */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            onClick={handleSubmit} // Trigger submit manual
          >
            {isLoading ? "Saving..." : "Save Changes"}
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
