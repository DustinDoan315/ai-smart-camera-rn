import React, { forwardRef } from 'react';
import { CameraView as ExpoCameraView } from 'expo-camera';
import { StyleSheet, ViewStyle } from 'react-native';


type Props = {
  style?: ViewStyle;
  facing?: "front" | "back";
};

const CameraView = forwardRef<ExpoCameraView, Props>(({ style, facing = "back" }, ref) => {
  return <ExpoCameraView ref={ref} style={[styles.camera, style]} facing={facing} />;
});

const styles = StyleSheet.create({
  camera: { flex: 1 },
});

export default CameraView;
