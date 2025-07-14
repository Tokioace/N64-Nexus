"""
Battle64 Player Analysis System
Analyzes player behavior and provides personalized recommendations
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
import json

@dataclass
class PlayerProfile:
    """Player profile with classification and preferences"""
    player_id: str
    player_type: str  # 'speedrunner', 'collector', 'artist', 'casual', 'competitive'
    confidence: float
    preferences: Dict
    activity_patterns: Dict
    recommendations: List[str]

@dataclass
class ActivityMetrics:
    """Player activity metrics"""
    events_participated: int
    screenshots_uploaded: int
    fanart_created: int
    comments_made: int
    likes_given: int
    total_xp: int
    average_time_rank: float
    completion_rate: float

class PlayerAnalyzer:
    """Analyzes player behavior and provides personalized insights"""
    
    def __init__(self, player_data_path: str = "data/player_data.json"):
        self.player_data = self._load_player_data(player_data_path)
        self.logger = logging.getLogger(__name__)
        
        # Initialize clustering model
        self.kmeans = KMeans(n_clusters=5, random_state=42)
        self.scaler = StandardScaler()
        
        # Player type definitions
        self.player_types = {
            'speedrunner': {
                'description': 'Focuses on completing games as fast as possible',
                'characteristics': ['fast_times', 'high_rankings', 'event_focus'],
                'preferences': ['time_trials', 'speed_runs', 'competitive_events']
            },
            'collector': {
                'description': 'Enjoys collecting achievements and completing everything',
                'characteristics': ['high_completion', 'achievement_focus', 'thorough_exploration'],
                'preferences': ['100_percent_runs', 'achievement_hunting', 'collection_events']
            },
            'artist': {
                'description': 'Creates fanart and enjoys creative content',
                'characteristics': ['fanart_creation', 'community_engagement', 'creative_content'],
                'preferences': ['fanart_contests', 'creative_events', 'community_challenges']
            },
            'casual': {
                'description': 'Plays for fun without competitive pressure',
                'characteristics': ['moderate_participation', 'social_focus', 'enjoyment_priority'],
                'preferences': ['fun_events', 'social_activities', 'easy_challenges']
            },
            'competitive': {
                'description': 'Enjoys competitive play and rankings',
                'characteristics': ['high_rankings', 'competitive_spirit', 'performance_focus'],
                'preferences': ['ranked_events', 'tournaments', 'leaderboards']
            }
        }
    
    def _load_player_data(self, path: str) -> Dict:
        """Load player activity data"""
        try:
            with open(path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            self.logger.warning(f"Player data not found at {path}, using empty data")
            return {}
    
    def analyze_player(self, player_id: str, time_period: str = "30d") -> PlayerProfile:
        """
        Analyze player behavior and create profile
        
        Args:
            player_id: ID of the player to analyze
            time_period: Time period for analysis (7d, 30d, 90d, all)
            
        Returns:
            PlayerProfile with classification and recommendations
        """
        try:
            # Get player activity data
            player_activities = self._get_player_activities(player_id, time_period)
            
            if not player_activities:
                return PlayerProfile(
                    player_id=player_id,
                    player_type='casual',
                    confidence=0.5,
                    preferences={},
                    activity_patterns={},
                    recommendations=['Start participating in events to get personalized recommendations']
                )
            
            # Calculate activity metrics
            metrics = self._calculate_activity_metrics(player_activities)
            
            # Classify player type
            player_type, confidence = self._classify_player_type(metrics, player_activities)
            
            # Analyze preferences
            preferences = self._analyze_preferences(player_activities, player_type)
            
            # Analyze activity patterns
            activity_patterns = self._analyze_activity_patterns(player_activities)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(player_type, preferences, metrics)
            
            return PlayerProfile(
                player_id=player_id,
                player_type=player_type,
                confidence=confidence,
                preferences=preferences,
                activity_patterns=activity_patterns,
                recommendations=recommendations
            )
            
        except Exception as e:
            self.logger.error(f"Error analyzing player {player_id}: {str(e)}")
            return PlayerProfile(
                player_id=player_id,
                player_type='casual',
                confidence=0.0,
                preferences={},
                activity_patterns={},
                recommendations=['Unable to analyze player - please try again later']
            )
    
    def _get_player_activities(self, player_id: str, time_period: str) -> List[Dict]:
        """Get player activities for the specified time period"""
        try:
            player_data = self.player_data.get(player_id, {})
            activities = player_data.get('activities', [])
            
            if time_period == "all":
                return activities
            
            # Calculate cutoff date
            cutoff_date = datetime.now() - timedelta(days=int(time_period[:-1]))
            
            # Filter activities by date
            filtered_activities = []
            for activity in activities:
                activity_date = datetime.fromisoformat(activity.get('timestamp', ''))
                if activity_date >= cutoff_date:
                    filtered_activities.append(activity)
            
            return filtered_activities
            
        except Exception as e:
            self.logger.warning(f"Error getting player activities: {str(e)}")
            return []
    
    def _calculate_activity_metrics(self, activities: List[Dict]) -> ActivityMetrics:
        """Calculate various activity metrics"""
        try:
            events_participated = len([a for a in activities if a.get('type') == 'event_participation'])
            screenshots_uploaded = len([a for a in activities if a.get('type') == 'screenshot_upload'])
            fanart_created = len([a for a in activities if a.get('type') == 'fanart_creation'])
            comments_made = len([a for a in activities if a.get('type') == 'comment'])
            likes_given = len([a for a in activities if a.get('type') == 'like'])
            
            # Calculate total XP
            total_xp = sum(a.get('xp_earned', 0) for a in activities)
            
            # Calculate average time rank
            time_ranks = [a.get('time_rank', 0) for a in activities if a.get('time_rank')]
            average_time_rank = np.mean(time_ranks) if time_ranks else 0
            
            # Calculate completion rate
            completed_events = len([a for a in activities if a.get('type') == 'event_completion'])
            total_events = len([a for a in activities if a.get('type') == 'event_participation'])
            completion_rate = completed_events / total_events if total_events > 0 else 0
            
            return ActivityMetrics(
                events_participated=events_participated,
                screenshots_uploaded=screenshots_uploaded,
                fanart_created=fanart_created,
                comments_made=comments_made,
                likes_given=likes_given,
                total_xp=total_xp,
                average_time_rank=average_time_rank,
                completion_rate=completion_rate
            )
            
        except Exception as e:
            self.logger.warning(f"Error calculating metrics: {str(e)}")
            return ActivityMetrics(0, 0, 0, 0, 0, 0, 0, 0)
    
    def _classify_player_type(self, metrics: ActivityMetrics, activities: List[Dict]) -> Tuple[str, float]:
        """Classify player into a specific type"""
        try:
            # Create feature vector for classification
            features = [
                metrics.events_participated,
                metrics.screenshots_uploaded,
                metrics.fanart_created,
                metrics.comments_made,
                metrics.likes_given,
                metrics.total_xp,
                metrics.average_time_rank,
                metrics.completion_rate
            ]
            
            # Normalize features
            features_normalized = self.scaler.fit_transform([features])
            
            # Use clustering to find similar players
            cluster = self.kmeans.fit_predict(features_normalized)[0]
            
            # Map cluster to player type based on characteristics
            player_type = self._map_cluster_to_type(cluster, metrics, activities)
            
            # Calculate confidence based on how well the player fits the type
            confidence = self._calculate_type_confidence(player_type, metrics, activities)
            
            return player_type, confidence
            
        except Exception as e:
            self.logger.warning(f"Error classifying player type: {str(e)}")
            return 'casual', 0.5
    
    def _map_cluster_to_type(self, cluster: int, metrics: ActivityMetrics, activities: List[Dict]) -> str:
        """Map cluster to player type based on characteristics"""
        try:
            # Analyze characteristics to determine type
            
            # Speedrunner characteristics
            if (metrics.average_time_rank < 0.3 and 
                metrics.events_participated > 5 and 
                metrics.screenshots_uploaded > 10):
                return 'speedrunner'
            
            # Collector characteristics
            if (metrics.completion_rate > 0.8 and 
                metrics.events_participated > 3 and 
                metrics.total_xp > 1000):
                return 'collector'
            
            # Artist characteristics
            if (metrics.fanart_created > 2 and 
                metrics.comments_made > 5 and 
                metrics.likes_given > 10):
                return 'artist'
            
            # Competitive characteristics
            if (metrics.average_time_rank < 0.5 and 
                metrics.events_participated > 8 and 
                metrics.total_xp > 2000):
                return 'competitive'
            
            # Default to casual
            return 'casual'
            
        except Exception:
            return 'casual'
    
    def _calculate_type_confidence(self, player_type: str, metrics: ActivityMetrics, activities: List[Dict]) -> float:
        """Calculate confidence in player type classification"""
        try:
            type_characteristics = self.player_types[player_type]['characteristics']
            confidence_factors = []
            
            # Check speedrunner characteristics
            if 'fast_times' in type_characteristics:
                if metrics.average_time_rank < 0.3:
                    confidence_factors.append(0.9)
                elif metrics.average_time_rank < 0.5:
                    confidence_factors.append(0.7)
                else:
                    confidence_factors.append(0.3)
            
            # Check collector characteristics
            if 'high_completion' in type_characteristics:
                if metrics.completion_rate > 0.8:
                    confidence_factors.append(0.9)
                elif metrics.completion_rate > 0.6:
                    confidence_factors.append(0.7)
                else:
                    confidence_factors.append(0.3)
            
            # Check artist characteristics
            if 'fanart_creation' in type_characteristics:
                if metrics.fanart_created > 3:
                    confidence_factors.append(0.9)
                elif metrics.fanart_created > 1:
                    confidence_factors.append(0.7)
                else:
                    confidence_factors.append(0.3)
            
            # Check competitive characteristics
            if 'high_rankings' in type_characteristics:
                if metrics.average_time_rank < 0.2:
                    confidence_factors.append(0.9)
                elif metrics.average_time_rank < 0.4:
                    confidence_factors.append(0.7)
                else:
                    confidence_factors.append(0.3)
            
            # Calculate average confidence
            if confidence_factors:
                return np.mean(confidence_factors)
            else:
                return 0.5
                
        except Exception:
            return 0.5
    
    def _analyze_preferences(self, activities: List[Dict], player_type: str) -> Dict:
        """Analyze player preferences based on activities"""
        try:
            preferences = {
                'favorite_games': [],
                'preferred_event_types': [],
                'activity_times': [],
                'social_interactions': 0,
                'competitive_level': 0
            }
            
            # Analyze favorite games
            game_counts = {}
            for activity in activities:
                game = activity.get('game_title', '')
                if game:
                    game_counts[game] = game_counts.get(game, 0) + 1
            
            preferences['favorite_games'] = sorted(game_counts.items(), key=lambda x: x[1], reverse=True)[:5]
            
            # Analyze preferred event types
            event_types = [a.get('event_type', '') for a in activities if a.get('event_type')]
            event_counts = {}
            for event_type in event_types:
                event_counts[event_type] = event_counts.get(event_type, 0) + 1
            
            preferences['preferred_event_types'] = sorted(event_counts.items(), key=lambda x: x[1], reverse=True)[:3]
            
            # Analyze activity times
            activity_hours = []
            for activity in activities:
                timestamp = activity.get('timestamp', '')
                if timestamp:
                    try:
                        hour = datetime.fromisoformat(timestamp).hour
                        activity_hours.append(hour)
                    except:
                        continue
            
            if activity_hours:
                preferences['activity_times'] = [
                    f"{int(np.mean(activity_hours)):02d}:00",
                    f"{int(np.percentile(activity_hours, 75)):02d}:00"
                ]
            
            # Analyze social interactions
            social_activities = len([a for a in activities if a.get('type') in ['comment', 'like', 'fanart_creation']])
            preferences['social_interactions'] = social_activities
            
            # Analyze competitive level
            competitive_activities = len([a for a in activities if a.get('type') == 'event_participation'])
            preferences['competitive_level'] = competitive_activities
            
            return preferences
            
        except Exception as e:
            self.logger.warning(f"Error analyzing preferences: {str(e)}")
            return {}
    
    def _analyze_activity_patterns(self, activities: List[Dict]) -> Dict:
        """Analyze patterns in player activity"""
        try:
            patterns = {
                'peak_hours': [],
                'activity_frequency': 'low',
                'preferred_days': [],
                'session_length': 'short'
            }
            
            # Analyze activity by hour
            hour_counts = {}
            for activity in activities:
                timestamp = activity.get('timestamp', '')
                if timestamp:
                    try:
                        hour = datetime.fromisoformat(timestamp).hour
                        hour_counts[hour] = hour_counts.get(hour, 0) + 1
                    except:
                        continue
            
            if hour_counts:
                peak_hours = sorted(hour_counts.items(), key=lambda x: x[1], reverse=True)[:3]
                patterns['peak_hours'] = [f"{hour:02d}:00" for hour, count in peak_hours]
            
            # Analyze activity frequency
            if len(activities) > 50:
                patterns['activity_frequency'] = 'high'
            elif len(activities) > 20:
                patterns['activity_frequency'] = 'medium'
            else:
                patterns['activity_frequency'] = 'low'
            
            # Analyze preferred days
            day_counts = {}
            for activity in activities:
                timestamp = activity.get('timestamp', '')
                if timestamp:
                    try:
                        day = datetime.fromisoformat(timestamp).strftime('%A')
                        day_counts[day] = day_counts.get(day, 0) + 1
                    except:
                        continue
            
            if day_counts:
                preferred_days = sorted(day_counts.items(), key=lambda x: x[1], reverse=True)[:3]
                patterns['preferred_days'] = [day for day, count in preferred_days]
            
            return patterns
            
        except Exception as e:
            self.logger.warning(f"Error analyzing activity patterns: {str(e)}")
            return {}
    
    def _generate_recommendations(self, player_type: str, preferences: Dict, metrics: ActivityMetrics) -> List[str]:
        """Generate personalized recommendations"""
        try:
            recommendations = []
            
            # Type-specific recommendations
            type_info = self.player_types.get(player_type, {})
            type_preferences = type_info.get('preferences', [])
            
            if player_type == 'speedrunner':
                recommendations.extend([
                    "Try participating in more time trial events",
                    "Focus on improving your personal best times",
                    "Join speedrunning communities for tips and strategies"
                ])
            elif player_type == 'collector':
                recommendations.extend([
                    "Aim for 100% completion in your favorite games",
                    "Participate in achievement hunting events",
                    "Track your collection progress"
                ])
            elif player_type == 'artist':
                recommendations.extend([
                    "Create more fanart for community events",
                    "Participate in art contests and challenges",
                    "Share your creative process with the community"
                ])
            elif player_type == 'competitive':
                recommendations.extend([
                    "Join ranked tournaments and competitions",
                    "Focus on improving your rankings",
                    "Challenge other competitive players"
                ])
            else:  # casual
                recommendations.extend([
                    "Try different types of events to find what you enjoy",
                    "Engage with the community through comments and likes",
                    "Don't worry about rankings - focus on having fun"
                ])
            
            # Activity-based recommendations
            if metrics.events_participated < 3:
                recommendations.append("Try participating in more events to earn XP and rewards")
            
            if metrics.fanart_created == 0:
                recommendations.append("Consider creating fanart to express your creativity")
            
            if metrics.comments_made < 5:
                recommendations.append("Engage with the community by commenting on posts")
            
            # Preference-based recommendations
            if preferences.get('favorite_games'):
                top_game = preferences['favorite_games'][0][0]
                recommendations.append(f"Look for events featuring {top_game}")
            
            return recommendations[:5]  # Limit to 5 recommendations
            
        except Exception as e:
            self.logger.warning(f"Error generating recommendations: {str(e)}")
            return ["Try participating in different events to discover what you enjoy"]
    
    def get_similar_players(self, player_id: str, limit: int = 5) -> List[Dict]:
        """Find players with similar behavior patterns"""
        try:
            player_profile = self.analyze_player(player_id)
            
            similar_players = []
            for other_id, other_data in self.player_data.items():
                if other_id == player_id:
                    continue
                
                other_profile = self.analyze_player(other_id)
                
                # Calculate similarity score
                similarity = self._calculate_player_similarity(player_profile, other_profile)
                
                if similarity > 0.7:  # High similarity threshold
                    similar_players.append({
                        'player_id': other_id,
                        'similarity_score': similarity,
                        'player_type': other_profile.player_type
                    })
            
            # Sort by similarity and return top matches
            similar_players.sort(key=lambda x: x['similarity_score'], reverse=True)
            return similar_players[:limit]
            
        except Exception as e:
            self.logger.warning(f"Error finding similar players: {str(e)}")
            return []
    
    def _calculate_player_similarity(self, profile1: PlayerProfile, profile2: PlayerProfile) -> float:
        """Calculate similarity between two player profiles"""
        try:
            # Type similarity
            type_similarity = 1.0 if profile1.player_type == profile2.player_type else 0.3
            
            # Preference similarity
            pref1 = set(profile1.preferences.get('favorite_games', []))
            pref2 = set(profile2.preferences.get('favorite_games', []))
            
            if pref1 and pref2:
                preference_similarity = len(pref1.intersection(pref2)) / len(pref1.union(pref2))
            else:
                preference_similarity = 0.5
            
            # Activity pattern similarity
            pattern1 = profile1.activity_patterns.get('activity_frequency', 'low')
            pattern2 = profile2.activity_patterns.get('activity_frequency', 'low')
            pattern_similarity = 1.0 if pattern1 == pattern2 else 0.5
            
            # Weighted average
            similarity = (0.4 * type_similarity + 0.4 * preference_similarity + 0.2 * pattern_similarity)
            
            return similarity
            
        except Exception:
            return 0.5
    
    def update_player_data(self, player_id: str, activity: Dict):
        """Update player data with new activity"""
        try:
            if player_id not in self.player_data:
                self.player_data[player_id] = {'activities': []}
            
            # Add timestamp if not present
            if 'timestamp' not in activity:
                activity['timestamp'] = datetime.now().isoformat()
            
            self.player_data[player_id]['activities'].append(activity)
            
            # Save updated data
            self._save_player_data()
            
        except Exception as e:
            self.logger.error(f"Error updating player data: {str(e)}")
    
    def _save_player_data(self):
        """Save player data to file"""
        try:
            with open("data/player_data.json", 'w') as f:
                json.dump(self.player_data, f, indent=2)
        except Exception as e:
            self.logger.error(f"Error saving player data: {str(e)}")