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
export class SocketServiceWebPlayer {

    constructor(
    ) {
    }

    private headerSend;
    public stompClient;
    public promotionList = new Subject<any>();
    public registerList = new Subject<any>();
    public depositList = new Subject<any>();
    public withdrawList = new Subject<any>();
    public statusConnect = new Subject<boolean>();
    public connected = false;
    reconInv;

    initConnect(): void {
        return;
        this.headerSend = {
            'Access-Control-Allow-Origin': '*',
            'Upgrade': 'websocket',
            'Connection': 'Upgrade',
        };
        const serverUrl = environment.API_WEBPLAYER_MAIN + 'socket';
        const ws = new SockJS(serverUrl, null, { transports: ['websocket'] });
        this.stompClient = Stomp.over(ws);
        // return
        this.stompClient.connect(
            this.headerSend,
            // '',
            // '',
            (frame) => {
                this.stompClient.debug('connected to Socket!!!');
                this.statusConnect.next(true);
                this.subscribePromotion()
                this.subscribeRegister()
                this.subscribeDeposit()
                this.subscribeWithdraw()
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
            const serverUrl = environment.API_WEBPLAYER_MAIN + 'socket';
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
                    this.subscribePromotion()
                    this.subscribeRegister()
                    this.subscribeDeposit()
                    this.subscribeWithdraw()
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



    public subscribePromotion() {
        this.stompClient.subscribe(
            '/admin/notification/promotion',
            (message) => {
                if (message.body) {
                    console.log('body web sock dashboard');
                    console.log(message.body);
                    this.promotionList.next(JSON.parse(message.body));
                }
            },
        );
    }
    public subscribeRegister() {
        this.stompClient.subscribe(
            '/admin/notification/register',
            (message) => {
                if (message.body) {
                    console.log('body web sock dashboard');
                    console.log(message.body);
                    this.registerList.next(JSON.parse(message.body));
                }
            },
        );
    }
    public subscribeDeposit() {
        this.stompClient.subscribe(
            '/admin/notification/deposit',
            (message) => {
                if (message.body) {
                    console.log('body web sock dashboard');
                    console.log(message.body);
                    this.depositList.next(JSON.parse(message.body));
                }
            },
        );
    }
    public subscribeWithdraw() {
        this.stompClient.subscribe(
            '/admin/notification/withdraw',
            (message) => {
                if (message.body) {
                    console.log('body web sock dashboard');
                    console.log(message.body);
                    this.withdrawList.next(JSON.parse(message.body));
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
