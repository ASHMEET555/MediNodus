import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ImageEditor } from 'expo-dynamic-image-crop';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useThemeColor } from '../hooks/use-theme-color';
import { IconSymbol } from '../components/ui/icon-symbol';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CapturedImage {
  id: string;
  uri: string;
  timestamp: number;
}

interface CropResult {
  uri: string;
}

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempUri, setTempUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');

  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, 'background');
  const tintColor = useThemeColor({ light: Colors.light.tint, dark: Colors.dark.tint }, 'tint');
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, 'text');
  const surfaceColor = useThemeColor({ light: Colors.light.surface, dark: Colors.dark.surface }, 'surface');
  const cardBackgroundColor = useThemeColor({ light: Colors.light.cardBackground, dark: Colors.dark.cardBackground }, 'cardBackground');
  const dangerColor = useThemeColor({ light: Colors.light.danger, dark: Colors.dark.danger }, 'danger');
  const successColor = useThemeColor({ light: Colors.light.success, dark: Colors.dark.success }, 'success');

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission?.granted, requestPermission]);

  if (!permission) {
    return <ThemedView style={styles.container}><ActivityIndicator size="large" color={tintColor} /></ThemedView>;
  }

  if (!permission.granted) {
    return <ThemedView style={styles.container}><ThemedText style={styles.permissionText}>Camera permission required</ThemedText><TouchableOpacity style={[styles.button, { backgroundColor: tintColor }]} onPress={requestPermission}><ThemedText style={styles.buttonText}>Grant Permission</ThemedText></TouchableOpacity></ThemedView>;
  }

  const handleCapture = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (!cameraRef.current) { Alert.alert('Error', 'Camera ref not available'); return; }
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85, skipProcessing: false });
      if (photo?.uri) {
        setCapturedImages([...capturedImages, { id: `img_${Date.now()}`, uri: photo.uri, timestamp: Date.now() }]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Capture Error', 'Failed to capture photo');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleDeleteImage = (id: string) => {
    Alert.alert('Delete Photo', 'Remove this photo?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: () => { setCapturedImages(capturedImages.filter(img => img.id !== id)); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }, style: 'destructive' },
    ]);
  };

  const handleStartCrop = (index: number, uri: string) => {
    setEditingIndex(index);
    setTempUri(uri);
    setIsCropping(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCropSuccess = (croppedUri: string) => {
    if (editingIndex !== null) {
      const updated = [...capturedImages];
      updated[editingIndex] = { ...updated[editingIndex], uri: croppedUri };
      setCapturedImages(updated);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setIsCropping(false);
    setEditingIndex(null);
    setTempUri(null);
  };

  const handleSubmit = async () => {
    if (capturedImages.length === 0) {
      Alert.alert('No Photos', 'Capture at least one photo');
      return;
    }
    try {
      setIsLoading(true);
      const batch = { id: `batch_${Date.now()}`, images: capturedImages, createdAt: new Date().toISOString() };
      await AsyncStorage.setItem('currentImageBatch', JSON.stringify(batch));
      router.push({ pathname: '/reports/analysis', params: { batchId: batch.id, imageCount: capturedImages.length.toString() } });
    } catch (error) {
      Alert.alert('Submit Error', 'Failed to save photos');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReviewing) {
    return <ThemedView style={[styles.container, { backgroundColor }]}><CameraView ref={cameraRef} style={styles.camera} facing={cameraFacing} /><View style={[styles.absoluteOverlay, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}><View style={styles.topBar}><TouchableOpacity style={[styles.iconButton, { backgroundColor: `${surfaceColor}99` }]} onPress={() => setCameraFacing(cameraFacing === 'back' ? 'front' : 'back')}><IconSymbol name="camera.rotate" size={20} color={tintColor} /></TouchableOpacity><TouchableOpacity style={[styles.iconButton, { backgroundColor: `${surfaceColor}99` }]} onPress={() => router.back()}><IconSymbol name="xmark" size={20} color={textColor} /></TouchableOpacity></View><View style={[styles.focusFrame, { borderColor: tintColor }]}><View style={[styles.corner, styles.topLeft, { borderTopColor: tintColor, borderLeftColor: tintColor }]} /><View style={[styles.corner, styles.topRight, { borderTopColor: tintColor, borderRightColor: tintColor }]} /><View style={[styles.corner, styles.bottomLeft, { borderBottomColor: tintColor, borderLeftColor: tintColor }]} /><View style={[styles.corner, styles.bottomRight, { borderBottomColor: tintColor, borderRightColor: tintColor }]} /></View><View style={styles.bottomBar}><View style={[styles.counterBadge, { backgroundColor: tintColor }]}><ThemedText style={styles.counterText}>{capturedImages.length}</ThemedText></View><TouchableOpacity style={[styles.captureButton, { backgroundColor: tintColor }]} onPress={handleCapture} activeOpacity={0.7}><View style={styles.captureInner} /></TouchableOpacity><TouchableOpacity style={[styles.doneButton, { backgroundColor: successColor }]} onPress={() => { if (capturedImages.length === 0) { Alert.alert('No Photos'); return; } setIsReviewing(true); }}><IconSymbol name="checkmark" size={20} color="#fff" /></TouchableOpacity></View>{capturedImages.length > 0 && <TouchableOpacity style={[styles.thumbnailButton, { backgroundColor: `${cardBackgroundColor}dd` }]} onPress={() => setIsReviewing(true)}><Image source={{ uri: capturedImages[capturedImages.length - 1].uri }} style={styles.thumbnail} /><View style={[styles.photoIconOverlay, { backgroundColor: `${tintColor}aa` }]}><IconSymbol name="photo" size={12} color="#fff" /></View></TouchableOpacity>}</View></ThemedView>;
  }

  return <ThemedView style={[styles.container, { backgroundColor }]}><SafeAreaView style={[styles.reviewHeader, { backgroundColor: cardBackgroundColor }]}><TouchableOpacity onPress={() => setIsReviewing(false)}><IconSymbol name="arrow.left" size={20} color={tintColor} /></TouchableOpacity><ThemedText style={styles.reviewTitle}>Review ({capturedImages.length})</ThemedText><View style={{ width: 20 }} /></SafeAreaView><ScrollView style={styles.reviewScroll} contentContainerStyle={styles.reviewContent}>{capturedImages.map((image, index) => <View key={image.id} style={[styles.imageCard, { backgroundColor: cardBackgroundColor }]}><Image source={{ uri: image.uri }} style={styles.reviewImage} /><View style={[styles.imageIndexBadge, { backgroundColor: `${tintColor}dd` }]}><ThemedText style={styles.indexText}>{index + 1}</ThemedText></View><View style={styles.imageActions}><TouchableOpacity style={[styles.actionButton, { backgroundColor: `${dangerColor}cc` }]} onPress={() => handleDeleteImage(image.id)}><IconSymbol name="trash" size={16} color="#fff" /><ThemedText style={styles.actionButtonText}>Delete</ThemedText></TouchableOpacity><TouchableOpacity style={[styles.actionButton, { backgroundColor: `${tintColor}cc` }]} onPress={() => handleStartCrop(index, image.uri)}><IconSymbol name="crop" size={16} color="#fff" /><ThemedText style={styles.actionButtonText}>Crop</ThemedText></TouchableOpacity></View></View>)}</ScrollView><SafeAreaView style={[styles.reviewFooter, { backgroundColor: cardBackgroundColor }]}><TouchableOpacity style={[styles.footerButton, { backgroundColor: dangerColor }]} onPress={() => setIsReviewing(false)}><ThemedText style={styles.footerButtonText}>Back</ThemedText></TouchableOpacity><TouchableOpacity style={[styles.footerButton, { backgroundColor: successColor }]} onPress={handleSubmit} disabled={isLoading}>{isLoading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.footerButtonText}>Submit ({capturedImages.length})</ThemedText>}</TouchableOpacity></SafeAreaView>{isCropping && tempUri && <Modal visible={isCropping} animationType="fade"><ImageEditor imageUri={tempUri} onEditingComplete={(result: CropResult) => { if (result?.uri) handleCropSuccess(result.uri); }} onEditingCancel={() => { setIsCropping(false); setEditingIndex(null); setTempUri(null); }} /></Modal>}</ThemedView>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  absoluteOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between', pointerEvents: 'box-none' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, pointerEvents: 'auto' },
  iconButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  focusFrame: { position: 'absolute', top: '15%', left: '10%', right: '10%', height: screenHeight * 0.5, borderWidth: 2, borderRadius: 20, pointerEvents: 'none' },
  corner: { position: 'absolute', width: 30, height: 30, borderWidth: 3 },
  topLeft: { top: 2, left: 2 },
  topRight: { top: 2, right: 2 },
  bottomLeft: { bottom: 2, left: 2 },
  bottomRight: { bottom: 2, right: 2 },
  bottomBar: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, pointerEvents: 'auto', gap: 16 },
  counterBadge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, minWidth: 40, justifyContent: 'center', alignItems: 'center' },
  counterText: { fontWeight: '600', fontSize: 14, color: '#fff' },
  captureButton: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)' },
  captureInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.9)' },
  doneButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  thumbnailButton: { position: 'absolute', bottom: 100, left: 16, width: 70, height: 70, borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  thumbnail: { width: '100%', height: '100%' },
  photoIconOverlay: { position: 'absolute', bottom: 4, right: 4, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  reviewTitle: { fontSize: 18, fontWeight: '600' },
  reviewScroll: { flex: 1 },
  reviewContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  imageCard: { borderRadius: 12, overflow: 'hidden', marginBottom: 8 },
  reviewImage: { width: '100%', height: 200 },
  imageIndexBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  indexText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  imageActions: { flexDirection: 'row', gap: 8, padding: 12 },
  actionButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 8, gap: 6 },
  actionButtonText: { color: '#fff', fontWeight: '500', fontSize: 12 },
  reviewFooter: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' },
  footerButton: { flex: 1, paddingVertical: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  footerButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  permissionText: { marginBottom: 20, textAlign: 'center', paddingHorizontal: 20 },
  button: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
