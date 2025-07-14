"""
Battle64 Screenshot Verification System
Handles image authenticity, OCR, EXIF analysis, and platform classification
"""

import cv2
import numpy as np
import pytesseract
from PIL import Image
import exifread
import os
import json
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime
import logging

@dataclass
class VerificationResult:
    """Result of screenshot verification"""
    is_authentic: bool
    confidence: float
    detected_time: Optional[str] = None
    platform: Optional[str] = None
    game_title: Optional[str] = None
    issues: List[str] = None
    exif_data: Dict = None

class ScreenshotVerifier:
    """Main class for screenshot verification and analysis"""
    
    def __init__(self, game_database_path: str = "data/game_database.json"):
        self.game_database = self._load_game_database(game_database_path)
        self.logger = logging.getLogger(__name__)
        
        # Configure Tesseract for better OCR
        pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
        
    def _load_game_database(self, path: str) -> Dict:
        """Load game database with reference images and metadata"""
        try:
            with open(path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            self.logger.warning(f"Game database not found at {path}, using empty database")
            return {}
    
    def verify_screenshot(self, image_path: str, event_id: str) -> VerificationResult:
        """
        Main verification method for screenshots
        
        Args:
            image_path: Path to the screenshot
            event_id: ID of the event this screenshot belongs to
            
        Returns:
            VerificationResult with all verification data
        """
        try:
            # Load and preprocess image
            image = cv2.imread(image_path)
            if image is None:
                return VerificationResult(
                    is_authentic=False,
                    confidence=0.0,
                    issues=["Could not load image"]
                )
            
            # Extract EXIF data
            exif_data = self._extract_exif_data(image_path)
            
            # Perform OCR for time extraction
            detected_time = self._extract_time_from_image(image)
            
            # Classify platform (NTSC, PAL, Emulator)
            platform = self._classify_platform(image)
            
            # Verify game authenticity
            game_title, authenticity_score = self._verify_game_authenticity(image, event_id)
            
            # Check for common issues
            issues = self._check_for_issues(image, exif_data, detected_time)
            
            # Calculate overall confidence
            confidence = self._calculate_confidence(
                authenticity_score, exif_data, detected_time, platform
            )
            
            return VerificationResult(
                is_authentic=authenticity_score > 0.7 and len(issues) == 0,
                confidence=confidence,
                detected_time=detected_time,
                platform=platform,
                game_title=game_title,
                issues=issues,
                exif_data=exif_data
            )
            
        except Exception as e:
            self.logger.error(f"Error during verification: {str(e)}")
            return VerificationResult(
                is_authentic=False,
                confidence=0.0,
                issues=[f"Verification error: {str(e)}"]
            )
    
    def _extract_exif_data(self, image_path: str) -> Dict:
        """Extract EXIF metadata from image"""
        try:
            with open(image_path, 'rb') as f:
                tags = exifread.process_file(f)
            
            exif_data = {}
            for tag, value in tags.items():
                if tag in ['EXIF DateTimeOriginal', 'EXIF DateTime', 'Image DateTime']:
                    exif_data['datetime'] = str(value)
                elif tag in ['EXIF Make', 'EXIF Model']:
                    exif_data['camera'] = str(value)
                elif tag in ['GPS GPSLatitude', 'GPS GPSLongitude']:
                    exif_data['gps'] = str(value)
            
            return exif_data
        except Exception as e:
            self.logger.warning(f"Could not extract EXIF data: {str(e)}")
            return {}
    
    def _extract_time_from_image(self, image: np.ndarray) -> Optional[str]:
        """Extract time information using OCR"""
        try:
            # Convert to grayscale for better OCR
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply preprocessing for better text recognition
            # Remove noise
            denoised = cv2.fastNlMeansDenoising(gray)
            
            # Increase contrast
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
            enhanced = clahe.apply(denoised)
            
            # OCR configuration for time patterns
            custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789:.,'
            
            # Extract text
            text = pytesseract.image_to_string(enhanced, config=custom_config)
            
            # Look for time patterns (MM:SS, MM:SS.ms, etc.)
            import re
            time_patterns = [
                r'\d{1,2}:\d{2}(?:\.\d{1,3})?',  # MM:SS or MM:SS.ms
                r'\d{1,2}:\d{2}:\d{2}',          # HH:MM:SS
                r'\d{1,2}\.\d{2}',               # MM.SS
            ]
            
            for pattern in time_patterns:
                matches = re.findall(pattern, text)
                if matches:
                    return matches[0]  # Return first match
            
            return None
            
        except Exception as e:
            self.logger.warning(f"OCR extraction failed: {str(e)}")
            return None
    
    def _classify_platform(self, image: np.ndarray) -> str:
        """Classify if image is from NTSC, PAL, or Emulator"""
        try:
            # Convert to HSV for color analysis
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            
            # Analyze color characteristics
            # NTSC typically has different color characteristics than PAL
            # Emulators often have different pixel patterns
            
            # Simple heuristic based on image characteristics
            # In a real implementation, this would use a trained model
            
            # Check for pixelation patterns (emulator vs original)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
            
            # Check color distribution
            color_std = np.std(hsv[:, :, 1])  # Saturation standard deviation
            
            if edge_density > 0.1:  # High edge density suggests emulator
                return "Emulator"
            elif color_std > 50:  # High color variation suggests NTSC
                return "NTSC"
            else:
                return "PAL"
                
        except Exception as e:
            self.logger.warning(f"Platform classification failed: {str(e)}")
            return "Unknown"
    
    def _verify_game_authenticity(self, image: np.ndarray, event_id: str) -> Tuple[Optional[str], float]:
        """Verify if the screenshot matches the expected game for the event"""
        try:
            # Get event information
            event_info = self.game_database.get(event_id, {})
            expected_game = event_info.get('game_title', '')
            
            if not expected_game:
                return None, 0.5  # Unknown game, neutral score
            
            # Simple template matching (in real implementation, use more sophisticated methods)
            # Convert to grayscale for comparison
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Calculate image features for comparison
            # This is a simplified version - real implementation would use feature matching
            features = self._extract_image_features(gray)
            
            # Compare with expected game features
            expected_features = event_info.get('features', {})
            
            if expected_features:
                similarity = self._calculate_feature_similarity(features, expected_features)
                return expected_game, similarity
            else:
                return expected_game, 0.7  # Assume authentic if no reference available
                
        except Exception as e:
            self.logger.warning(f"Game authenticity verification failed: {str(e)}")
            return None, 0.5
    
    def _extract_image_features(self, gray_image: np.ndarray) -> Dict:
        """Extract features from image for comparison"""
        features = {}
        
        # Histogram features
        hist = cv2.calcHist([gray_image], [0], None, [256], [0, 256])
        features['histogram'] = hist.flatten().tolist()
        
        # Edge density
        edges = cv2.Canny(gray_image, 50, 150)
        features['edge_density'] = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
        
        # Average brightness
        features['avg_brightness'] = np.mean(gray_image)
        
        # Standard deviation
        features['std_deviation'] = np.std(gray_image)
        
        return features
    
    def _calculate_feature_similarity(self, features1: Dict, features2: Dict) -> float:
        """Calculate similarity between two feature sets"""
        try:
            # Histogram similarity
            hist_sim = 1 - np.linalg.norm(
                np.array(features1['histogram']) - np.array(features2['histogram'])
            ) / np.linalg.norm(np.array(features2['histogram']))
            
            # Other feature similarities
            edge_sim = 1 - abs(features1['edge_density'] - features2['edge_density'])
            brightness_sim = 1 - abs(features1['avg_brightness'] - features2['avg_brightness']) / 255
            
            # Weighted average
            similarity = (0.5 * hist_sim + 0.3 * edge_sim + 0.2 * brightness_sim)
            
            return max(0, min(1, similarity))  # Clamp between 0 and 1
            
        except Exception:
            return 0.5
    
    def _check_for_issues(self, image: np.ndarray, exif_data: Dict, detected_time: Optional[str]) -> List[str]:
        """Check for common issues in screenshots"""
        issues = []
        
        # Check if image is too small (might be fake)
        if image.shape[0] < 200 or image.shape[1] < 200:
            issues.append("Image resolution too low")
        
        # Check for suspicious EXIF data
        if not exif_data:
            issues.append("No EXIF data found")
        
        # Check for impossible times
        if detected_time:
            try:
                # Parse time and check if it's reasonable
                if ':' in detected_time:
                    parts = detected_time.split(':')
                    if len(parts) == 2:  # MM:SS format
                        minutes, seconds = int(parts[0]), float(parts[1])
                        if minutes > 60 or seconds >= 60:
                            issues.append("Invalid time format detected")
                        if minutes == 0 and seconds < 1:
                            issues.append("Suspiciously fast time")
            except:
                issues.append("Could not parse detected time")
        
        # Check for obvious manipulation signs
        # (This would be more sophisticated in a real implementation)
        
        return issues
    
    def _calculate_confidence(self, authenticity_score: float, exif_data: Dict, 
                            detected_time: Optional[str], platform: str) -> float:
        """Calculate overall confidence score"""
        confidence = authenticity_score
        
        # Boost confidence for good EXIF data
        if exif_data:
            confidence += 0.1
        
        # Boost confidence for detected time
        if detected_time:
            confidence += 0.1
        
        # Boost confidence for platform detection
        if platform != "Unknown":
            confidence += 0.05
        
        return min(1.0, confidence)