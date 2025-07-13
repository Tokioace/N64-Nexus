import React, { createContext, useContext, useState } from 'react';
import { MediaSubmission, CameraSettings, VideoSettings } from '../types';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';
import * as Location from 'expo-location';

interface MediaContextType {
  currentSubmission: MediaSubmission | null;
  cameraSettings: CameraSettings;
  videoSettings: VideoSettings;
  updateCameraSettings: (settings: Partial<CameraSettings>) => void;
  updateVideoSettings: (settings: Partial<VideoSettings>) => void;
  createSubmission: (
    type: 'screenshot' | 'video',
    fileUri: string,
    eventId: string,
    userId: string,
    platform: 'PAL' | 'NTSC'
  ) => Promise<MediaSubmission>;
  addWatermark: (imageUri: string, watermarkText: string) => Promise<string>;
  generateHash: (fileUri: string) => Promise<string>;
  submitMedia: (submission: MediaSubmission) => Promise<boolean>;
  getSubmissionStatus: (submissionId: string) => Promise<'pending' | 'approved' | 'rejected'>;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSubmission, setCurrentSubmission] = useState<MediaSubmission | null>(null);
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({
    quality: 'high',
    flash: 'auto',
    focus: 'on',
    whiteBalance: 'auto',
  });
  const [videoSettings, setVideoSettings] = useState<VideoSettings>({
    quality: 'high',
    maxDuration: 60,
    audio: true,
    stabilization: true,
  });

  const updateCameraSettings = (settings: Partial<CameraSettings>) => {
    setCameraSettings(prev => ({ ...prev, ...settings }));
  };

  const updateVideoSettings = (settings: Partial<VideoSettings>) => {
    setVideoSettings(prev => ({ ...prev, ...settings }));
  };

  const generateHash = async (fileUri: string): Promise<string> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }
      
      // Read file as base64 and generate hash
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        base64
      );
      
      return hash;
    } catch (error) {
      console.error('Error generating hash:', error);
      throw error;
    }
  };

  const addWatermark = async (imageUri: string, watermarkText: string): Promise<string> => {
    try {
      // TODO: Implement actual watermarking
      // For now, we'll just return the original URI
      // In a real implementation, you would use a library like react-native-image-watermark
      console.log('Adding watermark:', watermarkText, 'to image:', imageUri);
      return imageUri;
    } catch (error) {
      console.error('Error adding watermark:', error);
      throw error;
    }
  };

  const createSubmission = async (
    type: 'screenshot' | 'video',
    fileUri: string,
    eventId: string,
    userId: string,
    platform: 'PAL' | 'NTSC'
  ): Promise<MediaSubmission> => {
    try {
      const timestamp = new Date();
      const hash = await generateHash(fileUri);
      
      // Get device info
      const deviceInfo = `${Device.brand} ${Device.modelName} (${Device.osVersion})`;
      
      // Get location if permission granted
      let location = undefined;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const currentLocation = await Location.getCurrentPositionAsync({});
          location = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          };
        }
      } catch (error) {
        console.log('Location permission denied or error:', error);
      }

      // Create watermark text
      const watermarkText = `Battle64 Event - ${timestamp.toLocaleDateString('de-DE')} - ${timestamp.toLocaleTimeString('de-DE')}`;
      
      // Add watermark to image/video
      const watermarkedUri = await addWatermark(fileUri, watermarkText);

      const submission: MediaSubmission = {
        id: Date.now().toString(),
        userId,
        eventId,
        type,
        fileUri: watermarkedUri,
        timestamp,
        metadata: {
          platform,
          deviceInfo,
          location,
          hash,
        },
        watermark: {
          text: watermarkText,
          position: 'bottom-right',
        },
        status: 'pending',
      };

      setCurrentSubmission(submission);
      return submission;
    } catch (error) {
      console.error('Error creating submission:', error);
      throw error;
    }
  };

  const submitMedia = async (submission: MediaSubmission): Promise<boolean> => {
    try {
      // TODO: Implement actual API submission
      console.log('Submitting media:', submission);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update submission status
      const updatedSubmission = { ...submission, status: 'pending' as const };
      setCurrentSubmission(updatedSubmission);
      
      return true;
    } catch (error) {
      console.error('Error submitting media:', error);
      return false;
    }
  };

  const getSubmissionStatus = async (submissionId: string): Promise<'pending' | 'approved' | 'rejected'> => {
    try {
      // TODO: Implement actual API call
      // For now, return a mock status
      return 'pending';
    } catch (error) {
      console.error('Error getting submission status:', error);
      return 'pending';
    }
  };

  const value: MediaContextType = {
    currentSubmission,
    cameraSettings,
    videoSettings,
    updateCameraSettings,
    updateVideoSettings,
    createSubmission,
    addWatermark,
    generateHash,
    submitMedia,
    getSubmissionStatus,
  };

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  );
};