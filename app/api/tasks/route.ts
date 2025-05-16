import connectDB from '@/lib/db';
import { getUserFromToken } from '@/lib/utils';
import { Task } from '@/models/Task';
import { NextRequest, NextResponse } from 'next/server';

// Get all tasks for the current user
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
    const completed = searchParams.get('completed');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    // Connect to database
    await connectDB();
    
    // Build query
    const query: any = { userId: userData.id };
    
    // Filter by completion status if provided
    if (completed !== null) {
      query.completed = completed === 'true';
    }
    
    // Filter by priority if provided
    if (priority) {
      query.priority = priority;
    }
    
    // Search in title and description if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Find tasks
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create a new task
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
    const taskData = await request.json();
    const { title } = taskData;

    // Validate task data
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Create new task
    const newTask = await Task.create({
      ...taskData,
      userId: userData.id
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 