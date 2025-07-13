"""
Battle64 AI Processing Service
Main orchestrator for AI-powered submission processing
"""

import os
import sys
import logging
import json
from typing import Dict, List, Optional
from datetime import datetime
import asyncio
from pathlib import Path

# Add src to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from ai.screenshot_verification.verifier import ScreenshotVerifier, VerificationResult
from ai.anomaly_detection.anomaly_detector import AnomalyDetector, AnomalyResult
from ai.moderation.content_moderator import ContentModerator, ModerationResult
from ai.player_analysis.player_analyzer import PlayerAnalyzer, PlayerProfile
from services.points_system import PointsSystem, PointsResult

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/ai_processing.log'),
        logging.StreamHandler()
    ]
)

class Battle64AIProcessor:
    """Main AI processing service for Battle64 submissions"""
    
    def __init__(self, data_path: str = "data/"):
        self.logger = logging.getLogger(__name__)
        self.data_path = data_path
        
        # Initialize all AI components
        self.screenshot_verifier = ScreenshotVerifier()
        self.anomaly_detector = AnomalyDetector()
        self.content_moderator = ContentModerator()
        self.player_analyzer = PlayerAnalyzer()
        self.points_system = PointsSystem()
        
        # Create necessary directories
        self._create_directories()
        
        self.logger.info("Battle64 AI Processor initialized successfully")
    
    def _create_directories(self):
        """Create necessary directories"""
        directories = [
            "data",
            "logs", 
            "uploads",
            "processed",
            "models"
        ]
        
        for directory in directories:
            Path(directory).mkdir(exist_ok=True)
    
    async def process_screenshot_submission(self, submission_data: Dict) -> Dict:
        """
        Process a screenshot submission through the complete AI pipeline
        
        Args:
            submission_data: Dictionary containing submission information
                - player_id: str
                - event_id: str
                - image_path: str
                - time: str (optional)
                - platform: str (optional)
                - game_title: str (optional)
                
        Returns:
            Dictionary with processing results
        """
        try:
            self.logger.info(f"Processing screenshot submission for player {submission_data.get('player_id')}")
            
            # Extract data
            player_id = submission_data.get('player_id')
            event_id = submission_data.get('event_id')
            image_path = submission_data.get('image_path')
            time_str = submission_data.get('time', '')
            platform = submission_data.get('platform', '')
            game_title = submission_data.get('game_title', '')
            
            # Step 1: Screenshot Verification
            verification_result = await self._verify_screenshot(image_path, event_id)
            
            # Step 2: Anomaly Detection
            anomaly_result = await self._detect_anomalies(submission_data, event_id)
            
            # Step 3: Content Moderation
            moderation_result = await self._moderate_content(image_path, "screenshot")
            
            # Step 4: Determine if submission is valid
            is_valid = self._evaluate_submission_validity(
                verification_result, anomaly_result, moderation_result
            )
            
            # Step 5: Award points if valid
            points_result = None
            if is_valid:
                points_result = await self._award_points(player_id, submission_data)
                
                # Update player analysis
                await self._update_player_analysis(player_id, submission_data)
            
            # Step 6: Generate response
            response = self._generate_processing_response(
                verification_result, anomaly_result, moderation_result, 
                points_result, is_valid
            )
            
            # Step 7: Log processing
            self._log_processing_result(player_id, event_id, response)
            
            return response
            
        except Exception as e:
            self.logger.error(f"Error processing screenshot submission: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'recommendations': ['Please try again or contact support']
            }
    
    async def process_fanart_submission(self, submission_data: Dict) -> Dict:
        """
        Process a fanart submission through the AI pipeline
        
        Args:
            submission_data: Dictionary containing submission information
                - player_id: str
                - image_path: str
                - title: str (optional)
                - description: str (optional)
                
        Returns:
            Dictionary with processing results
        """
        try:
            self.logger.info(f"Processing fanart submission for player {submission_data.get('player_id')}")
            
            player_id = submission_data.get('player_id')
            image_path = submission_data.get('image_path')
            title = submission_data.get('title', '')
            description = submission_data.get('description', '')
            
            # Step 1: Content Moderation (Image)
            image_moderation = await self._moderate_content(image_path, "fanart")
            
            # Step 2: Content Moderation (Text)
            text_moderation = None
            if title or description:
                text_moderation = await self._moderate_text(f"{title} {description}".strip())
            
            # Step 3: Determine if submission is valid
            is_valid = image_moderation.is_appropriate and (
                text_moderation.is_appropriate if text_moderation else True
            )
            
            # Step 4: Award points if valid
            points_result = None
            if is_valid:
                points_result = await self._award_fanart_points(player_id, submission_data)
                
                # Update player analysis
                await self._update_player_analysis(player_id, {
                    'type': 'fanart_creation',
                    'game_title': 'fanart',
                    'xp_earned': points_result.xp_earned if points_result else 0
                })
            
            # Step 5: Generate response
            response = self._generate_fanart_response(
                image_moderation, text_moderation, points_result, is_valid
            )
            
            return response
            
        except Exception as e:
            self.logger.error(f"Error processing fanart submission: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'recommendations': ['Please try again or contact support']
            }
    
    async def process_comment_submission(self, submission_data: Dict) -> Dict:
        """
        Process a comment submission through the AI pipeline
        
        Args:
            submission_data: Dictionary containing submission information
                - player_id: str
                - comment_text: str
                - context: str (post, event, etc.)
                
        Returns:
            Dictionary with processing results
        """
        try:
            self.logger.info(f"Processing comment submission for player {submission_data.get('player_id')}")
            
            player_id = submission_data.get('player_id')
            comment_text = submission_data.get('comment_text', '')
            context = submission_data.get('context', 'comment')
            
            # Step 1: Content Moderation
            moderation_result = await self._moderate_text(comment_text, context)
            
            # Step 2: Determine if comment is valid
            is_valid = moderation_result.is_appropriate
            
            # Step 3: Award points if valid
            points_result = None
            if is_valid:
                points_result = await self._award_comment_points(player_id, submission_data)
                
                # Update player analysis
                await self._update_player_analysis(player_id, {
                    'type': 'comment',
                    'game_title': 'community',
                    'xp_earned': points_result.xp_earned if points_result else 0
                })
            
            # Step 4: Generate response
            response = self._generate_comment_response(moderation_result, points_result, is_valid)
            
            return response
            
        except Exception as e:
            self.logger.error(f"Error processing comment submission: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'recommendations': ['Please try again or contact support']
            }
    
    async def _verify_screenshot(self, image_path: str, event_id: str) -> VerificationResult:
        """Verify screenshot authenticity"""
        try:
            return self.screenshot_verifier.verify_screenshot(image_path, event_id)
        except Exception as e:
            self.logger.error(f"Error in screenshot verification: {str(e)}")
            return VerificationResult(
                is_authentic=False,
                confidence=0.0,
                issues=[f"Verification error: {str(e)}"]
            )
    
    async def _detect_anomalies(self, submission_data: Dict, event_id: str) -> AnomalyResult:
        """Detect anomalies in submission"""
        try:
            return self.anomaly_detector.detect_anomalies(submission_data, event_id)
        except Exception as e:
            self.logger.error(f"Error in anomaly detection: {str(e)}")
            return AnomalyResult(
                is_anomaly=True,
                anomaly_score=1.0,
                anomaly_type="detection_error",
                confidence=0.5,
                details={'error': str(e)},
                recommendations=['Please contact support']
            )
    
    async def _moderate_content(self, image_path: str, context: str) -> ModerationResult:
        """Moderate image content"""
        try:
            return self.content_moderator.moderate_image(image_path, context)
        except Exception as e:
            self.logger.error(f"Error in content moderation: {str(e)}")
            return ModerationResult(
                is_appropriate=False,
                confidence=0.5,
                flagged_categories=['error'],
                severity='medium',
                details={'error': str(e)},
                recommendations=['Content flagged for manual review']
            )
    
    async def _moderate_text(self, text: str, context: str = "comment") -> ModerationResult:
        """Moderate text content"""
        try:
            return self.content_moderator.moderate_text(text, context)
        except Exception as e:
            self.logger.error(f"Error in text moderation: {str(e)}")
            return ModerationResult(
                is_appropriate=False,
                confidence=0.5,
                flagged_categories=['error'],
                severity='medium',
                details={'error': str(e)},
                recommendations=['Content flagged for manual review']
            )
    
    def _evaluate_submission_validity(self, verification: VerificationResult, 
                                    anomaly: AnomalyResult, 
                                    moderation: ModerationResult) -> bool:
        """Evaluate if submission is valid based on all checks"""
        # All checks must pass for submission to be valid
        return (verification.is_authentic and 
                not anomaly.is_anomaly and 
                moderation.is_appropriate)
    
    async def _award_points(self, player_id: str, submission_data: Dict) -> PointsResult:
        """Award points for valid submission"""
        try:
            activity_data = {
                'placement': submission_data.get('placement', 0),
                'is_top_10_percent': submission_data.get('is_top_10_percent', False),
                'game_title': submission_data.get('game_title', ''),
                'platform': submission_data.get('platform', ''),
                'time': submission_data.get('time', ''),
                'streak_multiplier': 1.0  # Could be calculated based on player history
            }
            
            return self.points_system.award_points(
                player_id, 'event_participation', activity_data
            )
        except Exception as e:
            self.logger.error(f"Error awarding points: {str(e)}")
            return PointsResult(0, [], [], '', 0.0, {'error': str(e)})
    
    async def _award_fanart_points(self, player_id: str, submission_data: Dict) -> PointsResult:
        """Award points for fanart submission"""
        try:
            activity_data = {
                'quality_score': submission_data.get('quality_score', 0.5),
                'title': submission_data.get('title', ''),
                'description': submission_data.get('description', '')
            }
            
            return self.points_system.award_points(
                player_id, 'fanart_creation', activity_data
            )
        except Exception as e:
            self.logger.error(f"Error awarding fanart points: {str(e)}")
            return PointsResult(0, [], [], '', 0.0, {'error': str(e)})
    
    async def _award_comment_points(self, player_id: str, submission_data: Dict) -> PointsResult:
        """Award points for comment submission"""
        try:
            activity_data = {
                'comment_length': len(submission_data.get('comment_text', '')),
                'context': submission_data.get('context', 'comment')
            }
            
            return self.points_system.award_points(
                player_id, 'comment', activity_data
            )
        except Exception as e:
            self.logger.error(f"Error awarding comment points: {str(e)}")
            return PointsResult(0, [], [], '', 0.0, {'error': str(e)})
    
    async def _update_player_analysis(self, player_id: str, activity_data: Dict):
        """Update player analysis with new activity"""
        try:
            self.player_analyzer.update_player_data(player_id, activity_data)
        except Exception as e:
            self.logger.error(f"Error updating player analysis: {str(e)}")
    
    def _generate_processing_response(self, verification: VerificationResult,
                                    anomaly: AnomalyResult,
                                    moderation: ModerationResult,
                                    points: Optional[PointsResult],
                                    is_valid: bool) -> Dict:
        """Generate comprehensive processing response"""
        response = {
            'success': is_valid,
            'verification': {
                'is_authentic': verification.is_authentic,
                'confidence': verification.confidence,
                'detected_time': verification.detected_time,
                'platform': verification.platform,
                'game_title': verification.game_title,
                'issues': verification.issues or []
            },
            'anomaly_detection': {
                'is_anomaly': anomaly.is_anomaly,
                'anomaly_type': anomaly.anomaly_type,
                'confidence': anomaly.confidence,
                'recommendations': anomaly.recommendations
            },
            'moderation': {
                'is_appropriate': moderation.is_appropriate,
                'severity': moderation.severity,
                'flagged_categories': moderation.flagged_categories,
                'recommendations': moderation.recommendations
            },
            'points': None,
            'recommendations': []
        }
        
        if points:
            response['points'] = {
                'xp_earned': points.xp_earned,
                'medals_earned': points.medals_earned,
                'titles_earned': points.titles_earned,
                'new_rank': points.new_rank,
                'rank_progress': points.rank_progress
            }
        
        # Combine recommendations
        all_recommendations = []
        if verification.issues:
            all_recommendations.extend(verification.issues)
        if anomaly.recommendations:
            all_recommendations.extend(anomaly.recommendations)
        if moderation.recommendations:
            all_recommendations.extend(moderation.recommendations)
        
        response['recommendations'] = list(set(all_recommendations))
        
        return response
    
    def _generate_fanart_response(self, image_moderation: ModerationResult,
                                text_moderation: Optional[ModerationResult],
                                points: Optional[PointsResult],
                                is_valid: bool) -> Dict:
        """Generate fanart processing response"""
        response = {
            'success': is_valid,
            'image_moderation': {
                'is_appropriate': image_moderation.is_appropriate,
                'severity': image_moderation.severity,
                'flagged_categories': image_moderation.flagged_categories,
                'recommendations': image_moderation.recommendations
            },
            'text_moderation': None,
            'points': None,
            'recommendations': []
        }
        
        if text_moderation:
            response['text_moderation'] = {
                'is_appropriate': text_moderation.is_appropriate,
                'severity': text_moderation.severity,
                'flagged_categories': text_moderation.flagged_categories,
                'recommendations': text_moderation.recommendations
            }
        
        if points:
            response['points'] = {
                'xp_earned': points.xp_earned,
                'medals_earned': points.medals_earned,
                'titles_earned': points.titles_earned,
                'new_rank': points.new_rank,
                'rank_progress': points.rank_progress
            }
        
        # Combine recommendations
        all_recommendations = []
        if image_moderation.recommendations:
            all_recommendations.extend(image_moderation.recommendations)
        if text_moderation and text_moderation.recommendations:
            all_recommendations.extend(text_moderation.recommendations)
        
        response['recommendations'] = list(set(all_recommendations))
        
        return response
    
    def _generate_comment_response(self, moderation: ModerationResult,
                                 points: Optional[PointsResult],
                                 is_valid: bool) -> Dict:
        """Generate comment processing response"""
        response = {
            'success': is_valid,
            'moderation': {
                'is_appropriate': moderation.is_appropriate,
                'severity': moderation.severity,
                'flagged_categories': moderation.flagged_categories,
                'recommendations': moderation.recommendations
            },
            'points': None,
            'recommendations': moderation.recommendations
        }
        
        if points:
            response['points'] = {
                'xp_earned': points.xp_earned,
                'medals_earned': points.medals_earned,
                'titles_earned': points.titles_earned,
                'new_rank': points.new_rank,
                'rank_progress': points.rank_progress
            }
        
        return response
    
    def _log_processing_result(self, player_id: str, event_id: str, response: Dict):
        """Log processing result for analytics"""
        try:
            log_entry = {
                'timestamp': datetime.now().isoformat(),
                'player_id': player_id,
                'event_id': event_id,
                'success': response.get('success', False),
                'verification_confidence': response.get('verification', {}).get('confidence', 0),
                'anomaly_detected': response.get('anomaly_detection', {}).get('is_anomaly', False),
                'moderation_passed': response.get('moderation', {}).get('is_appropriate', False),
                'xp_earned': response.get('points', {}).get('xp_earned', 0)
            }
            
            # Append to log file
            with open('logs/processing_analytics.jsonl', 'a') as f:
                f.write(json.dumps(log_entry) + '\n')
                
        except Exception as e:
            self.logger.error(f"Error logging processing result: {str(e)}")
    
    def get_player_profile(self, player_id: str) -> Optional[PlayerProfile]:
        """Get player profile and analysis"""
        try:
            return self.player_analyzer.analyze_player(player_id)
        except Exception as e:
            self.logger.error(f"Error getting player profile: {str(e)}")
            return None
    
    def get_leaderboard(self, leaderboard_type: str = 'global', limit: int = 50):
        """Get leaderboard data"""
        try:
            return self.points_system.get_leaderboard(leaderboard_type, limit)
        except Exception as e:
            self.logger.error(f"Error getting leaderboard: {str(e)}")
            return []

# Example usage and testing
async def main():
    """Example usage of the AI processor"""
    processor = Battle64AIProcessor()
    
    # Example screenshot submission
    screenshot_data = {
        'player_id': 'player123',
        'event_id': 'event456',
        'image_path': 'uploads/screenshot.jpg',
        'time': '2:34.56',
        'platform': 'NTSC',
        'game_title': 'Super Mario 64'
    }
    
    result = await processor.process_screenshot_submission(screenshot_data)
    print("Screenshot processing result:", json.dumps(result, indent=2))
    
    # Example fanart submission
    fanart_data = {
        'player_id': 'player123',
        'image_path': 'uploads/fanart.jpg',
        'title': 'Mario Adventure',
        'description': 'My Mario fanart!'
    }
    
    result = await processor.process_fanart_submission(fanart_data)
    print("Fanart processing result:", json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(main())