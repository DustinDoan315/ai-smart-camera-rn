import CameraView from '@/ui/components/Camera/CameraView';
import React, { useEffect, useRef, useState } from 'react';
import { CameraView as ExpoCameraView } from 'expo-camera';
import {
    Pressable,
    StyleSheet,
    Text,
    View
    } from 'react-native';
import { useEnsureCameraPermission } from '@/services/permissions/camera';


export default function CameraScreen() {
  const { granted, canAskAgain, requestPermission } = useEnsureCameraPermission();
  const cameraRef = useRef<ExpoCameraView>(null);
  const [facing, setFacing] = useState<"front" | "back">("back");

  useEffect(() => {
    // auto ask when first open
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
          <Text style={styles.desc}>
            Permission is denied. Please enable Camera access in Settings.
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} facing={facing} />

      {/* Simple overlay controls */}
      <View style={styles.topHud}>
        <Text style={styles.hudText}>AI Smart Camera</Text>
      </View>

      <View style={styles.bottomBar}>
        <Pressable
          style={styles.btn}
          onPress={() => setFacing((p) => (p === "back" ? "front" : "back"))}
        >
          <Text style={styles.btnText}>Flip</Text>
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
  topHud: { position: "absolute", top: 12, left: 12 },
  hudText: { color: "white" },
  bottomBar: { position: "absolute", bottom: 24, width: "100%", alignItems: "center" },
});
