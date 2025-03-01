import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/problem.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Leaderboard</h1>
      <div class="card">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Solved</th>
              <th>Submissions</th>
              <th>Streak</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td [ngClass]="{'rank': true, 'top-rank': user.rank <= 3}">{{ user.rank }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.solvedProblems }}</td>
              <td>{{ user.totalSubmissions }}</td>
              <td>{{ user.streak }} days</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class LeaderboardComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getLeaderboard().subscribe(users => {
      this.users = users;
    });
  }
}