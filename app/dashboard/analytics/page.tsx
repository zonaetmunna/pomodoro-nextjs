"use client";

import { AuthenticatedHeader } from "@/components/authenticated-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, CalendarRange, Clock, Fire, ListTodo, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface Session {
  _id: string;
  duration: number;
  startTime: string;
  endTime: string;
  completed: boolean;
  taskId?: string;
  notes?: string;
}

interface DailyStats {
  date: string;
  totalSessions: number;
  totalMinutes: number;
  completedTasks: number;
}

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  completedPomodoros: number;
}

export default function AnalyticsPage() {
  const [userName, setUserName] = useState("User");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("week");
  
  // Statistics
  const [totalSessionsCompleted, setTotalSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [totalTasksCompleted, setTotalTasksCompleted] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [streak, setStreak] = useState(0);
  const [mostProductiveDay, setMostProductiveDay] = useState("");

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
        
        // Calculate date range
        const endDate = new Date();
        let startDate = new Date();
        
        switch (dateRange) {
          case "week":
            startDate.setDate(endDate.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(endDate.getMonth() - 1);
            break;
          case "year":
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
        }
        
        // Fetch sessions within date range
        const sessionsResponse = await fetch(
          `/api/sessions?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        );
        
        if (sessionsResponse.ok) {
          const sessionsData = await sessionsResponse.json();
          setSessions(sessionsData);
          
          // Calculate statistics
          calculateStatistics(sessionsData, startDate, endDate);
        }
        
        // Fetch completed tasks
        const tasksResponse = await fetch("/api/tasks?completed=true");
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          setTasks(tasksData);
          setTotalTasksCompleted(tasksData.length);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dateRange]);
  
  const calculateStatistics = (
    sessions: Session[], 
    startDate: Date, 
    endDate: Date
  ) => {
    // Calculate total sessions and focus time
    const completedSessions = sessions.filter(session => session.completed);
    setTotalSessionsCompleted(completedSessions.length);
    
    const totalMinutes = completedSessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );
    setTotalFocusTime(totalMinutes);
    
    // Calculate daily stats
    const dailyMap = new Map<string, DailyStats>();
    
    // Initialize all days in the range
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      dailyMap.set(dateString, {
        date: dateString,
        totalSessions: 0,
        totalMinutes: 0,
        completedTasks: 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Fill in actual session data
    for (const session of completedSessions) {
      const dateString = new Date(session.startTime).toISOString().split('T')[0];
      const stats = dailyMap.get(dateString);
      
      if (stats) {
        stats.totalSessions += 1;
        stats.totalMinutes += session.duration;
        // We'll count unique taskIds later
        if (session.taskId) {
          stats.completedTasks += 1;
        }
      }
    }
    
    // Convert map to array and sort by date
    const dailyStatsArray = Array.from(dailyMap.values())
      .sort((a, b) => a.date.localeCompare(b.date));
    
    setDailyStats(dailyStatsArray);
    
    // Find most productive day
    const mostProductiveDay = dailyStatsArray.reduce(
      (max, day) => (day.totalMinutes > max.totalMinutes ? day : max),
      { date: "", totalMinutes: 0, totalSessions: 0, completedTasks: 0 }
    );
    
    if (mostProductiveDay.totalMinutes > 0) {
      setMostProductiveDay(new Date(mostProductiveDay.date).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }));
    } else {
      setMostProductiveDay("No data available");
    }
    
    // Calculate streak
    let currentStreak = 0;
    let today = new Date().toISOString().split('T')[0];
    
    // Start from today and go backwards
    for (let i = dailyStatsArray.length - 1; i >= 0; i--) {
      const day = dailyStatsArray[i];
      
      // If this day had activity and is today or a previous consecutive day
      if (day.totalSessions > 0 && day.date <= today) {
        currentStreak++;
        
        // Move "today" back by one day to check for consecutive days
        const prevDate = new Date(day.date);
        prevDate.setDate(prevDate.getDate() - 1);
        today = prevDate.toISOString().split('T')[0];
      } else if (day.date < today) {
        // Break the streak if we hit a day with no activity
        break;
      }
    }
    
    setStreak(currentStreak);
  };
  
  // Format minutes as hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Generate chart data for visualization
  const getChartData = () => {
    // This would be used for a real chart component
    return dailyStats.map(day => ({
      date: new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      sessions: day.totalSessions,
      minutes: day.totalMinutes,
      tasks: day.completedTasks
    }));
  };
  
  // Simplified chart visualization (placeholder for a real chart library)
  const renderSimpleChart = () => {
    const maxMinutes = Math.max(...dailyStats.map(day => day.totalMinutes), 60);
    
    return (
      <div className="pt-6">
        <div className="flex justify-between mb-2 text-xs text-gray-500">
          {dailyStats.map((day, i) => (
            <div key={i} className="text-center w-full">
              {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
            </div>
          ))}
        </div>
        <div className="flex h-40 items-end gap-1">
          {dailyStats.map((day, i) => (
            <div 
              key={i} 
              className="flex-1 bg-gradient-to-t from-red-500 to-orange-500 rounded-t-sm"
              style={{ 
                height: `${day.totalMinutes > 0 ? (day.totalMinutes / maxMinutes) * 100 : 0}%`,
                minHeight: day.totalMinutes > 0 ? '4px' : '0'
              }}
              title={`${day.totalMinutes} minutes on ${day.date}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <AuthenticatedHeader userName={userName} />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Productivity Analytics</h1>
              <p className="text-gray-400">
                Track your focus sessions and see your progress over time.
              </p>
            </div>
            
            <div className="w-full sm:w-auto">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-white/10">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading analytics...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-black border-white/10">
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Focus Sessions</p>
                        <p className="text-3xl font-bold">{totalSessionsCompleted}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-red-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black border-white/10">
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Total Focus Time</p>
                        <p className="text-3xl font-bold">{formatTime(totalFocusTime)}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-orange-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black border-white/10">
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Tasks Completed</p>
                        <p className="text-3xl font-bold">{totalTasksCompleted}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <ListTodo className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black border-white/10">
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Current Streak</p>
                        <p className="text-3xl font-bold">{streak} days</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Fire className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Focus Time Chart */}
              <Card className="bg-black border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Focus Time Distribution
                  </CardTitle>
                  <CardDescription>
                    Your daily focus minutes for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {dailyStats.length > 0 ? (
                    renderSimpleChart()
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-400">No focus sessions recorded in this period</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Most Productive Day */}
                <Card className="bg-black border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Most Productive Day
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-medium mb-2">{mostProductiveDay}</p>
                    <p className="text-gray-400">
                      Keep up the great work and try to maintain your productivity!
                    </p>
                  </CardContent>
                </Card>
                
                {/* Recent Activity */}
                <Card className="bg-black border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarRange className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sessions.slice(0, 3).map((session, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{session.duration} minute session</p>
                            <p className="text-xs text-gray-500">
                              {new Date(session.startTime).toLocaleString()}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            session.completed 
                              ? "bg-green-500/20 text-green-400" 
                              : "bg-orange-500/20 text-orange-400"
                          }`}>
                            {session.completed ? "Completed" : "Interrupted"}
                          </div>
                        </div>
                      ))}
                      
                      {sessions.length === 0 && (
                        <p className="text-gray-400 text-center py-2">
                          No recent activity recorded
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 