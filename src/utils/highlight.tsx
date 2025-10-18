import React from 'react';
import {Text} from 'react-native';

export function highlightSnippet(snippet: string, query: string): React.ReactNode[] {
  if (!query) {
    return [snippet];
  }
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(token => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!tokens.length) {
    return [snippet];
  }
  const pattern = new RegExp(`(${tokens.join('|')})`, 'gi');
  const parts = snippet.split(pattern);
  return parts.map((part, index) => {
    if (part.match(pattern)) {
      return (
        <Text key={index} style={{fontWeight: 'bold'}}>
          {part}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
}
