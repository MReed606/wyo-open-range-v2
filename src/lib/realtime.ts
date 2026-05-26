import { supabase } from "@/lib/supabase";

// =====================================
// CENTRALIZED REALTIME MANAGER
// =====================================

type Callback = (
  payload?: any
) => void;

class RealtimeManager {

  private channels:
    Record<string, any> = {};

  private listeners:
    Record<
      string,
      Callback[]
    > = {};

  // =====================================
  // SUBSCRIBE
  // =====================================

  subscribe({

    key,

    table,

    event = "*",

    filter,

    callback,

  }: {

    key: string;

    table: string;

    event?: string;

    filter?: string;

    callback: Callback;

  }) {

    // =====================================
    // REGISTER CALLBACK
    // =====================================

    if (
      !this.listeners[key]
    ) {

      this.listeners[key] = [];
    }

    this.listeners[key].push(
      callback
    );

    // =====================================
    // ALREADY EXISTS
    // =====================================

    if (
      this.channels[key]
    ) {

      return;
    }

    // =====================================
    // CREATE CHANNEL
    // =====================================

    const channel =
      supabase.channel(key);

    channel.on(
      "postgres_changes" as any,
      {
        event,
        schema: "public",
        table,
        filter,
      },
      (payload) => {

        this.emit(
          key,
          payload
        );
      }
    );

    channel.subscribe(
      (status) => {

        console.log(
          `[Realtime:${key}]`,
          status
        );
      }
    );

    this.channels[key] =
      channel;
  }

  // =====================================
  // EMIT
  // =====================================

  emit(
    key: string,
    payload?: any
  ) {

    const callbacks =
      this.listeners[key];

    if (!callbacks) {
      return;
    }

    callbacks.forEach(
      (callback) => {

        try {

          callback(payload);

        } catch (error) {

          console.error(
            `[Realtime Emit Error:${key}]`,
            error
          );

        }
      }
    );
  }

  // =====================================
  // UNSUBSCRIBE CALLBACK
  // =====================================

  unsubscribe(
    key: string,
    callback?: Callback
  ) {

    // REMOVE SPECIFIC CALLBACK

    if (
      callback &&
      this.listeners[key]
    ) {

      this.listeners[key] =
        this.listeners[key]
          .filter(
            (cb) =>
              cb !== callback
          );
    }

    // REMOVE ENTIRE CHANNEL

    if (
      !callback ||

      !this.listeners[key]
        ?.length
    ) {

      const channel =
        this.channels[key];

      if (channel) {

        supabase.removeChannel(
          channel
        );
      }

      delete this.channels[key];

      delete this.listeners[key];

      console.log(
        `[Realtime Removed:${key}]`
      );
    }
  }

  // =====================================
  // REMOVE ALL
  // =====================================

  cleanup() {

    Object.keys(
      this.channels
    ).forEach((key) => {

      supabase.removeChannel(
        this.channels[key]
      );

    });

    this.channels = {};

    this.listeners = {};
  }

  // =====================================
  // DEBUG
  // =====================================

  getActiveChannels() {

    return Object.keys(
      this.channels
    );
  }
}

// =====================================
// SINGLETON
// =====================================

export const realtime =
  new RealtimeManager();