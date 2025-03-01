import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/problem.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: '1',
      username: 'codemaster',
      solvedProblems: 423,
      totalSubmissions: 578,
      rank: 1,
      streak: 45
    },
    {
      id: '2',
      username: 'algorithmguru',
      solvedProblems: 387,
      totalSubmissions: 512,
      rank: 2,
      streak: 30
    },
    {
      id: '3',
      username: 'devninja',
      solvedProblems: 356,
      totalSubmissions: 489,
      rank: 3,
      streak: 28
    },
    {
      id: '4',
      username: 'codewizard',
      solvedProblems: 342,
      totalSubmissions: 467,
      rank: 4,
      streak: 15
    },
    {
      id: '5',
      username: 'pythonista',
      solvedProblems: 321,
      totalSubmissions: 450,
      rank: 5,
      streak: 22
    },
    {
      id: '6',
      username: 'javascriptpro',
      solvedProblems: 298,
      totalSubmissions: 412,
      rank: 6,
      streak: 18
    },
    {
      id: '7',
      username: 'datastructures',
      solvedProblems: 276,
      totalSubmissions: 389,
      rank: 7,
      streak: 12
    },
    {
      id: '8',
      username: 'leetcoder',
      solvedProblems: 254,
      totalSubmissions: 367,
      rank: 8,
      streak: 9
    },
    {
      id: '9',
      username: 'hackathoner',
      solvedProblems: 231,
      totalSubmissions: 342,
      rank: 9,
      streak: 7
    },
    {
      id: '10',
      username: 'debugger',
      solvedProblems: 210,
      totalSubmissions: 315,
      rank: 10,
      streak: 5
    }
  ];

  constructor() { }

  getLeaderboard(): Observable<User[]> {
    return of(this.users);
  }
}