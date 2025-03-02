import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Problem } from '../models/problem.model';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  private apiUrl = '/api/problems';

  constructor(private http: HttpClient) { }

  getProblems(): Observable<Problem[]> {
    return this.http.get<Problem[]>(this.apiUrl);
  }

  getProblem(id: number): Observable<Problem> {
    return this.http.get<Problem>(`${this.apiUrl}/${id}`);
  }

  submitSolution(problemId: number, code: string, language: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${problemId}/submit`, {
      code,
      language
    });
  }

  runTestCase(problemId: number, code: string, language: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${problemId}/run`, {
      code,
      language
    });
  }
}