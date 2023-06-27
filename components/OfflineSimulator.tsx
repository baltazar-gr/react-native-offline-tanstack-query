import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";

const OfflineSimulator = () => {
  const [isOnline, setOnline] = useState(onlineManager.isOnline());

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      const status =
        state.isConnected != null &&
        state.isConnected &&
        Boolean(state.isInternetReachable);
      setOnline(status);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>
        Status is:{" "}
        <Text style={styles.status}>{isOnline ? "ONLINE" : "OFFLINE"}</Text>
      </Text>
    </View>
  );
};

export default OfflineSimulator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    padding: 20,
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    paddingBottom: 20,
  },
  status: {
    color: "red",
  },
});
