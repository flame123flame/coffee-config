import { StompService, StompConfig, StompState } from "@stomp/ng2-stompjs";
import { Message } from "@stomp/stompjs";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { environment } from 'src/environments/environment';
import { SocketConfig } from "../config/socket.config";

const BROKER_URL = {
  DASHBOARD: "/dashboard",
  DASHBOARD_SUM: "/dashboard/sum",
}
export class SocketBeansService {

  private readonly serverUrl = environment.API_BEAN_SOCKET;
  private messagesDashboardSum: Observable<Message>;
  public dashBoardList = new Subject<any>();
  private stompService: StompService;

  constructor() {
    const stompConfig = SocketConfig.getConfig(this.serverUrl);

    // Create Stomp Service
    this.stompService = new StompService(stompConfig);

    this.subscribeDashBoard();
    this.subscribeDashBoardSum();
  }

  private subscribeDashBoard(): void {
    // Connect to a Stream
    this.stompService.subscribe(BROKER_URL.DASHBOARD).subscribe(
      (message) => {
        this.dashBoardList.next(JSON.parse(message.body));
      }
    );
  }

  private subscribeDashBoardSum(): void {
    // Connect to a Stream
    // this.messagesDashboardSum = 
    this.messagesDashboardSum = this.stompService
      .subscribe(BROKER_URL.DASHBOARD_SUM);
  }

  public streamDashboardSum(): Observable<Message> {
    return this.messagesDashboardSum;
  }

  public send(url: string, message: any) {
    return this.stompService.publish(url, JSON.stringify(message));
  }

  public state(): BehaviorSubject<StompState> {
    return this.stompService.state;
  }

  public disconnect() {
    this.stompService.disconnect();
  }
}
