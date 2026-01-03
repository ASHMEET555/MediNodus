import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  BackHandler,
  Dimensions,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, FlashMode } from 'expo-camera';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';

// Custom Package for free-form cropping
import { ImageEditor } from 'expo-dynamic-image-crop';

// Themed Components
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { Colors } from '../constants/theme';
import { useThemeColor } from '../hooks/use-theme-color';
import { IconSymbol } from '../components/ui/icon-symbol';
import { Slider } from '@miblanchard/react-native-slider'; 


interface CapturedImage {
  id: string;
  uri: string;
  timestamp: number;
}


 
export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // States
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [flash, setFlash] = useState<FlashMode>('off');
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | undefined>(undefined);

  // Theme Colors
  const tintColor = useThemeColor({ light: Colors.light.tint, dark: Colors.dark.tint }, 'tint');
  const surfaceColor = useThemeColor({ light: Colors.light.surface, dark: Colors.dark.surface }, 'surface');
  const dangerColor = useThemeColor({ light: Colors.light.danger, dark: Colors.dark.danger }, 'danger');
  const successColor = useThemeColor({ light: Colors.light.success, dark: Colors.dark.success }, 'success');

  // Handle Hardware Back Button
  useEffect(() => {
    const backAction = () => {
      if (isCropping) {
        setIsCropping(false);
        return true;
      }
      if (isReviewing) {
        setIsReviewing(false);
        return true;
      }
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [isReviewing, isCropping]);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  // --- Handlers ---

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo) {
        setCapturedImages(prev => [...prev, { 
          id: Date.now().toString(), 
          uri: photo.uri, 
          timestamp: Date.now() 
        }]);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handleStartCrop = (index: number) => {
    setEditingIndex(index);
    setIsCropping(true);
  };

  const onCropDone = (uri: string) => {
    if (editingIndex !== null) {
      const updated = [...capturedImages];
      updated[editingIndex].uri = uri;
      setCapturedImages(updated);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setIsCropping(false);
    setEditingIndex(null);
  };

  const handleDeleteImage = (id: string) => {
    Alert.alert('Delete Photo', 'Remove this photo?', [
      { text: 'Cancel' },
      { 
        text: 'Delete', 
        onPress: () => { 
          const updatedImages = capturedImages.filter(img => img.id !== id);
          setCapturedImages(updatedImages); 
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (updatedImages.length === 0) setIsReviewing(false);
        }, 
        style: 'destructive' 
      },
    ]);
  };

  const handleTapToFocus = async (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    
    // Calculate point for the camera (normalized 0 to 1)
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    
    setFocusPoint({
      x: locationX / screenWidth,
      y: locationY / screenHeight,
    });

    // Reset focus indicator after a second
    setTimeout(() => setFocusPoint(undefined), 1000);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('scanned_images', JSON.stringify(capturedImages));
      router.push('/reports/analysis');
    } catch (e) {
      Alert.alert("Error", "Save failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.permissionText}>Camera permission is required.</ThemedText>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: tintColor }]} onPress={requestPermission}>
          <ThemedText style={{ color: '#fff' }}>Grant Permission</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // 1. Camera Interface

  if (!isReviewing) {
    return (
      <View style={[styles.container, { backgroundColor: '#000' }]}>
        
         <TouchableOpacity 
          activeOpacity={1} 
          style={StyleSheet.absoluteFill} 
          onPress={handleTapToFocus}
        >
          <CameraView 
            ref={cameraRef} 
            style={StyleSheet.absoluteFill} 
            flash={flash}
            facing="back"
            zoom={zoom} // Apply Zoom
            autofocus="on" // Ensure AF is on
          />
        </TouchableOpacity>
        
        {/* Corrected Focus Indicator (keep this as is) */}
        {focusPoint && (
          <View 
            style={[
              styles.focusIndicator, 
              { 
                top: `${focusPoint.y * 100}%` as any, 
                left: `${focusPoint.x * 100}%` as any 
              }
            ]} 
          />
        )}

        {/* --- NEW ZOOM CONTROLS WRAPPER --- */}
        {/* Changed bottom offset from 120 to 160 to move it up */}
        <View style={[styles.zoomControlsWrapper, { bottom: insets.bottom + 160 }]}>
          {/* Added Label Label */}
          <ThemedText style={styles.zoomLabelText}>Zoom</ThemedText>
          
          {/* Existing Slider Container (styles modified below) */}
          <View style={styles.zoomSliderContainer}>
            <IconSymbol name="minus" size={14} color="#fff" />
            <View style={{ flex: 1, marginHorizontal: 10, height: 40 }}>
            <Slider
              minimumValue={0}
              maximumValue={0.5} // Capped at 0.5 for better quality on most phones
              value={zoom}
              onValueChange={(val) => setZoom(Array.isArray(val) ? val[0] : val)}
              minimumTrackTintColor={tintColor}
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor="#fff"
            />
            </View>
            <IconSymbol name="plus" size={14} color="#fff" />
          </View>
        </View>



        <View style={[styles.overlayTop, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.roundBtn}>
            <IconSymbol name='chevron.left' size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFlash(f => f === 'off' ? 'on' : 'off')} style={styles.roundBtn}>
            <IconSymbol name={flash === 'on' ? 'bolt.fill' : 'bolt.slash.fill'} size={24} color={flash === 'on' ? "#FFD700" : "#fff"} />
          </TouchableOpacity>
        </View>

        <View style={[styles.overlayBottom, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity 
            style={styles.previewThumbnail} 
            onPress={() => capturedImages.length > 0 && setIsReviewing(true)}
          >
            {capturedImages.length > 0 ? (
              <Image source={{ uri: capturedImages[capturedImages.length - 1].uri }} style={styles.full} />
            ) : (
              <View style={[styles.full, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            )}
            {capturedImages.length > 0 && (
              <View style={styles.badge}><ThemedText style={styles.badgeText}>{capturedImages.length}</ThemedText></View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCapture} style={styles.captureBtn}>
            <View style={styles.captureInternal} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.doneBtn, { opacity: capturedImages.length > 0 ? 1 : 0.5 }]} 
            onPress={() => capturedImages.length > 0 && setIsReviewing(true)}
          >
            <IconSymbol name="checkmark" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2. Review Interface
  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsReviewing(false)}>
          <IconSymbol name="camera" size={24} color={tintColor} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Review Scans</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollList}>
        {capturedImages.map((img, idx) => (
          <View key={img.id} style={[styles.card, { backgroundColor: surfaceColor }]}>
            <Image source={{ uri: img.uri }} style={styles.cardImg} contentFit="contain" />
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleStartCrop(idx)}>
                <IconSymbol name="crop" size={18} color={tintColor} />
                <ThemedText style={{ color: tintColor, marginLeft: 5 }}>Crop</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteImage(img.id)}>
                <IconSymbol name="trash" size={18} color={dangerColor} />
                <ThemedText style={{ color: dangerColor, marginLeft: 5 }}>Delete</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* FOOTER: Fixed Overlap with Safe Area */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity 
          style={[
            styles.submitBtn, 
            { 
              backgroundColor: successColor, 
              opacity: (isLoading || capturedImages.length === 0) ? 0.5 : 1 
            }
          ]} 
          onPress={handleSubmit} 
          disabled={isLoading || capturedImages.length === 0}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.submitText}>
              Submit ({capturedImages.length})
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>

      {/* --- DYNAMIC CROPPER MODAL --- */}
      {isCropping && editingIndex !== null && (
        <ImageEditor
          isVisible={isCropping}
          imageUri={capturedImages[editingIndex].uri}
          dynamicCrop={true} // This enables corner-dragging
          onEditingComplete={(res) => onCropDone(res.uri)}
          onEditingCancel={() => {
            setIsCropping(false);
            setEditingIndex(null);
          }}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  full: { width: '100%', height: '100%' },
  // Camera UI
  overlayTop: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  overlayBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  roundBtn: { width: 45, height: 45, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  captureBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  captureInternal: { width: 65, height: 65, borderRadius: 35, backgroundColor: '#fff' },
  previewThumbnail: { width: 60, height: 60, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: '#fff' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  doneBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  // Review UI
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollList: { padding: 16 },
  card: { marginBottom: 20, borderRadius: 15, overflow: 'hidden', elevation: 3, shadowOpacity: 0.1 },
  cardImg: { width: '100%', height: 350, backgroundColor: '#000' },
  cardActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  actionBtn: { flex: 1, flexDirection: 'row', padding: 12, justifyContent: 'center', alignItems: 'center' },
  // Bottom Footer Area
  footer: { paddingHorizontal: 16, paddingTop: 10 },
  submitBtn: { padding: 18, borderRadius: 15, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  permissionText: { textAlign: 'center', marginBottom: 20 },
  primaryButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  focusIndicator: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 30,
    transform: [{ translateX: -30 }, { translateY: -30 }], // Center on tap
  },
  zoomControlsWrapper: {
    position: 'absolute',
    left: 50, // Added side margins so it doesn't hit screen edges
    right: 50,
    alignItems: 'center', // Centers the text above the slider
    // 'bottom' is set inline in the JSX using insets
  },
  zoomLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4, // Spacing between text and slider background
    // Optional shadow for better readability against camera feed
    textShadowColor: 'rgba(0, 0, 0, 0.5)', 
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  zoomSliderContainer: {
    // REMOVED: position: 'absolute', left, right, bottom (handled by wrapper now)
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 15,
    borderRadius: 30,
    height: 45,
    width: '100%', // Ensure it fills the wrapper width
  }
});