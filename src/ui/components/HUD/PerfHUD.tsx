import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRuntimeStore } from '@/state/runtimeStore';


export default function PerfHUD() {
  const m = useRuntimeStore((s) => s.metrics);

  return (
    <View style={styles.box}>
      <Text style={styles.text}>FPS: {m.fps}</Text>
      <Text style={styles.text}>Avg: {m.avgLatencyMs} ms</Text>
      <Text style={styles.text}>P95: {m.p95LatencyMs} ms</Text>
      <Text style={styles.text}>Frames: {m.framesProcessed}</Text>
      <Text style={styles.text}>Dropped: {m.droppedFrames}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 12,
  },
  text: { color: "white", fontSize: 12 },
});
