import CameraView from '@/ui/components/Camera/CameraView';
import PerfHUD from '@/ui/components/HUD/PerfHUD';
import React, { useEffect, useRef, useState } from 'react';
import { CameraView as ExpoCameraView } from 'expo-camera';
import {
    Pressable,
    StyleSheet,
    Text,
    View
    } from 'react-native';
import { useEnsureCameraPermission } from '@/services/permissions/camera';
import { useFrameLoop } from './useFrameLoop';
import { useRuntimeStore } from '@/state/runtimeStore';


export default function CameraScreen() {
  const { granted, canAskAgain, requestPermission } = useEnsureCameraPermission();
  const cameraRef = useRef<ExpoCameraView>(null);
  const [facing, setFacing] = useState<"front" | "back">("back");

  const isRunning = useRuntimeStore((s) => s.isRunning);
  const setRunning = useRuntimeStore((s) => s.setRunning);
  const reset = useRuntimeStore((s) => s.reset);


  useFrameLoop({ intervalMs: 250, workMs: 20 });

  useEffect(() => {
    if (!granted) requestPermission();
  }, [granted, requestPermission]);

  if (!granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Camera permission required</Text>
        {canAskAgain ? (
          <Pressable style={styles.btn} onPress={requestPermission}>
            <Text style={styles.btnText}>Grant permission</Text>
          </Pressable>
        ) : (
          <Text style={styles.desc}>Enable Camera access in Settings.</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} facing={facing} />

      <PerfHUD />

      <View style={styles.bottomBar}>
        <Pressable
          style={styles.btn}
          onPress={() => setFacing((p) => (p === "back" ? "front" : "back"))}
        >
          <Text style={styles.btnText}>Flip</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={() => setRunning(!isRunning)}>
          <Text style={styles.btnText}>{isRunning ? "Pause" : "Run"}</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={reset}>
          <Text style={styles.btnText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 18, marginBottom: 10 },
  desc: { textAlign: "center", opacity: 0.7 },
  btn: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: "#222", borderRadius: 10 },
  btnText: { color: "white", fontWeight: "600" },
  bottomBar: {
    position: "absolute",
    bottom: 24,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
});
