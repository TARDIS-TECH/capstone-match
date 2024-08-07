import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const teamsFilePath = path.join(process.cwd(), 'data', 'teams.json');
  
  try {
    if (fs.existsSync(teamsFilePath)) {
      const teamsData = fs.readFileSync(teamsFilePath, 'utf8');
      const teams = JSON.parse(teamsData);
      return NextResponse.json(teams);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error reading teams file:', error);
    return NextResponse.json({ message: 'Error fetching teams' }, { status: 500 });
  }
}