import { Subject } from 'rxjs/internal/Subject';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { async } from '@angular/core/testing';

declare const SockJS;
declare const Stomp;

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
  ) {
  }

  private headerSend;
  public stompClient;
  public postList = new Subject<any>();
  public dashSum = new Subject<any>();
  public statusConnect = new Subject<boolean>();
  public connected = false;
  reconInv;

  initConnect(): void {
    return;
    this.headerSend = {
      'Access-Control-Allow-Origin': '*',
      'Upgrade': 'websocket',
      'Connection': 'Upgrade'
    };
    const serverUrl = environment.API_BEAN_SOCKET + 'socket';
    const ws = new SockJS(serverUrl, null, { transports: ['websocket'] });
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect(
      this.headerSend,
      // '',
      // '',
      (frame) => {
        this.stompClient.debug('connected to Socket!!!');
        this.statusConnect.next(true);
        this.subscribePost();
        this.subscribeDashSum();
      },
      (error) => {
        console.log('=====> when error', error);
        // this.reconnect();
      },
      (closeEvent) => {
        console.log('====> when closeEvent', closeEvent);
        this.statusConnect.next(false);
        this.disconnect();
        this.reconnect();
      },
    );
  }

  reconnect(): void {
    this.reconInv = setInterval(() => {
      const serverUrl = environment.API_BEAN_MAIN + 'socket';
      const ws = new SockJS(serverUrl, null, { transports: ['websocket'] });
      this.stompClient = Stomp.over(ws);
      this.headerSend = {
        'Access-Control-Allow-Origin': '*'
      };
      this.stompClient.connect(
        this.headerSend,
        (frame) => {
          this.stompClient.debug('connected to Socket!!!');
          this.statusConnect.next(true);
          this.connected = true;
          clearInterval(this.reconInv);
          this.subscribePost();
          this.subscribeDashSum();
        },
        (error) => {
          console.log('=====> when error', error);
          this.statusConnect.next(false);
        },
        (closeEvent) => {
          console.log('====> when closeEvent', closeEvent);
          if (this.connected) {
            this.statusConnect.next(false);
            this.disconnect();
            clearInterval(this.reconInv);
            this.reconnect();
          }
        },
      );
    }, 10000);
  }



  public subscribePost() {
    this.stompClient.subscribe(
      '/dashboard',
      (message) => {
        if (message.body) {
          console.log('body web sock dashboard');
          this.postList.next(JSON.parse(message.body));
        }
      },
    );
  }

  public subscribeDashSum() {
    this.stompClient.subscribe(
      '/dashboard/sum',
      (message) => {
        if (message.body) {
          console.log('body web sock sum dashboard');
          this.dashSum.next(JSON.parse(message.body));
        }
      },
    );
  }

  public sendPost(text: string): void {
    // (void) send(destination, headers = {}, body = '')
    this.stompClient.send('/app/send-post', this.headerSend, text);
  }

  public disconnect() {
    clearInterval(this.reconInv);
    this.stompClient.disconnect();
  }

}
