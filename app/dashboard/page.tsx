"use client";

import { AuthenticatedHeader } from "@/components/authenticated-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, PauseCircle, PlayCircle, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Interface types
interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
}

interface Settings {
  pomodoroLength: number;
  shortBreakLength: number;
  longBreakLength: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  darkMode: boolean;
}

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export default function DashboardPage() {
  // User state
  const [userName, setUserName] = useState("User");
  
  // Settings state
  const [settings, setSettings] = useState<Settings>({
    pomodoroLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true,
    soundVolume: 50,
    darkMode: true
  });
  
  // Timer state
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroLength * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user data and settings
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch user data
        const userResponse = await fetch("/api/user");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserName(userData.name);
        }
        
        // Fetch user settings
        const settingsResponse = await fetch("/api/settings");
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setSettings(settingsData);
          
          // Initialize timer based on current mode and loaded settings
          switch (timerMode) {
            case "pomodoro":
              setTimeLeft(settingsData.pomodoroLength * 60);
              break;
            case "shortBreak":
              setTimeLeft(settingsData.shortBreakLength * 60);
              break;
            case "longBreak":
              setTimeLeft(settingsData.longBreakLength * 60);
              break;
          }
        }
        
        // Fetch tasks
        const tasksResponse = await fetch("/api/tasks?completed=false");
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          setTasks(tasksData);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Initialize timer based on mode
  useEffect(() => {
    switch (timerMode) {
      case "pomodoro":
        setTimeLeft(settings.pomodoroLength * 60);
        break;
      case "shortBreak":
        setTimeLeft(settings.shortBreakLength * 60);
        break;
      case "longBreak":
        setTimeLeft(settings.longBreakLength * 60);
        break;
    }
    setIsActive(false);
  }, [timerMode, settings]);
  
  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Play sound if enabled
      if (settings.soundEnabled) {
        const audio = new Audio("/sounds/bell.mp3");
        audio.volume = settings.soundVolume / 100;
        audio.play().catch(e => console.error("Error playing sound:", e));
      }
      
      // Timer completed
      if (timerMode === "pomodoro") {
        // Record completed session
        recordCompletedSession();
        
        // Increment completed pomodoros
        setCompletedPomodoros((prev) => prev + 1);
        
        // Increment task's completed pomodoros if a task is selected
        if (currentTaskId) {
          updateTaskCompletion(currentTaskId);
        }
        
        // Determine next break type
        if (completedPomodoros % settings.longBreakInterval === settings.longBreakInterval - 1) {
          // After every N pomodoros, take a long break
          setTimerMode("longBreak");
          if (settings.autoStartBreaks) {
            resetTimer("longBreak");
            setIsActive(true);
          }
        } else {
          setTimerMode("shortBreak");
          if (settings.autoStartBreaks) {
            resetTimer("shortBreak");
            setIsActive(true);
          }
        }
      } else {
        // After break, back to pomodoro
        setTimerMode("pomodoro");
        if (settings.autoStartPomodoros) {
          resetTimer("pomodoro");
          setIsActive(true);
        }
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerMode, completedPomodoros, currentTaskId, settings]);
  
  // Record completed session to the API
  const recordCompletedSession = async () => {
    try {
      const sessionData = {
        duration: settings.pomodoroLength,
        completed: true,
        taskId: currentTaskId || undefined,
        startTime: new Date(Date.now() - settings.pomodoroLength * 60 * 1000).toISOString(),
        endTime: new Date().toISOString()
      };
      
      await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });
    } catch (error) {
      console.error("Error recording session:", error);
    }
  };
  
  // Update task completion
  const updateTaskCompletion = async (taskId: string) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;
      
      const newCompletedCount = task.completedPomodoros + 1;
      const isNowCompleted = newCompletedCount >= task.estimatedPomodoros;
      
      // Update the task locally first
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t._id === taskId 
            ? { 
                ...t, 
                completedPomodoros: newCompletedCount,
                completed: isNowCompleted 
              } 
            : t
        )
      );
      
      // If the task is now complete, remove it from current task
      if (isNowCompleted) {
        setCurrentTaskId(null);
      }
      
      // Update in the database
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completedPomodoros: newCompletedCount,
          completed: isNowCompleted
        }),
      });
      
      // Refresh task list if a task was completed
      if (isNowCompleted) {
        const tasksResponse = await fetch("/api/tasks?completed=false");
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          setTasks(tasksData);
        }
      }
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Reset timer based on mode
  const resetTimer = (mode: TimerMode) => {
    switch (mode) {
      case "pomodoro":
        setTimeLeft(settings.pomodoroLength * 60);
        break;
      case "shortBreak":
        setTimeLeft(settings.shortBreakLength * 60);
        break;
      case "longBreak":
        setTimeLeft(settings.longBreakLength * 60);
        break;
    }
  };
  
  // Handle adding a new task
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
            priority: "medium"
          }),
        });
        
        if (response.ok) {
          const newTask = await response.json();
          setTasks([...tasks, newTask]);
          setNewTaskTitle("");
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };
  
  // Toggle task completion status
  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;
      
      // Update locally first
      setTasks(
        tasks.map((t) =>
          t._id === taskId ? { ...t, completed: !t.completed } : t
        )
      );
      
      // Update in the database
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      
      // If we completed the current task, clear it
      if (currentTaskId === taskId && !task.completed) {
        setCurrentTaskId(null);
      }
      
      // Refresh tasks
      const tasksResponse = await fetch("/api/tasks?completed=false");
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };
  
  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      // Update locally first
      setTasks(tasks.filter((task) => task._id !== taskId));
      if (currentTaskId === taskId) {
        setCurrentTaskId(null);
      }
      
      // Delete from the database
      await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  
  // Set current task for the timer
  const setCurrentTask = (taskId: string) => {
    setCurrentTaskId(taskId);
  };
  
  return (
    <div className="min-h-screen bg-black">
      <AuthenticatedHeader userName={userName} />
      
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Timer Section */}
          <div className="space-y-6">
            <div className="p-6 bg-black/30 border border-white/10 rounded-xl">
              <div className="flex gap-2 mb-6">
                <Button
                  variant={timerMode === "pomodoro" ? "default" : "outline"}
                  onClick={() => setTimerMode("pomodoro")}
                  className={
                    timerMode === "pomodoro"
                      ? "bg-gradient-to-r from-red-500 to-orange-500 text-white flex-1"
                      : "flex-1"
                  }
                >
                  Pomodoro
                </Button>
                <Button
                  variant={timerMode === "shortBreak" ? "default" : "outline"}
                  onClick={() => setTimerMode("shortBreak")}
                  className={
                    timerMode === "shortBreak"
                      ? "bg-gradient-to-r from-green-500 to-teal-500 text-white flex-1"
                      : "flex-1"
                  }
                >
                  Short Break
                </Button>
                <Button
                  variant={timerMode === "longBreak" ? "default" : "outline"}
                  onClick={() => setTimerMode("longBreak")}
                  className={
                    timerMode === "longBreak"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex-1"
                      : "flex-1"
                  }
                >
                  Long Break
                </Button>
              </div>
              
              <div className="text-center">
                <div className="text-6xl font-bold mb-8">{formatTime(timeLeft)}</div>
                
                <div className="flex justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={() => setIsActive(!isActive)}
                    className={
                      timerMode === "pomodoro"
                        ? "bg-gradient-to-r from-red-500 to-orange-500"
                        : timerMode === "shortBreak"
                        ? "bg-gradient-to-r from-green-500 to-teal-500"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500"
                    }
                  >
                    {isActive ? (
                      <>
                        <PauseCircle className="mr-2 h-5 w-5" /> Pause
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-5 w-5" /> Start
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setIsActive(false);
                      resetTimer(timerMode);
                    }}
                  >
                    <RefreshCw className="mr-2 h-5 w-5" /> Reset
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-black/30 border border-white/10 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Today's Progress</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-red-500">{completedPomodoros}</p>
                  <p className="text-xs text-gray-400">Pomodoros</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-500">
                    {Math.floor(completedPomodoros * settings.pomodoroLength / 60)}h {completedPomodoros * settings.pomodoroLength % 60}m
                  </p>
                  <p className="text-xs text-gray-400">Focus Time</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-500">
                    {tasks.filter((task) => task.completed).length}
                  </p>
                  <p className="text-xs text-gray-400">Tasks Done</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tasks Section */}
          <div className="space-y-6">
            <div className="p-6 bg-black/30 border border-white/10 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Tasks</h2>
              
              <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                <Input
                  placeholder="Add a new task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
                <Button type="submit">
                  <Plus className="h-5 w-5" />
                </Button>
              </form>
              
              <div className="space-y-2">
                {isLoading ? (
                  <p className="text-gray-400 text-center py-4">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No tasks yet. Add one above!</p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task._id}
                      className={`p-3 border ${
                        currentTaskId === task._id
                          ? "border-red-500/50 bg-red-500/10"
                          : "border-white/10 bg-white/5"
                      } rounded-lg flex items-center justify-between group ${
                        task.completed ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskCompletion(task._id)}
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            task.completed
                              ? "bg-green-500 text-white"
                              : "border border-white/30"
                          }`}
                        >
                          {task.completed && <Check className="h-3 w-3" />}
                        </button>
                        <div className={task.completed ? "line-through text-gray-400" : ""}>
                          {task.title}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-400">
                          {task.completedPomodoros}/{task.estimatedPomodoros}
                        </div>
                        {!task.completed && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setCurrentTask(task._id)}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                              currentTaskId === task._id ? "text-red-500" : ""
                            }`}
                          >
                            <PlayCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTask(task._id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {currentTaskId && (
              <div className="p-6 bg-black/30 border border-white/10 rounded-xl">
                <h2 className="text-xl font-semibold mb-2">Current Task</h2>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <p>
                    {tasks.find((task) => task._id === currentTaskId)?.title}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 