import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  const newTeam = await request.json();
  const teamsFilePath = path.join(process.cwd(), 'data', 'teams.json');
  
  try {
    let teams = [];
    if (fs.existsSync(teamsFilePath)) {
      const teamsData = fs.readFileSync(teamsFilePath, 'utf8');
      teams = JSON.parse(teamsData);
    }
    teams.push(newTeam);
    fs.writeFileSync(teamsFilePath, JSON.stringify(teams, null, 2));
    return NextResponse.json({ message: 'Team registered successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error writing to teams file:', error);
    return NextResponse.json({ message: 'Error registering team' }, { status: 500 });
  }
}