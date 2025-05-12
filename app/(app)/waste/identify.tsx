import React, { useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useUser } from '@/context/UserContext';
import useWasteCable from '@/hooks/useWasteCable';

import {
  AI_MODEL_API_URL,
  api,
} from '../../../utils/api';

interface WastePrediction {
  types?: string[];
  image?: string; // base64 string (detected image)
}

export default function IdentifyScreen() {
  const { user } = useUser();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [detectedImageUrl, setDetectedImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useWasteCable(user?.id ?? 0, (newWaste) => {
    console.log('♻️ New waste detected from cable:', newWaste);
    // Bạn có thể xử lý thêm: push vào state, hiển thị toast, v.v.
  });

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      setImageUri(result.assets[0].uri);
      identifyImage(result.assets[0].base64);
    }
  };

  const identifyImage = async (base64Image: string) => {
    setProcessing(true);
    setError(null);
    setResult(null);
    setDetectedImageUrl(null);

    try {
      const response = await api.post(`${AI_MODEL_API_URL}/predict`, {
      image: `data:image/jpeg;base64,${base64Image}`,
      });

      const data: WastePrediction = response.data;

      setResult(data.types?.[0] || 'Unknown');
      setDetectedImageUrl(data.image || null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing the image.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📷 Waste Identifier</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadText}>Upload from Gallery</Text>
      </TouchableOpacity>

      {processing && <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 16 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {imageUri && (
        <View style={styles.imageBlock}>
          <Text style={styles.subTitle}>🖼 Original Image</Text>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        </View>
      )}

      {detectedImageUrl && (
        <View style={styles.imageBlock}>
          <Text style={styles.subTitle}>✅ Detected Image</Text>
          <Image source={{ uri: detectedImageUrl }} style={styles.image} resizeMode="contain" />
        </View>
      )}

      {result && (
        <View style={styles.resultBlock}>
          <Text style={styles.subTitle}>♻️ Waste Type</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  uploadButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  uploadText: { color: 'white', fontWeight: 'bold' },
  imageBlock: { marginTop: 20, width: '100%' },
  subTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  image: { width: '100%', height: 250, borderRadius: 8 },
  resultBlock: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  resultText: { fontSize: 20, fontWeight: 'bold', color: '#16a34a', marginTop: 8 },
  error: { color: 'red', marginTop: 12 },
});
