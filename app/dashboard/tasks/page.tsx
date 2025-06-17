"use client";

import { AuthenticatedHeader } from "@/components/authenticated-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  Clock,
  Edit,
  Plus,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  tags?: string[];
  createdAt: string;
}

export default function TasksPage() {
  const [userName, setUserName] = useState("User");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskFilter, setTaskFilter] = useState("all");
  
  // For editing form
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editEstimatedPomodoros, setEditEstimatedPomodoros] = useState(1);
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">("medium");
  const [editDueDate, setEditDueDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user data
        const userResponse = await fetch("/api/user");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserName(userData.name);
        }

        // Fetch active tasks
        const activeTasks = await fetch("/api/tasks?completed=false");
        if (activeTasks.ok) {
          const activeTaksData = await activeTasks.json();
          setTasks(activeTaksData);
        }
        
        // Fetch completed tasks
        const completedTasksResp = await fetch("/api/tasks?completed=true");
        if (completedTasksResp.ok) {
          const completedTasksData = await completedTasksResp.json();
          setCompletedTasks(completedTasksData);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTaskTitle,
            estimatedPomodoros: 1,
            priority: "medium",
          }),
        });

        if (response.ok) {
          const newTask = await response.json();
          setTasks([newTask, ...tasks]);
          setNewTaskTitle("");
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== taskId));
        setCompletedTasks(completedTasks.filter((task) => task._id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !currentStatus,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        
        if (updatedTask.completed) {
          // Move from active to completed
          setTasks(tasks.filter(t => t._id !== taskId));
          setCompletedTasks([updatedTask, ...completedTasks]);
        } else {
          // Move from completed to active
          setCompletedTasks(completedTasks.filter(t => t._id !== taskId));
          setTasks([updatedTask, ...tasks]);
        }
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const startEditingTask = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditEstimatedPomodoros(task.estimatedPomodoros);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || "");
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const saveTaskChanges = async () => {
    if (!editingTask) return;
    
    try {
      const updatedTaskData = {
        title: editTitle,
        description: editDescription,
        estimatedPomodoros: editEstimatedPomodoros,
        priority: editPriority,
        dueDate: editDueDate || undefined
      };
      
      const response = await fetch(`/api/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTaskData),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        
        // Update the task in the appropriate list
        if (updatedTask.completed) {
          setCompletedTasks(completedTasks.map(t => 
            t._id === updatedTask._id ? updatedTask : t
          ));
        } else {
          setTasks(tasks.map(t => 
            t._id === updatedTask._id ? updatedTask : t
          ));
        }
        
        setEditingTask(null);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  
  // Filter tasks by priority
  const filteredTasks = taskFilter === "all" 
    ? tasks 
    : tasks.filter(task => task.priority === taskFilter);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-orange-500";
      case "low":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AuthenticatedHeader userName={userName} />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Task Management</h1>
            <p className="text-gray-400">
              Organize and track your tasks to enhance your productivity.
            </p>
          </div>
          
          <Tabs defaultValue="active">
            <TabsList className="mb-6 bg-black/30">
              <TabsTrigger value="active">Active Tasks</TabsTrigger>
              <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <div className="space-y-6">
                {/* Add Task Form */}
                <div className="p-6 bg-black/30 border border-white/10 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
                  <form onSubmit={handleAddTask} className="flex gap-2">
                    <Input
                      placeholder="What do you need to do?"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                    <Button type="submit">
                      <Plus className="h-5 w-5 mr-1" /> Add
                    </Button>
                  </form>
                </div>
                
                {/* Task Filters */}
                <div className="p-6 bg-black/30 border border-white/10 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Tasks</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Filter:</span>
                      <Select value={taskFilter} onValueChange={setTaskFilter}>
                        <SelectTrigger className="w-[120px] bg-white/5 border-white/10">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <p className="text-center py-8 text-gray-400">Loading tasks...</p>
                  ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-2">No tasks found</p>
                      <p className="text-sm text-gray-500">Create a new task to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTasks.map((task) => (
                        <div
                          key={task._id}
                          className={`p-4 border border-white/10 bg-white/5 rounded-lg ${
                            editingTask?._id === task._id ? "ring-1 ring-red-500" : ""
                          }`}
                        >
                          {editingTask?._id === task._id ? (
                            // Edit form
                            <div className="space-y-3">
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="bg-white/10 border-white/20"
                                placeholder="Task title"
                              />
                              <Textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="bg-white/10 border-white/20 min-h-[100px]"
                                placeholder="Task description (optional)"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-sm text-gray-400 mb-1 block">
                                    Estimated Pomodoros
                                  </label>
                                  <Input
                                    type="number"
                                    min={1}
                                    value={editEstimatedPomodoros}
                                    onChange={(e) => setEditEstimatedPomodoros(parseInt(e.target.value))}
                                    className="bg-white/10 border-white/20"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400 mb-1 block">
                                    Priority
                                  </label>
                                  <Select 
                                    value={editPriority} 
                                    onValueChange={(val: "low" | "medium" | "high") => setEditPriority(val)}
                                  >
                                    <SelectTrigger className="bg-white/10 border-white/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm text-gray-400 mb-1 block">
                                  Due Date (Optional)
                                </label>
                                <Input
                                  type="date"
                                  value={editDueDate}
                                  onChange={(e) => setEditDueDate(e.target.value)}
                                  className="bg-white/10 border-white/20"
                                />
                              </div>
                              <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={cancelEditing}>
                                  <X className="h-4 w-4 mr-1" /> Cancel
                                </Button>
                                <Button onClick={saveTaskChanges}>
                                  <Check className="h-4 w-4 mr-1" /> Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // Task display
                            <div>
                              <div className="flex justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleToggleComplete(task._id, task.completed)}
                                    className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center"
                                  >
                                    {task.completed && <Check className="h-3 w-3" />}
                                  </button>
                                  <h3 className="font-medium">{task.title}</h3>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    task.priority === "high" ? "bg-red-500/20 text-red-400" :
                                    task.priority === "medium" ? "bg-orange-500/20 text-orange-400" :
                                    "bg-blue-500/20 text-blue-400"
                                  }`}>
                                    {task.priority}
                                  </span>
                                </div>
                              </div>
                              
                              {task.description && (
                                <p className="text-gray-400 text-sm mb-3 pl-8">
                                  {task.description}
                                </p>
                              )}
                              
                              <div className="flex justify-between items-center pl-8">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1 text-sm text-gray-400">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {task.completedPomodoros}/{task.estimatedPomodoros} pomodoros
                                    </span>
                                  </div>
                                  
                                  {task.dueDate && (
                                    <div className="text-sm text-gray-400">
                                      Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => startEditingTask(task)}
                                    className="text-gray-400 hover:text-white"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="text-red-500 hover:text-red-400"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="p-6 bg-black/30 border border-white/10 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Completed Tasks</h2>
                
                {isLoading ? (
                  <p className="text-center py-8 text-gray-400">Loading tasks...</p>
                ) : completedTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No completed tasks yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedTasks.map((task) => (
                      <div
                        key={task._id}
                        className="p-4 border border-white/10 bg-white/5 rounded-lg opacity-70"
                      >
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleComplete(task._id, task.completed)}
                              className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                            >
                              <Check className="h-3 w-3 text-white" />
                            </button>
                            <h3 className="font-medium line-through text-gray-400">{task.title}</h3>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTask(task._id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-3 pl-8 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {task.completedPomodoros}/{task.estimatedPomodoros} pomodoros
                            </span>
                          </div>
                          <div>
                            Completed: {new Date(task.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
} 