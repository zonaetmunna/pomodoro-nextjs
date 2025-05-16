import connectDB from "@/lib/db";
import { getUserFromToken } from "@/lib/utils";
import { Session } from "@/models/Session";
import { Task } from "@/models/Task";
import { NextRequest, NextResponse } from "next/server";

// Get all sessions for the current user
export async function GET(request: NextRequest) {
  try {
    // Check for valid token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user from token
    const userData = await getUserFromToken(token);
    if (!userData) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const taskId = searchParams.get('taskId');

    // Connect to database
    await connectDB();
    
    // Build query
    const query: any = { userId: userData.id };
    
    // Add date filtering if provided
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }
    
    // Add task filtering if provided
    if (taskId) {
      query.taskId = taskId;
    }

    // Find sessions
    const sessions = await Session.find(query)
      .sort({ startTime: -1 })
      .lean();

    return NextResponse.json(sessions);
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create a new session
export async function POST(request: NextRequest) {
  try {
    // Check for valid token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user from token
    const userData = await getUserFromToken(token);
    if (!userData) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Parse request body
    const sessionData = await request.json();
    const { duration, completed, taskId, startTime, endTime, notes } = sessionData;

    // Validate session data
    if (!duration) {
      return NextResponse.json({ error: 'Duration is required' }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Check if the task exists and belongs to the user if taskId is provided
    if (taskId) {
      const task = await Task.findOne({ _id: taskId, userId: userData.id });
      if (!task) {
        return NextResponse.json({ error: 'Task not found or does not belong to user' }, { status: 404 });
      }
    }

    // Create new session
    const newSession = await Session.create({
      userId: userData.id,
      taskId: taskId || null,
      duration,
      completed: completed || false,
      startTime: startTime || new Date(),
      endTime: endTime || null,
      notes: notes || ''
    });

    // If the session is completed and associated with a task, increment completedPomodoros
    if (completed && taskId) {
      await Task.findByIdAndUpdate(taskId, { $inc: { completedPomodoros: 1 } });
    }

    return NextResponse.json(newSession, { status: 201 });
  } catch (error: any) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 