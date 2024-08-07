'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const domains = [
  "Web Development",
  "Mobile App Development",
  "Machine Learning",
  "Data Science",
  "Cybersecurity",
  "IoT",
  "Cloud Computing",
  "Blockchain",
  "AR/VR",
  "Artificial Intelligence"
] as const;

type Domain = typeof domains[number];

interface Member {
  name: string;
  srn: string;
  contact: string;
  category: string;
  section: string;
  gender: string;
}

interface Team {
  members: Member[];
  domain: Domain;
  timestamp: string;
}

interface MemberFormProps {
  member: Member;
  index: number;
  updateMember: (index: number, field: keyof Member, value: string) => void;
  removeMember: (index: number) => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, index, updateMember, removeMember }) => (
  <div className="space-y-4 p-4 border rounded-md">
    <div className="space-y-2">
      <Label htmlFor={`name-${index}`}>Name</Label>
      <Input 
        id={`name-${index}`} 
        value={member.name} 
        onChange={(e) => updateMember(index, 'name', e.target.value)} 
        required 
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor={`srn-${index}`}>SRN</Label>
      <Input 
        id={`srn-${index}`} 
        value={member.srn} 
        onChange={(e) => updateMember(index, 'srn', e.target.value)} 
        required 
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor={`contact-${index}`}>Contact Number</Label>
      <Input 
        id={`contact-${index}`} 
        value={member.contact} 
        onChange={(e) => updateMember(index, 'contact', e.target.value)} 
        required 
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor={`category-${index}`}>Category</Label>
      <Select 
        value={member.category} 
        onValueChange={(value) => updateMember(index, 'category', value)} 
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="A">A (GPA 8+)</SelectItem>
          <SelectItem value="B">B (GPA 7-8)</SelectItem>
          <SelectItem value="C">C (GPA &lt;7)</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor={`section-${index}`}>Section</Label>
      <Input 
        id={`section-${index}`} 
        value={member.section} 
        onChange={(e) => updateMember(index, 'section', e.target.value)} 
        required 
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor={`gender-${index}`}>Gender</Label>
      <Select 
        value={member.gender} 
        onValueChange={(value) => updateMember(index, 'gender', value)} 
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
    {index > 0 && (
      <Button variant="destructive" onClick={() => removeMember(index)}>Remove Member</Button>
    )}
  </div>
);

export default function RegistrationForm() {
  const [members, setMembers] = useState<Member[]>([
    { name: '', srn: '', contact: '', category: '', section: '', gender: '' }
  ]);
  const [domain, setDomain] = useState<Domain | ''>('');
  const [registeredTeams, setRegisteredTeams] = useState<Team[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/get-teams');
        if (response.ok) {
          const data: Team[] = await response.json();
          setRegisteredTeams(data);
        } else {
          console.error('Failed to fetch teams');
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        setRegisteredTeams([]);
      }
    };

    fetchTeams();
  }, []);

  const addMember = () => {
    setMembers([...members, { name: '', srn: '', contact: '', category: '', section: '', gender: '' }]);
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const removeMember = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!domain) return;  // Ensure domain is selected
    const newTeam: Team = {
      members: [...members],
      domain: domain,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/register-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeam),
      });

      if (response.ok) {
        console.log('Team registered successfully');
        setRegisteredTeams([...registeredTeams, newTeam]);
        setMembers([{ name: '', srn: '', contact: '', category: '', section: '', gender: '' }]);
        setDomain('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        console.error('Failed to register team');
      }
    } catch (error) {
      console.error('Error registering team:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Team Registration</CardTitle>
        <CardDescription>Register your team for the capstone project</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain of Interest</Label>
            <Select 
              value={domain} 
              onValueChange={(value: Domain) => setDomain(value)} 
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {members.map((member, index) => (
            <MemberForm 
              key={index} 
              member={member} 
              index={index} 
              updateMember={updateMember}
              removeMember={removeMember}
            />
          ))}

          <Button type="button" onClick={addMember}>Add Member</Button>
          <Button type="submit">Register Team</Button>
        </form>
      </CardContent>
      {submitted && (
        <Alert className="mt-4">
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your team has been registered successfully.</AlertDescription>
        </Alert>
      )}
    </Card>
  );
}