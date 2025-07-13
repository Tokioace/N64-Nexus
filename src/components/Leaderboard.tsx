/**
 * Leaderboard Component für Battle64 Speedrun Events
 * 
 * Zeigt Ranglisten mit Kategorie-Filterung und visuellen Indikatoren
 */

import { 
  RunSubmission, 
  CategoryConfig, 
  CategorySystem,
  GameRegion,
  Platform,
  FairnessLevel
} from '../models/CategorySystem';

interface LeaderboardProps {
  submissions: RunSubmission[];
  selectedCategory?: CategoryConfig;
  onCategoryChange?: (category: CategoryConfig | undefined) => void;
  showAllCategories?: boolean;
}

interface LeaderboardEntry {
  rank: number;
  submission: RunSubmission;
  username: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  submissions,
  selectedCategory,
  onCategoryChange,
  showAllCategories = false
}) => {
  
  // Filtere Submissions nach Kategorie
  const getFilteredSubmissions = (): RunSubmission[] => {
    let filtered = submissions.filter(s => !s.disqualified);
    
    if (selectedCategory) {
      filtered = filtered.filter(s => 
        CategorySystem.generateCategoryId(s.category) === CategorySystem.generateCategoryId(selectedCategory)
      );
    }
    
    return filtered.sort((a, b) => a.time - b.time);
  };

  // Gruppiere Submissions nach Kategorien
  const getSubmissionsByCategory = (): Record<string, RunSubmission[]> => {
    const grouped: Record<string, RunSubmission[]> = {};
    
    submissions.filter(s => !s.disqualified).forEach(submission => {
      const categoryId = CategorySystem.generateCategoryId(submission.category);
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(submission);
    });

    // Sortiere jede Kategorie nach Zeit
    Object.keys(grouped).forEach(categoryId => {
      grouped[categoryId].sort((a, b) => a.time - b.time);
    });

    return grouped;
  };

  // Formatiere Zeit in lesbarem Format
  const formatTime = (timeMs: number): string => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((timeMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  // Generiere Ranglisten-Einträge
  const generateLeaderboardEntries = (submissions: RunSubmission[]): LeaderboardEntry[] => {
    return submissions.map((submission, index) => ({
      rank: index + 1,
      submission,
      username: `Player_${submission.userId.slice(-4)}` // Vereinfachte Username-Anzeige
    }));
  };

  // Rendere eine einzelne Kategorie-Rangliste
  const renderCategoryLeaderboard = (category: CategoryConfig, submissions: RunSubmission[]) => {
    const entries = generateLeaderboardEntries(submissions);
    const categoryId = CategorySystem.generateCategoryId(category);
    const isSelected = selectedCategory && CategorySystem.generateCategoryId(selectedCategory) === categoryId;

    return (
      <div 
        key={categoryId}
        className={`mb-8 p-4 border-2 rounded-lg ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
      >
        {/* Kategorie-Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {CategorySystem.getCategoryIcons(category).map((icon, index) => (
              <span key={index} className="text-2xl">{icon}</span>
            ))}
            <h3 className="text-lg font-semibold">
              {CategorySystem.getCategoryDisplayName(category)}
            </h3>
          </div>
          <div className="text-sm text-gray-600">
            {submissions.length} Teilnehmer
          </div>
        </div>

        {/* Rangliste */}
        {entries.length > 0 ? (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div 
                key={entry.submission.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {/* Rang */}
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                      entry.rank === 2 ? 'bg-gray-300 text-gray-700' :
                      entry.rank === 3 ? 'bg-orange-400 text-orange-900' :
                      'bg-gray-100 text-gray-600'}
                  `}>
                    {entry.rank}
                  </div>
                  <div>
                    <div className="font-medium">{entry.username}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.submission.submissionDate).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </div>

                {/* Zeit und Status */}
                <div className="text-right">
                  <div className="text-xl font-mono font-bold">
                    {formatTime(entry.submission.time)}
                  </div>
                  <div className="flex items-center justify-end space-x-2 text-xs">
                    {entry.submission.verified && (
                      <span className="text-green-600">✓ Verifiziert</span>
                    )}
                    {entry.submission.glitchDeclaration && (
                      <span className="text-red-600">🟥 Glitchrun</span>
                    )}
                    {entry.submission.videoUrl && (
                      <a 
                        href={entry.submission.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        📹 Video
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Noch keine Submissions in dieser Kategorie
          </div>
        )}
      </div>
    );
  };

  // Rendere Kategorie-Filter
  const renderCategoryFilter = () => {
    const allCategories = CategorySystem.getAllPossibleCategories();
    const submissionsByCategory = getSubmissionsByCategory();

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">🏆 Kategorie-Filter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allCategories.map(category => {
            const categoryId = CategorySystem.generateCategoryId(category);
            const submissions = submissionsByCategory[categoryId] || [];
            const isSelected = selectedCategory && CategorySystem.generateCategoryId(selectedCategory) === categoryId;

            return (
              <button
                key={categoryId}
                onClick={() => onCategoryChange?.(isSelected ? undefined : category)}
                className={`
                  p-3 border-2 rounded-lg text-left transition-all
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {CategorySystem.getCategoryIcons(category).map((icon, index) => (
                      <span key={index} className="text-lg">{icon}</span>
                    ))}
                    <span className="font-medium text-sm">
                      {CategorySystem.getCategoryDisplayName(category)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {submissions.length}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="leaderboard">
      <h2 className="text-2xl font-bold mb-6">🏁 Speedrun Leaderboard</h2>
      
      {/* Kategorie-Filter */}
      {onCategoryChange && renderCategoryFilter()}

      {/* Ranglisten */}
      {showAllCategories ? (
        // Zeige alle Kategorien
        Object.entries(getSubmissionsByCategory()).map(([categoryId, submissions]) => {
          const category = submissions[0]?.category;
          if (!category) return null;
          return renderCategoryLeaderboard(category, submissions);
        })
      ) : (
        // Zeige gefilterte Rangliste
        renderCategoryLeaderboard(
          selectedCategory || { region: GameRegion.PAL, platform: Platform.ORIGINAL_CONSOLE },
          getFilteredSubmissions()
        )
      )}

      {/* Statistiken */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">📊 Statistiken</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium">Gesamt-Teilnehmer</div>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </div>
          <div>
            <div className="font-medium">Verifiziert</div>
            <div className="text-2xl font-bold text-green-600">
              {submissions.filter(s => s.verified).length}
            </div>
          </div>
          <div>
            <div className="font-medium">Glitchruns</div>
            <div className="text-2xl font-bold text-red-600">
              {submissions.filter(s => s.glitchDeclaration).length}
            </div>
          </div>
          <div>
            <div className="font-medium">Disqualifiziert</div>
            <div className="text-2xl font-bold text-gray-600">
              {submissions.filter(s => s.disqualified).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};