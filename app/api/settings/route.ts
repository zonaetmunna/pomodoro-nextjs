import connectDB from "@/lib/db";
import { getUserFromToken } from "@/lib/utils";
import { Settings } from "@/models/Settings";
import { NextRequest, NextResponse } from "next/server";

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

    // Connect to the database
    await connectDB();

    // Find or create settings for this user
    let settings = await Settings.findOne({ userId: userData.id });
    
    if (!settings) {
      // Create default settings
      settings = await Settings.create({
        userId: userData.id,
        // Default values will be applied from schema
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const updates = await request.json();
    
    // Connect to the database
    await connectDB();

    // Find and update settings
    const settings = await Settings.findOneAndUpdate(
      { userId: userData.id },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 