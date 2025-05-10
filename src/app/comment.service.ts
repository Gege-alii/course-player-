import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private binId = '681f58248561e97a50111ea1';
  private apiKey = '$2a$10$jMDXInQTkNIiom.xZNfJ6u.z1Q1qPHXIKv0PUH.Wv3FvfCx8fCKy.';
  private baseUrl = `https://api.jsonbin.io/v3/b/681f58248561e97a50111ea1/${this.binId}`;

  async getComments(): Promise<any[]> {
    const res = await axios.get(`${this.baseUrl}/latest`, {
      headers: { 'X-Master-Key': this.apiKey }
    });
    return res.data.record;
  }

  async saveComments(comments: any[]): Promise<void> {
    await axios.put(this.baseUrl, comments, {
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': this.apiKey
      }
    });
  }
}
