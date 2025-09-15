/**
 * Simple Markdown Content Renderer
 * Renders basic markdown formatting for block editors
 */

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  // Simple markdown parsing
  const parseContent = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('**') && line.endsWith('**')) {
          const headerText = line.slice(2, -2);
          // Check if this looks like a main title (has certain keywords or is the first header)
          const isMainTitle = headerText.includes('Ready to') || headerText.includes('Join') || index === 0;
          return (
            <h2 key={index} className={isMainTitle ? 'text-3xl font-bold text-gray-800 mb-4' : 'text-xl font-semibold text-gray-800 mb-3 mt-6 first:mt-0'}>
              {headerText}
            </h2>
          );
        }
        
        // Bullet points
        if (line.startsWith('• ')) {
          return (
            <li key={index} className="ml-4">
              {line.slice(2)}
            </li>
          );
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <div key={index} className="h-2"></div>;
        }
        
        // Regular paragraphs
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {line}
          </p>
        );
      });
  };

  return (
    <div className={`prose max-w-none ${className}`}>
      {parseContent(content)}
    </div>
  );
}