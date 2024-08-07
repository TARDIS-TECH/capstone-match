'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Member {
  name: string;
  srn: string;
  category: string;
  section: string;
  gender: string;
  contact: string;
}

interface Team {
  domain: string;
  members: Member[];
}

interface VisibleContacts {
  [key: string]: boolean;
}

export default function RegisteredTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [visibleContacts, setVisibleContacts] = useState<VisibleContacts>({});

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/get-teams');
        if (response.ok) {
          const data: Team[] = await response.json();
          setTeams(data);
        } else {
          console.error('Failed to fetch teams');
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  const toggleContact = (teamIndex: number, memberIndex: number) => {
    setVisibleContacts(prev => ({
      ...prev,
      [`${teamIndex}-${memberIndex}`]: !prev[`${teamIndex}-${memberIndex}`]
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Registered Teams</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team, teamIndex) => (
              <TableRow key={teamIndex}>
                <TableCell>{team.domain}</TableCell>
                <TableCell>
                  <ul className="list-disc pl-5">
                    {team.members.map((member, memberIndex) => (
                      <li key={memberIndex}>
                        {member.name} - SRN: {member.srn}, Category: {member.category}, Section: {member.section}, Gender: {member.gender}
                        <br />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleContact(teamIndex, memberIndex)}
                        >
                          {visibleContacts[`${teamIndex}-${memberIndex}`] ? 'Hide Contact' : 'Show Contact'}
                        </Button>
                        {visibleContacts[`${teamIndex}-${memberIndex}`] && (
                          <span className="ml-2">Contact: {member.contact}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  {/* Add any team-level actions here if needed */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}