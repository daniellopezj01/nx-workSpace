/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'stripe', src: 'https://js.stripe.com/v3/' },
];

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private scripts: any = {};

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src,
      };
    });
  }

  // WrapperWindow(): any {
  //   return window;
  // }
  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (isPlatformBrowser(this.platformId)) {
        if (!this.scripts[name].loaded) {
          // load script
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = this.scripts[name].src;
          // @ts-ignore
          if (script.readyState) {
            // IE
            // @ts-ignore
            script.onreadystatechange = () => {
              // @ts-ignore
              if (script.readyState === 'loaded' || script.readyState === 'complete') {
                // @ts-ignore
                script.onreadystatechange = null;
                this.scripts[name].loaded = true;
                resolve({ script: name, loaded: true, status: 'Loaded' });
              }
            };
          } else {
            // Others
            script.onload = () => {
              this.scripts[name].loaded = true;
              resolve({ script: name, loaded: true, status: 'Loaded' });
            };
          }
          script.onerror = (error: any) =>
            resolve({ script: name, loaded: false, status: 'Loaded' });
          document.getElementsByTagName('head')[0].appendChild(script);
        } else {
          resolve({ script: name, loaded: true, status: 'Already Loaded' });
        }
      } else {
        reject(null);
      }
    });
  }
}
