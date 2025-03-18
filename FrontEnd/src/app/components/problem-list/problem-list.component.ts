import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Problem } from '../../models/problem.model';
import { ProblemService } from '../../services/problem.service';

@Component({
  selector: 'app-problem-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems: Problem[] = [];

  constructor(private problemService: ProblemService) { }

  ngOnInit(): void {
    this.problemService.getProblems().subscribe({
      next: (problems) => {
        this.problems = problems;
      },
      error: (err) => {
        console.error('Failed to load problems:', err);
      }
    });
  }
}