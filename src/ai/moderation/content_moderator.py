"""
Battle64 Content Moderation System
Handles text and image moderation for comments and fanart
"""

import cv2
import numpy as np
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import logging
import re
import json
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from PIL import Image
import torch

@dataclass
class ModerationResult:
    """Result of content moderation"""
    is_appropriate: bool
    confidence: float
    flagged_categories: List[str]
    severity: str  # 'low', 'medium', 'high'
    details: Dict
    recommendations: List[str]

class ContentModerator:
    """Moderates text and image content for inappropriate material"""
    
    def __init__(self, models_path: str = "models/"):
        self.logger = logging.getLogger(__name__)
        self.models_path = models_path
        
        # Initialize text moderation model
        self.text_classifier = None
        self.text_tokenizer = None
        self._load_text_model()
        
        # Initialize image moderation model
        self.image_classifier = None
        self._load_image_model()
        
        # Define inappropriate content categories
        self.categories = {
            'toxicity': ['hate', 'harassment', 'bullying'],
            'spam': ['repetitive', 'advertising', 'bot'],
            'nsfw': ['explicit', 'sexual', 'violence'],
            'inappropriate': ['offensive', 'discriminatory', 'threatening']
        }
        
        # Load custom rules and patterns
        self.custom_patterns = self._load_custom_patterns()
        
    def _load_text_model(self):
        """Load text classification model"""
        try:
            # Use a pre-trained model for text classification
            # In production, you might use a custom fine-tuned model
            model_name = "facebook/roberta-hate-speech-detector"
            
            self.text_tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.text_classifier = pipeline(
                "text-classification",
                model=model_name,
                tokenizer=self.text_tokenizer
            )
            
            self.logger.info("Text moderation model loaded successfully")
            
        except Exception as e:
            self.logger.warning(f"Could not load text model: {str(e)}")
            self.text_classifier = None
    
    def _load_image_model(self):
        """Load image classification model"""
        try:
            # Use a pre-trained model for NSFW detection
            # In production, you might use a custom model
            model_name = "microsoft/DialoGPT-medium"  # Placeholder - use appropriate NSFW model
            
            # For now, use a simple heuristic-based approach
            self.image_classifier = None
            self.logger.info("Image moderation using heuristic approach")
            
        except Exception as e:
            self.logger.warning(f"Could not load image model: {str(e)}")
    
    def _load_custom_patterns(self) -> Dict:
        """Load custom moderation patterns and rules"""
        try:
            with open("data/moderation_patterns.json", 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Default patterns
            return {
                'banned_words': [
                    'hack', 'cheat', 'exploit', 'glitch', 'bug',
                    'fake', 'photoshop', 'edited', 'manipulated'
                ],
                'spam_patterns': [
                    r'(.)\1{4,}',  # Repeated characters
                    r'[A-Z]{10,}',  # All caps
                    r'(http|www\.)\S+',  # URLs
                ],
                'toxicity_patterns': [
                    r'\b(kill|die|hate)\b',
                    r'\b(stupid|idiot|dumb)\b',
                    r'\b(fuck|shit|bitch)\b'
                ]
            }
    
    def moderate_text(self, text: str, context: str = "comment") -> ModerationResult:
        """
        Moderate text content
        
        Args:
            text: Text to moderate
            context: Context of the text (comment, title, description, etc.)
            
        Returns:
            ModerationResult with moderation details
        """
        try:
            if not text or len(text.strip()) == 0:
                return ModerationResult(
                    is_appropriate=True,
                    confidence=1.0,
                    flagged_categories=[],
                    severity='low',
                    details={'status': 'Empty text'},
                    recommendations=[]
                )
            
            # Check custom patterns first
            pattern_result = self._check_custom_patterns(text)
            
            # Use AI model if available
            ai_result = self._check_with_ai_model(text)
            
            # Combine results
            combined_result = self._combine_moderation_results(pattern_result, ai_result)
            
            # Add context-specific checks
            context_result = self._check_context_specific(text, context)
            
            # Final combination
            final_result = self._combine_moderation_results(combined_result, context_result)
            
            return final_result
            
        except Exception as e:
            self.logger.error(f"Error during text moderation: {str(e)}")
            return ModerationResult(
                is_appropriate=False,
                confidence=0.5,
                flagged_categories=['error'],
                severity='medium',
                details={'error': str(e)},
                recommendations=['Content flagged for manual review']
            )
    
    def moderate_image(self, image_path: str, context: str = "fanart") -> ModerationResult:
        """
        Moderate image content
        
        Args:
            image_path: Path to the image
            context: Context of the image (fanart, screenshot, etc.)
            
        Returns:
            ModerationResult with moderation details
        """
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                return ModerationResult(
                    is_appropriate=False,
                    confidence=1.0,
                    flagged_categories=['invalid_image'],
                    severity='high',
                    details={'error': 'Could not load image'},
                    recommendations=['Please provide a valid image file']
                )
            
            # Check image properties
            properties_result = self._check_image_properties(image)
            
            # Check for NSFW content
            nsfw_result = self._check_nsfw_content(image)
            
            # Check for inappropriate content
            inappropriate_result = self._check_inappropriate_content(image, context)
            
            # Combine results
            combined_result = self._combine_moderation_results(properties_result, nsfw_result)
            final_result = self._combine_moderation_results(combined_result, inappropriate_result)
            
            return final_result
            
        except Exception as e:
            self.logger.error(f"Error during image moderation: {str(e)}")
            return ModerationResult(
                is_appropriate=False,
                confidence=0.5,
                flagged_categories=['error'],
                severity='medium',
                details={'error': str(e)},
                recommendations=['Image flagged for manual review']
            )
    
    def _check_custom_patterns(self, text: str) -> ModerationResult:
        """Check text against custom patterns"""
        flagged_categories = []
        details = {}
        
        # Check banned words
        text_lower = text.lower()
        banned_found = []
        for word in self.custom_patterns['banned_words']:
            if word in text_lower:
                banned_found.append(word)
        
        if banned_found:
            flagged_categories.append('inappropriate')
            details['banned_words'] = banned_found
        
        # Check spam patterns
        spam_found = []
        for pattern in self.custom_patterns['spam_patterns']:
            if re.search(pattern, text, re.IGNORECASE):
                spam_found.append(pattern)
        
        if spam_found:
            flagged_categories.append('spam')
            details['spam_patterns'] = spam_found
        
        # Check toxicity patterns
        toxicity_found = []
        for pattern in self.custom_patterns['toxicity_patterns']:
            if re.search(pattern, text, re.IGNORECASE):
                toxicity_found.append(pattern)
        
        if toxicity_found:
            flagged_categories.append('toxicity')
            details['toxicity_patterns'] = toxicity_found
        
        # Determine severity
        severity = 'low'
        if len(flagged_categories) > 1:
            severity = 'high'
        elif flagged_categories:
            severity = 'medium'
        
        return ModerationResult(
            is_appropriate=len(flagged_categories) == 0,
            confidence=0.8 if flagged_categories else 0.9,
            flagged_categories=flagged_categories,
            severity=severity,
            details=details,
            recommendations=self._generate_recommendations(flagged_categories)
        )
    
    def _check_with_ai_model(self, text: str) -> ModerationResult:
        """Check text using AI model"""
        if not self.text_classifier:
            return ModerationResult(
                is_appropriate=True,
                confidence=0.5,
                flagged_categories=[],
                severity='low',
                details={'status': 'AI model not available'},
                recommendations=[]
            )
        
        try:
            # Use the text classifier
            result = self.text_classifier(text)
            
            # Parse results
            flagged_categories = []
            details = {'ai_classification': result}
            
            # Check if any category indicates inappropriate content
            for classification in result:
                label = classification['label'].lower()
                score = classification['score']
                
                if score > 0.7:  # High confidence threshold
                    if 'hate' in label or 'toxic' in label:
                        flagged_categories.append('toxicity')
                    elif 'spam' in label:
                        flagged_categories.append('spam')
                    elif 'nsfw' in label or 'sexual' in label:
                        flagged_categories.append('nsfw')
            
            severity = 'low'
            if flagged_categories:
                severity = 'medium' if len(flagged_categories) == 1 else 'high'
            
            return ModerationResult(
                is_appropriate=len(flagged_categories) == 0,
                confidence=0.9 if flagged_categories else 0.8,
                flagged_categories=flagged_categories,
                severity=severity,
                details=details,
                recommendations=self._generate_recommendations(flagged_categories)
            )
            
        except Exception as e:
            self.logger.warning(f"AI model check failed: {str(e)}")
            return ModerationResult(
                is_appropriate=True,
                confidence=0.5,
                flagged_categories=[],
                severity='low',
                details={'error': str(e)},
                recommendations=[]
            )
    
    def _check_context_specific(self, text: str, context: str) -> ModerationResult:
        """Check for context-specific issues"""
        flagged_categories = []
        details = {}
        
        if context == "comment":
            # Check for excessive length
            if len(text) > 1000:
                flagged_categories.append('spam')
                details['excessive_length'] = len(text)
            
            # Check for excessive punctuation
            if text.count('!') > 5 or text.count('?') > 5:
                flagged_categories.append('spam')
                details['excessive_punctuation'] = True
        
        elif context == "title":
            # Check for clickbait patterns
            clickbait_patterns = [
                r'\b(amazing|incredible|unbelievable|shocking)\b',
                r'\b(you won\'t believe|must see|viral)\b'
            ]
            
            for pattern in clickbait_patterns:
                if re.search(pattern, text, re.IGNORECASE):
                    flagged_categories.append('spam')
                    details['clickbait_detected'] = True
                    break
        
        severity = 'low' if not flagged_categories else 'medium'
        
        return ModerationResult(
            is_appropriate=len(flagged_categories) == 0,
            confidence=0.7,
            flagged_categories=flagged_categories,
            severity=severity,
            details=details,
            recommendations=self._generate_recommendations(flagged_categories)
        )
    
    def _check_image_properties(self, image: np.ndarray) -> ModerationResult:
        """Check basic image properties"""
        flagged_categories = []
        details = {}
        
        # Check image size
        height, width = image.shape[:2]
        if height < 100 or width < 100:
            flagged_categories.append('inappropriate')
            details['too_small'] = f"{width}x{height}"
        
        # Check aspect ratio
        aspect_ratio = width / height
        if aspect_ratio > 5 or aspect_ratio < 0.2:
            flagged_categories.append('inappropriate')
            details['unusual_aspect_ratio'] = aspect_ratio
        
        # Check for completely black or white images
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        mean_brightness = np.mean(gray)
        if mean_brightness < 10 or mean_brightness > 245:
            flagged_categories.append('inappropriate')
            details['extreme_brightness'] = mean_brightness
        
        severity = 'low' if not flagged_categories else 'medium'
        
        return ModerationResult(
            is_appropriate=len(flagged_categories) == 0,
            confidence=0.8,
            flagged_categories=flagged_categories,
            severity=severity,
            details=details,
            recommendations=self._generate_recommendations(flagged_categories)
        )
    
    def _check_nsfw_content(self, image: np.ndarray) -> ModerationResult:
        """Check for NSFW content"""
        # This is a simplified version - real implementation would use a trained NSFW model
        
        try:
            # Convert to HSV for skin detection
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            
            # Define skin color range
            lower_skin = np.array([0, 20, 70], dtype=np.uint8)
            upper_skin = np.array([20, 255, 255], dtype=np.uint8)
            
            # Create skin mask
            skin_mask = cv2.inRange(hsv, lower_skin, upper_skin)
            
            # Calculate skin percentage
            skin_percentage = np.sum(skin_mask > 0) / (skin_mask.shape[0] * skin_mask.shape[1])
            
            # Simple heuristic - high skin percentage might indicate NSFW content
            if skin_percentage > 0.6:  # 60% skin
                return ModerationResult(
                    is_appropriate=False,
                    confidence=0.6,
                    flagged_categories=['nsfw'],
                    severity='medium',
                    details={'skin_percentage': skin_percentage},
                    recommendations=['Image flagged for manual review due to high skin content']
                )
            
            return ModerationResult(
                is_appropriate=True,
                confidence=0.7,
                flagged_categories=[],
                severity='low',
                details={'skin_percentage': skin_percentage},
                recommendations=[]
            )
            
        except Exception as e:
            self.logger.warning(f"NSFW check failed: {str(e)}")
            return ModerationResult(
                is_appropriate=True,
                confidence=0.5,
                flagged_categories=[],
                severity='low',
                details={'error': str(e)},
                recommendations=[]
            )
    
    def _check_inappropriate_content(self, image: np.ndarray, context: str) -> ModerationResult:
        """Check for other inappropriate content"""
        # This would include checks for violence, gore, etc.
        # For now, return a safe default
        
        return ModerationResult(
            is_appropriate=True,
            confidence=0.8,
            flagged_categories=[],
            severity='low',
            details={'status': 'No inappropriate content detected'},
            recommendations=[]
        )
    
    def _combine_moderation_results(self, result1: ModerationResult, result2: ModerationResult) -> ModerationResult:
        """Combine two moderation results"""
        # Combine flagged categories
        all_categories = list(set(result1.flagged_categories + result2.flagged_categories))
        
        # Determine overall appropriateness
        is_appropriate = result1.is_appropriate and result2.is_appropriate
        
        # Calculate combined confidence
        confidence = (result1.confidence + result2.confidence) / 2
        
        # Determine severity
        severities = [result1.severity, result2.severity]
        if 'high' in severities:
            severity = 'high'
        elif 'medium' in severities:
            severity = 'medium'
        else:
            severity = 'low'
        
        # Combine details
        combined_details = {**result1.details, **result2.details}
        
        # Combine recommendations
        combined_recommendations = list(set(result1.recommendations + result2.recommendations))
        
        return ModerationResult(
            is_appropriate=is_appropriate,
            confidence=confidence,
            flagged_categories=all_categories,
            severity=severity,
            details=combined_details,
            recommendations=combined_recommendations
        )
    
    def _generate_recommendations(self, flagged_categories: List[str]) -> List[str]:
        """Generate recommendations based on flagged categories"""
        recommendations = []
        
        if 'toxicity' in flagged_categories:
            recommendations.append("Please avoid offensive or harmful language")
        
        if 'spam' in flagged_categories:
            recommendations.append("Please avoid repetitive or promotional content")
        
        if 'nsfw' in flagged_categories:
            recommendations.append("Please ensure content is appropriate for all ages")
        
        if 'inappropriate' in flagged_categories:
            recommendations.append("Please review and revise your content")
        
        if not recommendations:
            recommendations.append("Content appears appropriate")
        
        return recommendations
    
    def update_patterns(self, new_patterns: Dict):
        """Update moderation patterns"""
        try:
            self.custom_patterns.update(new_patterns)
            
            # Save updated patterns
            with open("data/moderation_patterns.json", 'w') as f:
                json.dump(self.custom_patterns, f, indent=2)
                
            self.logger.info("Moderation patterns updated successfully")
            
        except Exception as e:
            self.logger.error(f"Error updating patterns: {str(e)}")