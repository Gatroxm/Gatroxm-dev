import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthUser,
  BlogPost,
  ChatMessage,
  ChatResponse,
  ContactMessage,
  EducationItem,
  Experience,
  LoginResponse,
  Profile,
  Project,
  SkillGroup,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.base}/profile`);
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base}/projects`);
  }

  getProject(slug: string): Observable<Project> {
    return this.http.get<Project>(`${this.base}/projects/${slug}`);
  }

  getExperience(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.base}/experience`);
  }

  getSkills(): Observable<SkillGroup[]> {
    return this.http.get<SkillGroup[]>(`${this.base}/skills`);
  }

  getEducation(): Observable<EducationItem[]> {
    return this.http.get<EducationItem[]>(`${this.base}/education`);
  }

  sendContact(payload: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }): Observable<{ ok: boolean; id: string }> {
    return this.http.post<{ ok: boolean; id: string }>(`${this.base}/contact`, payload);
  }

  chat(message: string, history: ChatMessage[]): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.base}/chat`, { message, history });
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, { username, password });
  }

  me(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.base}/auth/me`);
  }

  getContactMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.base}/contact`);
  }

  updateContactMessageStatus(id: string, status: ContactMessage['status']): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(`${this.base}/contact/${id}`, { status });
  }

  deleteContactMessage(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.base}/contact/${id}`);
  }

  getBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.base}/blog`);
  }

  getBlogPost(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.base}/blog/${slug}`);
  }

  adminGetBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.base}/blog/admin/all`);
  }

  adminGetBlogPost(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.base}/blog/admin/id/${id}`);
  }

  createBlogPost(payload: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.base}/blog`, payload);
  }

  updateBlogPost(id: string, payload: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${this.base}/blog/${id}`, payload);
  }

  deleteBlogPost(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.base}/blog/${id}`);
  }
}
