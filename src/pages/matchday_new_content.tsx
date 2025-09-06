            {/* Sidebar - Season Overview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sticky top-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl">📊</span>
                  <h3 className="text-lg font-bold text-gray-900">Season Overview</h3>
                </div>
                
                {selectedTeamId !== 'all' && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
                    <p className="text-sm font-medium text-blue-800">
                      {teams.find(t => t.id === selectedTeamId)?.name}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Played</span>
                    <span className="text-lg font-bold text-gray-900">{seasonStats.played}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-700">Won</span>
                    <span className="text-lg font-bold text-green-600">{seasonStats.won}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium text-yellow-700">Drawn</span>
                    <span className="text-lg font-bold text-yellow-600">{seasonStats.drawn}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-red-700">Lost</span>
                    <span className="text-lg font-bold text-red-600">{seasonStats.lost}</span>
                  </div>

                  <hr className="my-3 border-gray-200" />

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-700">Goals For</span>
                    <span className="text-lg font-bold text-blue-600">{seasonStats.goalsFor}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-700">Goals Against</span>
                    <span className="text-lg font-bold text-purple-600">{seasonStats.goalsAgainst}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
                    <span className="text-sm font-semibold text-gray-700">Goal Difference</span>
                    <span className={`text-lg font-bold ${
                      (seasonStats.goalsFor - seasonStats.goalsAgainst) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {seasonStats.goalsFor - seasonStats.goalsAgainst >= 0 ? '+' : ''}{seasonStats.goalsFor - seasonStats.goalsAgainst}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'results' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl">🏆</span>
                    <h2 className="text-xl font-bold text-gray-900">Latest Results</h2>
                    <span className="text-sm text-gray-500">({recentResults.length} matches)</span>
                  </div>

                  {recentResults.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">⚽</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Yet</h3>
                      <p className="text-gray-600">Match results will appear here once games are played.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {recentResults.map((match, index) => {
                        const team = teams.find(t => t.id === match.teamId);
                        const result = getMatchResult(match);
                        
                        if (!team) return null;

                        return (
                          <motion.div
                            key={match.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                          >
                            {/* Result indicator */}
                            <div className={`h-1 ${
                              result.result === 'W' ? 'bg-green-500' : 
                              result.result === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                            
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm text-gray-500">
                                    {new Date(match.scheduledDate).toLocaleDateString('en-GB', {
                                      day: 'numeric',
                                      month: 'short'
                                    })}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-900">{team.name}</span>
                                    <span className="text-gray-400">vs</span>
                                    <span className="font-semibold text-gray-900">{match.opponent}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <div className={`text-lg font-bold ${
                                    result.result === 'W' ? 'text-green-600' : 
                                    result.result === 'L' ? 'text-red-600' : 'text-yellow-600'
                                  }`}>
                                    {result.teamScore} - {result.opponentScore}
                                  </div>
                                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                    result.result === 'W' ? 'bg-green-100 text-green-700' : 
                                    result.result === 'L' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {result.result === 'W' ? 'WIN' : result.result === 'L' ? 'LOSS' : 'DRAW'}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-2 flex items-center text-xs text-gray-500 space-x-3">
                                <span className={`px-2 py-1 rounded ${
                                  match.isHomeMatch ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                }`}>
                                  {match.isHomeMatch ? 'HOME' : 'AWAY'}
                                </span>
                                <span>{match.venue}</span>
                                <span>{match.matchType}</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'fixtures' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl">📅</span>
                    <h2 className="text-xl font-bold text-gray-900">Upcoming Fixtures</h2>
                    <span className="text-sm text-gray-500">({upcomingFixtures.length} matches)</span>
                  </div>

                  {upcomingFixtures.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">📅</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Fixtures</h3>
                      <p className="text-gray-600">New fixtures will be added soon.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {upcomingFixtures.map((match, index) => {
                        const team = teams.find(t => t.id === match.teamId);
                        if (!team) return null;

                        return (
                          <motion.div
                            key={match.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm font-medium text-blue-600">
                                    {new Date(match.scheduledDate).toLocaleDateString('en-GB', {
                                      weekday: 'short',
                                      day: 'numeric',
                                      month: 'short'
                                    })}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-900">{team.name}</span>
                                    <span className="text-gray-400">vs</span>
                                    <span className="font-semibold text-gray-900">{match.opponent}</span>
                                  </div>
                                </div>
                                
                                <div className="text-sm text-gray-600">
                                  {new Date(match.scheduledDate).toLocaleTimeString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                              
                              <div className="mt-2 flex items-center text-xs text-gray-500 space-x-3">
                                <span className={`px-2 py-1 rounded ${
                                  match.isHomeMatch ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                }`}>
                                  {match.isHomeMatch ? 'HOME' : 'AWAY'}
                                </span>
                                <span>{match.venue}</span>
                                <span>{match.matchType}</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

          </div> {/* End grid */}
        </div> {/* End container */}
      </div> {/* End bg */}
    </StandardLayout>
  );
}