import * as React from "react";
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import { useEffect } from "react";
import { Platform } from "react-native";

export function useOnlineManager() {
  useEffect(() => {
    if (Platform.OS !== "web") {
      return NetInfo.addEventListener((state) => {
        const isOnline =
          state.isConnected != null &&
          state.isConnected &&
          Boolean(state.isInternetReachable);

        onlineManager.setOnline(isOnline);
      });
    }
  }, []);
}
