import { useCameraPermissions } from 'expo-camera';

export function useEnsureCameraPermission() {
    const [permission, requestPermission] = useCameraPermissions();

    const granted = !!permission?.granted;
    const canAskAgain = permission?.canAskAgain ?? true;

    return { permission, granted, canAskAgain, requestPermission };
}
