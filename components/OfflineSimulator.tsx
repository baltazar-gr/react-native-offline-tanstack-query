import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { onlineManager } from "@tanstack/react-query";

const OfflineSimulator = () => {
  const isOnline = onlineManager.isOnline();

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
