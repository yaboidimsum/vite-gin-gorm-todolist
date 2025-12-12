import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Card,
  // CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import React, { useState } from "react";

interface Form {
  title: string;
  description: string;
}

export default function CardForm() {
  const [form, setForm] = useState<Form>({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title && !form.description)
      return alert("There are empty fields!");

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/v1/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/jsom",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      // const newTodo = await response.json();

      setForm({ title: "", description: "" });
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("something went wrong");
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  return (
    <>
      <div className="w-1/4  ">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Add todo list</CardTitle>
            <CardDescription>Enter your todo list below</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Make an appointment"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="description">Description</Label>
                  </div>
                  <Input
                    id="description"
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? "Loading" : "Add Todo"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
