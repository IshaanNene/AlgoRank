import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Problem } from '../models/problem.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private executorUrl = environment.executorUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Problem endpoints
  getProblems(): Observable<Problem[]> {
    return this.http.get<Problem[]>(`${this.apiUrl}/api/problems`);
  }

  getProblem(id: number): Observable<Problem> {
    return this.http.get<Problem>(`${this.apiUrl}/api/problems/${id}`);
  }

  // Code execution endpoints
  runCode(problemId: number, submission: any): Observable<any> {
    submission.mode = 'run';
    return this.http.post(
      `${this.executorUrl}/execute`,
      submission,
      { headers: this.getHeaders() }
    );
  }

  submitCode(problemId: number, submission: any): Observable<any> {
    submission.mode = 'submit';
    return this.http.post(
      `${this.executorUrl}/execute`,
      submission,
      { headers: this.getHeaders() }
    );
  }

  // User endpoints
  getUserSubmissions(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/api/users/${userId}/submissions`
    );
  }

  getLeaderboard(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/leaderboard`);
  }
} 