import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Problem } from '../models/problem.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  private baseUrl = '/api/problems'; // Will need to configure this endpoint

  constructor(private http: HttpClient) { }

  getProblems(): Observable<Problem[]> {
    return this.http.get<Problem[]>(`${this.baseUrl}`);
  }

  getProblem(id: number): Observable<Problem | undefined> {
    return this.http.get<Problem>(`${this.baseUrl}/${id}`);
  }

  submitSolution(problemId: number, code: string, language: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${problemId}/submit`, {
      code,
      language
    });
  }

  runTestCase(problemId: number, code: string, language: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${problemId}/run`, {
      code,
      language
    });
  }
}