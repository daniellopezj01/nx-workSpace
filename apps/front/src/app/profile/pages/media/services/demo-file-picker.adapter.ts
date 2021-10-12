import { FilePreviewModel } from 'ngx-awesome-uploader';
import {
  HttpRequest,
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
} from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { FilePickerAdapter } from 'ngx-awesome-uploader';
import { environment } from '../../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { UpdateService } from './update.service';

export class DemoFilePickerAdapter extends FilePickerAdapter {
  public readonly url: string = environment.api;

  constructor(
    private http: HttpClient,
    private updateService: UpdateService,
    private cookies: CookieService,
    private video: boolean = true
  ) {
    super();
  }

  private headers = () => {
    const tok = this.cookies.get('session');
    const header = {
      Authorization: `Bearer ${tok}`,
    };
    return new HttpHeaders(header);
  }

  public uploadFile(fileItem: FilePreviewModel) {
    if (!this.video) {
      this.updateService.showLoading();
    }
    const form = new FormData();
    form.append('file[]', fileItem.file);
    const api = `${this.url}/storage`;
    const req = new HttpRequest('POST', api, form, {
      reportProgress: true,
      // headers: this.headers(),
    });

    return this.http.request(req).pipe(
      map((res: HttpEvent<any>) => {
        return JSON.stringify(res);
      })
    );
  }

  public removeFile(fileItem: any): Observable<any> {
    const removeApi = '';
    return this.http.post(removeApi, {});
  }
}
