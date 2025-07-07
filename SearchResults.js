import React from 'react';
import { View, Text } from 'react-native';

const SearchResults = ({ route }) => {
  const { query } = route.params; // Access the query parameter from navigation

  return (
    <View>
      <Text>Search Results for: {query}</Text>
      {/* Render search results here */}
    </View>
  );
};

export default SearchResults;