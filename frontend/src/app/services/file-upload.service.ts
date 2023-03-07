import {
  HttpHeaders,
  HttpParams,
  HttpClient,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  getAuthHeaders() {
    return {
      'x-token': localStorage.getItem('tokenEGS') || '',
    };
  }

  getPresignedUrls(image: any) {
    const authHeader = this.getAuthHeaders() || {
      'x-token': 'unauthenticated',
    };
    const [authKey, authValue] = Object.entries(authHeader)[0];

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set(authKey, authValue);
    const params = new HttpParams()
      .set('name', image.name)
      .set('mime', image.type);
    const url = `${baseUrl}/products/image/presigned-url`;
    return this.http.get(url, { params, headers });
  }

  uploadfileAWSS3(fileUploadUrl: string, contentType: string, file: any) {
    const headers = new HttpHeaders({
      'Content-Type': contentType,
    });
    const req = new HttpRequest('PUT', fileUploadUrl, file, {
      headers,
    });
    return this.http.request(req);
  }

  deleteFileAWSS3(name: string) {
    const url = `${baseUrl}/products/image/${name}`;
    return this.http.delete(url, { headers: this.getAuthHeaders() });
  }
}
