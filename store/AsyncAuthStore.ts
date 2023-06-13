import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseAuthStore, Record, Admin } from "pocketbase";

export class AsyncAuthStore extends BaseAuthStore {
  storageKey: string;
  queue: (() => Promise<void>)[];

  constructor(storageKey = "pb_auth") {
    super();

    this.storageKey = storageKey;
    this.queue = [];

    this._enqueue(async () => {
      const raw = await AsyncStorage.getItem(this.storageKey);
      if (raw) {
        const decoded = JSON.parse(raw);
        this.save(decoded.token, decoded.model);
      }
    });
  }

  save(token: string, model: Record | Admin | null) {
    super.save(token, model);

    this._enqueue(() => {
      return AsyncStorage.setItem(
        this.storageKey,
        JSON.stringify({ token, model })
      );
    });
  }

  clear() {
    super.clear();

    this._enqueue(() => {
      return AsyncStorage.removeItem(this.storageKey);
    });
  }

  /**
   * Appends an async function to the queue.
   */
  _enqueue(asyncCallback: () => Promise<void>) {
    this.queue.push(asyncCallback);

    if (this.queue.length === 1) {
      this._dequeue();
    }
  }

  /**
   * Starts the queue processing.
   */
  _dequeue() {
    if (!this.queue.length) {
      return;
    }

    this.queue[0]().finally(() => {
      this.queue.shift();

      if (!this.queue.length) {
        return;
      }

      this._dequeue();
    });
  }
}
