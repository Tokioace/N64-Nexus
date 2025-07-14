"""
Battle64 Anomaly Detection System
Detects impossible times, glitch runs, and suspicious patterns
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import json

@dataclass
class AnomalyResult:
    """Result of anomaly detection"""
    is_anomaly: bool
    anomaly_score: float
    anomaly_type: str
    confidence: float
    details: Dict
    recommendations: List[str]

class AnomalyDetector:
    """Detects anomalies in gaming submissions and times"""
    
    def __init__(self, game_records_path: str = "data/game_records.json"):
        self.game_records = self._load_game_records(game_records_path)
        self.logger = logging.getLogger(__name__)
        
        # Initialize ML models
        self.isolation_forest = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=100
        )
        self.scaler = StandardScaler()
        
        # Thresholds for different anomaly types
        self.thresholds = {
            'impossible_time': 0.001,  # 0.1% of best time
            'suspicious_improvement': 0.05,  # 5% improvement
            'glitch_pattern': 0.8,  # 80% similarity to known glitch
            'statistical_outlier': 0.95  # 95th percentile
        }
    
    def _load_game_records(self, path: str) -> Dict:
        """Load historical game records and statistics"""
        try:
            with open(path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            self.logger.warning(f"Game records not found at {path}, using empty records")
            return {}
    
    def detect_anomalies(self, submission_data: Dict, event_id: str) -> AnomalyResult:
        """
        Main anomaly detection method
        
        Args:
            submission_data: Dictionary containing submission information
            event_id: ID of the event
            
        Returns:
            AnomalyResult with detection results
        """
        try:
            # Extract relevant data
            time_str = submission_data.get('time', '')
            player_id = submission_data.get('player_id', '')
            platform = submission_data.get('platform', '')
            game_title = submission_data.get('game_title', '')
            
            # Parse time
            time_seconds = self._parse_time_to_seconds(time_str)
            if time_seconds is None:
                return AnomalyResult(
                    is_anomaly=True,
                    anomaly_score=1.0,
                    anomaly_type="invalid_time_format",
                    confidence=1.0,
                    details={"error": "Could not parse time format"},
                    recommendations=["Please provide time in MM:SS or MM:SS.ms format"]
                )
            
            # Check for impossible times
            impossible_result = self._check_impossible_time(time_seconds, event_id, game_title)
            if impossible_result['is_anomaly']:
                return AnomalyResult(
                    is_anomaly=True,
                    anomaly_score=impossible_result['score'],
                    anomaly_type="impossible_time",
                    confidence=impossible_result['confidence'],
                    details=impossible_result['details'],
                    recommendations=impossible_result['recommendations']
                )
            
            # Check for suspicious improvements
            improvement_result = self._check_suspicious_improvement(
                time_seconds, player_id, event_id, game_title
            )
            if improvement_result['is_anomaly']:
                return AnomalyResult(
                    is_anomaly=True,
                    anomaly_score=improvement_result['score'],
                    anomaly_type="suspicious_improvement",
                    confidence=improvement_result['confidence'],
                    details=improvement_result['details'],
                    recommendations=improvement_result['recommendations']
                )
            
            # Check for glitch patterns
            glitch_result = self._check_glitch_patterns(submission_data, event_id)
            if glitch_result['is_anomaly']:
                return AnomalyResult(
                    is_anomaly=True,
                    anomaly_score=glitch_result['score'],
                    anomaly_type="glitch_detected",
                    confidence=glitch_result['confidence'],
                    details=glitch_result['details'],
                    recommendations=glitch_result['recommendations']
                )
            
            # Statistical outlier detection
            outlier_result = self._check_statistical_outlier(
                time_seconds, event_id, game_title, platform
            )
            if outlier_result['is_anomaly']:
                return AnomalyResult(
                    is_anomaly=True,
                    anomaly_score=outlier_result['score'],
                    anomaly_type="statistical_outlier",
                    confidence=outlier_result['confidence'],
                    details=outlier_result['details'],
                    recommendations=outlier_result['recommendations']
                )
            
            # No anomalies detected
            return AnomalyResult(
                is_anomaly=False,
                anomaly_score=0.0,
                anomaly_type="none",
                confidence=1.0,
                details={"status": "No anomalies detected"},
                recommendations=[]
            )
            
        except Exception as e:
            self.logger.error(f"Error during anomaly detection: {str(e)}")
            return AnomalyResult(
                is_anomaly=True,
                anomaly_score=1.0,
                anomaly_type="detection_error",
                confidence=0.5,
                details={"error": str(e)},
                recommendations=["Please contact support if this persists"]
            )
    
    def _parse_time_to_seconds(self, time_str: str) -> Optional[float]:
        """Parse time string to seconds"""
        try:
            if not time_str:
                return None
            
            # Handle MM:SS format
            if ':' in time_str:
                parts = time_str.split(':')
                if len(parts) == 2:
                    minutes, seconds = int(parts[0]), float(parts[1])
                    return minutes * 60 + seconds
                elif len(parts) == 3:
                    hours, minutes, seconds = int(parts[0]), int(parts[1]), float(parts[2])
                    return hours * 3600 + minutes * 60 + seconds
            
            # Handle MM.SS format
            elif '.' in time_str:
                parts = time_str.split('.')
                if len(parts) == 2:
                    minutes, seconds = int(parts[0]), float(parts[1])
                    return minutes * 60 + seconds
            
            # Try to parse as seconds
            else:
                return float(time_str)
                
        except (ValueError, TypeError):
            return None
    
    def _check_impossible_time(self, time_seconds: float, event_id: str, game_title: str) -> Dict:
        """Check if the time is impossibly fast"""
        try:
            # Get world record and theoretical minimum
            event_records = self.game_records.get(event_id, {})
            world_record = event_records.get('world_record', None)
            theoretical_min = event_records.get('theoretical_minimum', None)
            
            if world_record is None:
                return {'is_anomaly': False, 'score': 0.0, 'confidence': 0.0, 
                       'details': {}, 'recommendations': []}
            
            # Check against world record
            if time_seconds < world_record * (1 - self.thresholds['impossible_time']):
                return {
                    'is_anomaly': True,
                    'score': 1.0,
                    'confidence': 0.95,
                    'details': {
                        'submitted_time': time_seconds,
                        'world_record': world_record,
                        'difference': world_record - time_seconds
                    },
                    'recommendations': [
                        "Time is significantly faster than world record",
                        "Please verify your submission",
                        "Consider submitting a video for verification"
                    ]
                }
            
            # Check against theoretical minimum
            if theoretical_min and time_seconds < theoretical_min:
                return {
                    'is_anomaly': True,
                    'score': 1.0,
                    'confidence': 0.99,
                    'details': {
                        'submitted_time': time_seconds,
                        'theoretical_minimum': theoretical_min,
                        'difference': theoretical_min - time_seconds
                    },
                    'recommendations': [
                        "Time is below theoretical minimum",
                        "This time is physically impossible",
                        "Please check your submission"
                    ]
                }
            
            return {'is_anomaly': False, 'score': 0.0, 'confidence': 0.0, 
                   'details': {}, 'recommendations': []}
                   
        except Exception as e:
            self.logger.warning(f"Error checking impossible time: {str(e)}")
            return {'is_anomaly': False, 'score': 0.0, 'confidence': 0.0, 
                   'details': {}, 'recommendations': []}
    
    def _check_suspicious_improvement(self, time_seconds: float, player_id: str, 
                                    event_id: str, game_title: str) -> Dict:
        """Check if the improvement is suspiciously large"""
        try:
            # Get player's previous best time
            player_records = self.game_records.get('player_records', {}).get(player_id, {})
            previous_best = player_records.get(event_id, None)
            
            if previous_best is None:
                return {'is_anomaly': False, 'score': 0.0, 'confidence': 0.0, 
                       'details': {}, 'recommendations': []}
            
            # Calculate improvement percentage
            improvement = (previous_best - time_seconds) / previous_best
            
            if improvement > self.thresholds['suspicious_improvement']:
                return {
                    'is_anomaly': True,
                    'score': min(1.0, improvement / 0.1),  # Scale to 0-1
                    'confidence': 0.8,
                    'details': {
                        'submitted_time': time_seconds,
                        'previous_best': previous_best,
                        'improvement_percentage': improvement * 100
                    },
                    'recommendations': [
                        f"Improvement of {improvement*100:.1f}% is unusually large",
                        "This may indicate a glitch run or error",
                        "Please verify your submission"
                    ]
                }
            
            return {'is_anomaly': False, 'score': 0.0, 'confidence': 0.0, 
                   'details': {}, 'recommendations': []}
                   
        except Exception as e:
            self.logger.warning(f"Error checking suspicious improvement: {str(e)}")
            return {'is_anomaly': False, 'score': 0.0, 'confidence': 0.0, 
                   'details': {}, 'recommendations': []}
    
    def _check_glitch_patterns(self, submission_data: Dict, event_id: str) -> Dict:
        """Check for known glitch patterns"""
        try:
            # Get known glitch patterns for this event
            event_glitches = self.game_records.get('glitch_patterns', {}).get(event_id, [])
            
            if not event_glitches:
                return {'is_anomaly': False, 'score': 0.0, 'confidence': 0.0, 
                       'details': {}, 'recommendations': []}
            
            # Check submission against known glitch patterns
            # This is a simplified version - real implementation would use more sophisticated pattern matching
            
            time_str = submission_data.get('time', '')
            platform = submission_data.get('platform', '')
            
            for glitch in event_glitches:
                # Check if time matches glitch pattern
                if self._matches_glitch_pattern(time_str, glitch):
                    return {
                        'is_anomaly': True,
                        'score': 0.9,
                        'confidence': 0.85,
                        'details': {
                            'detected_glitch': glitch['name'],
                            'glitch_description': glitch['description'],
                            'submitted_time': time_str
                        },
                        'recommendations': [
                            f"Detected potential {glitch['name']} glitch",
                            "Glitch runs are not allowed in this event",
                            "Please submit a clean run"
                        ]
                    }
            
            return {'is_anomaly': False, 'score': 0.0, 'confidence': 0.0, 
                   'details': {}, 'recommendations': []}
                   
        except Exception as e:
            self.logger.warning(f"Error checking glitch patterns: {str(e)}")
            return {'is_anomaly': False, 'score': 0.0, 'confidence': 0.0, 
                   'details': {}, 'recommendations': []}
    
    def _matches_glitch_pattern(self, time_str: str, glitch: Dict) -> bool:
        """Check if time matches a known glitch pattern"""
        try:
            # Simple pattern matching - real implementation would be more sophisticated
            glitch_patterns = glitch.get('time_patterns', [])
            
            for pattern in glitch_patterns:
                if pattern in time_str:
                    return True
            
            return False
            
        except Exception:
            return False
    
    def _check_statistical_outlier(self, time_seconds: float, event_id: str, 
                                  game_title: str, platform: str) -> Dict:
        """Check if the time is a statistical outlier"""
        try:
            # Get historical times for this event
            event_times = self.game_records.get('event_times', {}).get(event_id, [])
            
            if len(event_times) < 10:  # Need sufficient data
                return {'is_anomaly': False, 'score': 0.0, 'confidence': 0.0, 
                       'details': {}, 'recommendations': []}
            
            # Convert to numpy array for analysis
            times_array = np.array(event_times)
            
            # Calculate statistics
            mean_time = np.mean(times_array)
            std_time = np.std(times_array)
            z_score = abs(time_seconds - mean_time) / std_time
            
            # Check if it's an outlier (z-score > 2.5)
            if z_score > 2.5:
                percentile = self._calculate_percentile(time_seconds, times_array)
                
                return {
                    'is_anomaly': True,
                    'score': min(1.0, z_score / 4.0),  # Scale to 0-1
                    'confidence': 0.7,
                    'details': {
                        'submitted_time': time_seconds,
                        'mean_time': mean_time,
                        'std_time': std_time,
                        'z_score': z_score,
                        'percentile': percentile
                    },
                    'recommendations': [
                        f"Time is {z_score:.1f} standard deviations from mean",
                        f"This time is in the {percentile:.1f}th percentile",
                        "Please verify your submission"
                    ]
                }
            
            return {'is_anomaly': False, 'score': 0.0, 'confidence': 0.0, 
                   'details': {}, 'recommendations': []}
                   
        except Exception as e:
            self.logger.warning(f"Error checking statistical outlier: {str(e)}")
            return {'is_anomaly': False, 'score': 0.0, 'confidence': 0.0, 
                   'details': {}, 'recommendations': []}
    
    def _calculate_percentile(self, value: float, array: np.ndarray) -> float:
        """Calculate percentile of a value in an array"""
        try:
            return (np.sum(array < value) / len(array)) * 100
        except Exception:
            return 50.0
    
    def update_records(self, event_id: str, player_id: str, time_seconds: float, 
                      is_valid: bool = True):
        """Update game records with new submission"""
        try:
            if not is_valid:
                return
            
            # Update event times
            if 'event_times' not in self.game_records:
                self.game_records['event_times'] = {}
            if event_id not in self.game_records['event_times']:
                self.game_records['event_times'][event_id] = []
            
            self.game_records['event_times'][event_id].append(time_seconds)
            
            # Update player records
            if 'player_records' not in self.game_records:
                self.game_records['player_records'] = {}
            if player_id not in self.game_records['player_records']:
                self.game_records['player_records'][player_id] = {}
            
            current_best = self.game_records['player_records'][player_id].get(event_id, float('inf'))
            if time_seconds < current_best:
                self.game_records['player_records'][player_id][event_id] = time_seconds
            
            # Update world record if applicable
            if 'world_record' not in self.game_records.get(event_id, {}):
                self.game_records.setdefault(event_id, {})['world_record'] = time_seconds
            elif time_seconds < self.game_records[event_id]['world_record']:
                self.game_records[event_id]['world_record'] = time_seconds
            
            # Save updated records
            self._save_game_records()
            
        except Exception as e:
            self.logger.error(f"Error updating records: {str(e)}")
    
    def _save_game_records(self):
        """Save updated game records to file"""
        try:
            with open("data/game_records.json", 'w') as f:
                json.dump(self.game_records, f, indent=2)
        except Exception as e:
            self.logger.error(f"Error saving game records: {str(e)}")