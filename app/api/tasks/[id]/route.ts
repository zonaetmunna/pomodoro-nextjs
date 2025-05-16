import connectDB from '@/lib/db';
import { getUserFromToken } from '@/lib/utils';
import { Task } from '@/models/Task';
import { NextRequest, NextResponse } from 'next/server';

// Get a single task
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userData = await getUserFromToken(token);
    await connectDB();
    
    const task = await Task.findOne({
      _id: params.id,
      userId: userData.id
    });
    
    if (!task) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(task);
    
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { message: 'Error fetching task' },
      { status: 500 }
    );
  }
}

// Update a task
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userData = await getUserFromToken(token);
    const updates = await req.json();
    
    await connectDB();
    
    // Find task and verify ownership
    const task = await Task.findOne({
      _id: params.id,
      userId: userData.id
    });
    
    if (!task) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }
    
    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedTask);
    
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { message: 'Error updating task' },
      { status: 500 }
    );
  }
}

// Delete a task
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userData = await getUserFromToken(token);
    await connectDB();
    
    // Find task and verify ownership
    const task = await Task.findOne({
      _id: params.id,
      userId: userData.id
    });
    
    if (!task) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }
    
    // Delete the task
    await Task.findByIdAndDelete(params.id);
    
    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { message: 'Error deleting task' },
      { status: 500 }
    );
  }
} 