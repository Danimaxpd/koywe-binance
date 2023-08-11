import { SignalObserver } from "../interfaces/signal-observer";
import { TradingStrategy } from "../interfaces/trading-strategy";

export class SignalProvider {
  private observers: SignalObserver[] = [];

  subscribe(observer: SignalObserver): void {
    this.observers.push(observer);
  }

  emitSignal(signal: string, strategy: TradingStrategy): void {
    console.log(`Signal received: ${signal}`);
    this.notifyObservers(signal, strategy);
  }

  private notifyObservers(signal: string, strategy: TradingStrategy): void {
    for (const observer of this.observers) {
      observer.updateSignal(signal, strategy);
    }
  }
}
