"""
Battle64 Automatic Points & Ranking System
Handles XP distribution, medals, titles, and leaderboards
"""

import json
import logging
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
import numpy as np

@dataclass
class PointsResult:
    """Result of points calculation"""
    xp_earned: int
    medals_earned: List[str]
    titles_earned: List[str]
    new_rank: str
    rank_progress: float
    details: Dict

@dataclass
class LeaderboardEntry:
    """Leaderboard entry"""
    player_id: str
    player_name: str
    total_xp: int
    rank: int
    player_type: str
    recent_activity: str

class PointsSystem:
    """Manages automatic points distribution and rankings"""
    
    def __init__(self, data_path: str = "data/"):
        self.data_path = data_path
        self.logger = logging.getLogger(__name__)
        
        # Load configuration
        self.config = self._load_config()
        
        # Load player data
        self.player_data = self._load_player_data()
        
        # Load leaderboards
        self.leaderboards = self._load_leaderboards()
        
        # XP multipliers for different activities
        self.xp_multipliers = {
            'event_participation': 100,
            'event_1st_place': 500,
            'event_2nd_place': 300,
            'event_3rd_place': 200,
            'screenshot_upload': 50,
            'fanart_creation': 200,
            'comment': 10,
            'like': 5,
            'achievement_unlock': 150,
            'daily_login': 25,
            'weekly_streak': 100,
            'community_challenge': 75
        }
        
        # Medal definitions
        self.medals = {
            'gold': {'name': '🥇 Gold Medal', 'xp_bonus': 1000, 'requirement': '1st place'},
            'silver': {'name': '🥈 Silver Medal', 'xp_bonus': 600, 'requirement': '2nd place'},
            'bronze': {'name': '🥉 Bronze Medal', 'xp_bonus': 400, 'requirement': '3rd place'},
            'participation': {'name': '🎯 Participation', 'xp_bonus': 50, 'requirement': 'Event completion'},
            'speed_demon': {'name': '⚡ Speed Demon', 'xp_bonus': 800, 'requirement': 'Top 10% time'},
            'persistent': {'name': '🔄 Persistent', 'xp_bonus': 300, 'requirement': '5 events in a row'},
            'creative': {'name': '🎨 Creative', 'xp_bonus': 500, 'requirement': '3 fanart pieces'},
            'social': {'name': '💬 Social Butterfly', 'xp_bonus': 200, 'requirement': '50 comments'}
        }
        
        # Title definitions
        self.titles = {
            'pixelkünstler': {'name': 'Pixelkünstler', 'requirement': '3x Artwork of the Week'},
            'speedrunner': {'name': 'Speedrunner', 'requirement': '10 top 10 finishes'},
            'collector': {'name': 'Collector', 'requirement': '100 achievements'},
            'veteran': {'name': 'Veteran', 'requirement': '1 year membership'},
            'champion': {'name': 'Champion', 'requirement': '5 event wins'},
            'community_leader': {'name': 'Community Leader', 'requirement': '1000 likes received'},
            'explorer': {'name': 'Explorer', 'requirement': '50 different games played'},
            'perfectionist': {'name': 'Perfectionist', 'requirement': '10 100% completions'}
        }
        
        # Rank definitions
        self.ranks = [
            {'name': 'Rookie', 'min_xp': 0, 'color': '#8B4513'},
            {'name': 'Amateur', 'min_xp': 1000, 'color': '#C0C0C0'},
            {'name': 'Enthusiast', 'min_xp': 2500, 'color': '#CD7F32'},
            {'name': 'Veteran', 'min_xp': 5000, 'color': '#FFD700'},
            {'name': 'Expert', 'min_xp': 10000, 'color': '#C0C0C0'},
            {'name': 'Master', 'min_xp': 20000, 'color': '#FFD700'},
            {'name': 'Legend', 'min_xp': 50000, 'color': '#FF4500'},
            {'name': 'Mythic', 'min_xp': 100000, 'color': '#9400D3'}
        ]
    
    def _load_config(self) -> Dict:
        """Load system configuration"""
        try:
            with open(f"{self.data_path}points_config.json", 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Default configuration
            return {
                'xp_decay_rate': 0.95,  # XP decays by 5% per month
                'streak_bonus': 1.1,    # 10% bonus for streaks
                'max_daily_xp': 1000,   # Maximum XP per day
                'title_check_interval': 24  # Hours between title checks
            }
    
    def _load_player_data(self) -> Dict:
        """Load player points and achievements data"""
        try:
            with open(f"{self.data_path}player_points.json", 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def _load_leaderboards(self) -> Dict:
        """Load leaderboard data"""
        try:
            with open(f"{self.data_path}leaderboards.json", 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                'global': [],
                'monthly': [],
                'weekly': [],
                'event_specific': {}
            }
    
    def award_points(self, player_id: str, activity_type: str, activity_data: Dict) -> PointsResult:
        """
        Award points for player activity
        
        Args:
            player_id: ID of the player
            activity_type: Type of activity (event_participation, screenshot_upload, etc.)
            activity_data: Additional data about the activity
            
        Returns:
            PointsResult with earned points and achievements
        """
        try:
            # Initialize player data if not exists
            if player_id not in self.player_data:
                self.player_data[player_id] = {
                    'total_xp': 0,
                    'current_rank': 'Rookie',
                    'medals': [],
                    'titles': [],
                    'achievements': [],
                    'activity_history': [],
                    'streaks': {},
                    'last_activity': None
                }
            
            # Calculate base XP
            base_xp = self.xp_multipliers.get(activity_type, 0)
            
            # Apply multipliers based on activity data
            final_xp = self._calculate_final_xp(base_xp, activity_type, activity_data)
            
            # Check daily limits
            final_xp = self._apply_daily_limits(player_id, final_xp)
            
            # Update player data
            self.player_data[player_id]['total_xp'] += final_xp
            self.player_data[player_id]['last_activity'] = datetime.now().isoformat()
            
            # Add to activity history
            activity_record = {
                'type': activity_type,
                'xp_earned': final_xp,
                'timestamp': datetime.now().isoformat(),
                'data': activity_data
            }
            self.player_data[player_id]['activity_history'].append(activity_record)
            
            # Check for medals
            medals_earned = self._check_medals(player_id, activity_type, activity_data)
            
            # Check for titles
            titles_earned = self._check_titles(player_id)
            
            # Update rank
            new_rank, rank_progress = self._update_rank(player_id)
            
            # Update streaks
            self._update_streaks(player_id, activity_type)
            
            # Save updated data
            self._save_data()
            
            # Update leaderboards
            self._update_leaderboards(player_id)
            
            return PointsResult(
                xp_earned=final_xp,
                medals_earned=medals_earned,
                titles_earned=titles_earned,
                new_rank=new_rank,
                rank_progress=rank_progress,
                details={
                    'base_xp': base_xp,
                    'multipliers_applied': activity_data.get('multipliers', {}),
                    'daily_xp_remaining': self._get_daily_xp_remaining(player_id)
                }
            )
            
        except Exception as e:
            self.logger.error(f"Error awarding points: {str(e)}")
            return PointsResult(0, [], [], '', 0.0, {'error': str(e)})
    
    def _calculate_final_xp(self, base_xp: int, activity_type: str, activity_data: Dict) -> int:
        """Calculate final XP with all multipliers"""
        final_xp = base_xp
        
        # Event-specific multipliers
        if activity_type == 'event_participation':
            # Check placement
            placement = activity_data.get('placement', 0)
            if placement == 1:
                final_xp += self.xp_multipliers['event_1st_place']
            elif placement == 2:
                final_xp += self.xp_multipliers['event_2nd_place']
            elif placement == 3:
                final_xp += self.xp_multipliers['event_3rd_place']
            
            # Check for speed bonus
            if activity_data.get('is_top_10_percent', False):
                final_xp += self.xp_multipliers['speed_demon']
        
        # Streak bonus
        streak_multiplier = activity_data.get('streak_multiplier', 1.0)
        final_xp = int(final_xp * streak_multiplier)
        
        # Quality bonus for fanart
        if activity_type == 'fanart_creation':
            quality_score = activity_data.get('quality_score', 0.5)
            final_xp = int(final_xp * (1 + quality_score))
        
        return final_xp
    
    def _apply_daily_limits(self, player_id: str, xp_to_award: int) -> int:
        """Apply daily XP limits"""
        today = datetime.now().date().isoformat()
        daily_xp = self.player_data[player_id].get('daily_xp', {})
        today_xp = daily_xp.get(today, 0)
        
        max_daily = self.config['max_daily_xp']
        remaining = max(0, max_daily - today_xp)
        
        actual_xp = min(xp_to_award, remaining)
        
        # Update daily XP
        daily_xp[today] = today_xp + actual_xp
        self.player_data[player_id]['daily_xp'] = daily_xp
        
        return actual_xp
    
    def _check_medals(self, player_id: str, activity_type: str, activity_data: Dict) -> List[str]:
        """Check if player earned any new medals"""
        earned_medals = []
        player_medals = set(self.player_data[player_id].get('medals', []))
        
        # Check event placement medals
        if activity_type == 'event_participation':
            placement = activity_data.get('placement', 0)
            if placement == 1 and 'gold' not in player_medals:
                earned_medals.append('gold')
            elif placement == 2 and 'silver' not in player_medals:
                earned_medals.append('silver')
            elif placement == 3 and 'bronze' not in player_medals:
                earned_medals.append('bronze')
        
        # Check participation medal
        if activity_type == 'event_participation' and 'participation' not in player_medals:
            earned_medals.append('participation')
        
        # Check speed demon medal
        if (activity_type == 'event_participation' and 
            activity_data.get('is_top_10_percent', False) and 
            'speed_demon' not in player_medals):
            earned_medals.append('speed_demon')
        
        # Check persistent medal
        if self._check_persistent_medal(player_id):
            earned_medals.append('persistent')
        
        # Check creative medal
        if self._check_creative_medal(player_id):
            earned_medals.append('creative')
        
        # Check social medal
        if self._check_social_medal(player_id):
            earned_medals.append('social')
        
        # Add earned medals to player data
        for medal in earned_medals:
            if medal not in player_medals:
                self.player_data[player_id]['medals'].append(medal)
                # Award bonus XP
                bonus_xp = self.medals[medal]['xp_bonus']
                self.player_data[player_id]['total_xp'] += bonus_xp
        
        return earned_medals
    
    def _check_persistent_medal(self, player_id: str) -> bool:
        """Check if player qualifies for persistent medal"""
        history = self.player_data[player_id].get('activity_history', [])
        event_activities = [h for h in history if h['type'] == 'event_participation']
        
        if len(event_activities) < 5:
            return False
        
        # Check if last 5 events were consecutive
        recent_events = sorted(event_activities, key=lambda x: x['timestamp'])[-5:]
        
        # Simple check - in real implementation, would check for consecutive days
        return len(recent_events) >= 5
    
    def _check_creative_medal(self, player_id: str) -> bool:
        """Check if player qualifies for creative medal"""
        history = self.player_data[player_id].get('activity_history', [])
        fanart_activities = [h for h in history if h['type'] == 'fanart_creation']
        
        return len(fanart_activities) >= 3
    
    def _check_social_medal(self, player_id: str) -> bool:
        """Check if player qualifies for social medal"""
        history = self.player_data[player_id].get('activity_history', [])
        comment_activities = [h for h in history if h['type'] == 'comment']
        
        return len(comment_activities) >= 50
    
    def _check_titles(self, player_id: str) -> List[str]:
        """Check if player earned any new titles"""
        earned_titles = []
        player_titles = set(self.player_data[player_id].get('titles', []))
        
        # Check each title requirement
        for title_id, title_info in self.titles.items():
            if title_id not in player_titles and self._check_title_requirement(player_id, title_id):
                earned_titles.append(title_id)
                self.player_data[player_id]['titles'].append(title_id)
        
        return earned_titles
    
    def _check_title_requirement(self, player_id: str, title_id: str) -> bool:
        """Check if player meets title requirement"""
        history = self.player_data[player_id].get('activity_history', [])
        
        if title_id == 'pixelkünstler':
            # Check for 3 artwork of the week achievements
            artwork_weeks = [h for h in history if h.get('data', {}).get('achievement') == 'artwork_of_week']
            return len(artwork_weeks) >= 3
        
        elif title_id == 'speedrunner':
            # Check for 10 top 10 finishes
            top_10_finishes = [h for h in history if h.get('data', {}).get('placement', 0) <= 10]
            return len(top_10_finishes) >= 10
        
        elif title_id == 'collector':
            # Check for 100 achievements
            achievements = [h for h in history if h['type'] == 'achievement_unlock']
            return len(achievements) >= 100
        
        elif title_id == 'veteran':
            # Check for 1 year membership
            first_activity = history[0]['timestamp'] if history else None
            if first_activity:
                first_date = datetime.fromisoformat(first_activity)
                return (datetime.now() - first_date).days >= 365
        
        elif title_id == 'champion':
            # Check for 5 event wins
            wins = [h for h in history if h.get('data', {}).get('placement', 0) == 1]
            return len(wins) >= 5
        
        elif title_id == 'community_leader':
            # Check for 1000 likes received
            total_likes = sum(h.get('data', {}).get('likes_received', 0) for h in history)
            return total_likes >= 1000
        
        elif title_id == 'explorer':
            # Check for 50 different games
            games_played = set(h.get('data', {}).get('game_title', '') for h in history if h.get('data', {}).get('game_title'))
            return len(games_played) >= 50
        
        elif title_id == 'perfectionist':
            # Check for 10 100% completions
            completions = [h for h in history if h.get('data', {}).get('completion_percentage', 0) == 100]
            return len(completions) >= 10
        
        return False
    
    def _update_rank(self, player_id: str) -> Tuple[str, float]:
        """Update player rank based on total XP"""
        total_xp = self.player_data[player_id]['total_xp']
        
        # Find current rank
        current_rank = None
        next_rank = None
        
        for i, rank in enumerate(self.ranks):
            if total_xp >= rank['min_xp']:
                current_rank = rank
                if i + 1 < len(self.ranks):
                    next_rank = self.ranks[i + 1]
        
        if current_rank:
            self.player_data[player_id]['current_rank'] = current_rank['name']
            
            # Calculate progress to next rank
            if next_rank:
                xp_in_current = total_xp - current_rank['min_xp']
                xp_needed_for_next = next_rank['min_xp'] - current_rank['min_xp']
                progress = min(1.0, xp_in_current / xp_needed_for_next)
            else:
                progress = 1.0  # Max rank achieved
            
            return current_rank['name'], progress
        
        return 'Rookie', 0.0
    
    def _update_streaks(self, player_id: str, activity_type: str):
        """Update player streaks"""
        today = datetime.now().date().isoformat()
        streaks = self.player_data[player_id].get('streaks', {})
        
        if activity_type not in streaks:
            streaks[activity_type] = {'current': 0, 'best': 0, 'last_date': None}
        
        streak_data = streaks[activity_type]
        last_date = streak_data['last_date']
        
        if last_date:
            last_date_obj = datetime.fromisoformat(last_date).date()
            days_diff = (datetime.now().date() - last_date_obj).days
            
            if days_diff == 1:  # Consecutive day
                streak_data['current'] += 1
            elif days_diff > 1:  # Streak broken
                streak_data['current'] = 1
            # If days_diff == 0, same day, don't update
        else:
            streak_data['current'] = 1
        
        # Update best streak
        if streak_data['current'] > streak_data['best']:
            streak_data['best'] = streak_data['current']
        
        streak_data['last_date'] = today
    
    def _update_leaderboards(self, player_id: str):
        """Update all leaderboards"""
        player_data = self.player_data[player_id]
        total_xp = player_data['total_xp']
        
        # Update global leaderboard
        self._update_single_leaderboard('global', player_id, total_xp)
        
        # Update monthly leaderboard
        self._update_monthly_leaderboard(player_id, total_xp)
        
        # Update weekly leaderboard
        self._update_weekly_leaderboard(player_id, total_xp)
    
    def _update_single_leaderboard(self, leaderboard_name: str, player_id: str, xp: int):
        """Update a single leaderboard"""
        leaderboard = self.leaderboards[leaderboard_name]
        
        # Find existing entry
        existing_entry = None
        for entry in leaderboard:
            if entry['player_id'] == player_id:
                existing_entry = entry
                break
        
        if existing_entry:
            existing_entry['total_xp'] = xp
        else:
            leaderboard.append({
                'player_id': player_id,
                'total_xp': xp,
                'last_updated': datetime.now().isoformat()
            })
        
        # Sort by XP (descending)
        leaderboard.sort(key=lambda x: x['total_xp'], reverse=True)
        
        # Keep only top 100
        self.leaderboards[leaderboard_name] = leaderboard[:100]
    
    def _update_monthly_leaderboard(self, player_id: str, xp: int):
        """Update monthly leaderboard"""
        current_month = datetime.now().strftime('%Y-%m')
        leaderboard_key = f'monthly_{current_month}'
        
        if leaderboard_key not in self.leaderboards:
            self.leaderboards[leaderboard_key] = []
        
        self._update_single_leaderboard(leaderboard_key, player_id, xp)
    
    def _update_weekly_leaderboard(self, player_id: str, xp: int):
        """Update weekly leaderboard"""
        current_week = datetime.now().strftime('%Y-W%U')
        leaderboard_key = f'weekly_{current_week}'
        
        if leaderboard_key not in self.leaderboards:
            self.leaderboards[leaderboard_key] = []
        
        self._update_single_leaderboard(leaderboard_key, player_id, xp)
    
    def get_leaderboard(self, leaderboard_type: str = 'global', limit: int = 50) -> List[LeaderboardEntry]:
        """Get leaderboard entries"""
        try:
            leaderboard_data = self.leaderboards.get(leaderboard_type, [])
            
            entries = []
            for i, entry in enumerate(leaderboard_data[:limit]):
                player_id = entry['player_id']
                player_data = self.player_data.get(player_id, {})
                
                entries.append(LeaderboardEntry(
                    player_id=player_id,
                    player_name=player_data.get('player_name', f'Player_{player_id}'),
                    total_xp=entry['total_xp'],
                    rank=i + 1,
                    player_type=player_data.get('player_type', 'casual'),
                    recent_activity=entry.get('last_updated', 'Unknown')
                ))
            
            return entries
            
        except Exception as e:
            self.logger.error(f"Error getting leaderboard: {str(e)}")
            return []
    
    def get_player_stats(self, player_id: str) -> Dict:
        """Get comprehensive player statistics"""
        try:
            if player_id not in self.player_data:
                return {}
            
            player_data = self.player_data[player_id]
            history = player_data.get('activity_history', [])
            
            stats = {
                'total_xp': player_data['total_xp'],
                'current_rank': player_data['current_rank'],
                'medals': player_data.get('medals', []),
                'titles': player_data.get('titles', []),
                'activity_count': len(history),
                'streaks': player_data.get('streaks', {}),
                'recent_activities': history[-10:] if history else [],
                'achievements': player_data.get('achievements', [])
            }
            
            # Calculate additional stats
            if history:
                stats['first_activity'] = history[0]['timestamp']
                stats['last_activity'] = history[-1]['timestamp']
                
                # Activity breakdown
                activity_types = {}
                for activity in history:
                    activity_type = activity['type']
                    activity_types[activity_type] = activity_types.get(activity_type, 0) + 1
                stats['activity_breakdown'] = activity_types
            
            return stats
            
        except Exception as e:
            self.logger.error(f"Error getting player stats: {str(e)}")
            return {}
    
    def _get_daily_xp_remaining(self, player_id: str) -> int:
        """Get remaining daily XP for player"""
        today = datetime.now().date().isoformat()
        daily_xp = self.player_data[player_id].get('daily_xp', {})
        today_xp = daily_xp.get(today, 0)
        
        return max(0, self.config['max_daily_xp'] - today_xp)
    
    def _save_data(self):
        """Save all data to files"""
        try:
            # Save player data
            with open(f"{self.data_path}player_points.json", 'w') as f:
                json.dump(self.player_data, f, indent=2)
            
            # Save leaderboards
            with open(f"{self.data_path}leaderboards.json", 'w') as f:
                json.dump(self.leaderboards, f, indent=2)
            
            # Save config
            with open(f"{self.data_path}points_config.json", 'w') as f:
                json.dump(self.config, f, indent=2)
                
        except Exception as e:
            self.logger.error(f"Error saving data: {str(e)}")