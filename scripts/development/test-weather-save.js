// Test script to verify weather saving
const testWeatherSave = async () => {
  console.log('Testing weather save functionality...');
  
  // Test data
  const testMatch = {
    id: '91ecf03a-abc3-4aff-9118-67540f4562bd',
    weather: 'Sunny',
    notes: 'Test weather save',
    referee: 'Yes'
  };
  
  try {
    const response = await fetch('/api/matches/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testMatch)
    });
    
    const result = await response.json();
    console.log('Weather save test result:', result);
  } catch (error) {
    console.error('Weather save test error:', error);
  }
};

// Run test
testWeatherSave();