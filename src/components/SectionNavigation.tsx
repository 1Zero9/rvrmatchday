import Link from 'next/link';

interface NavigationItem {
  label: string;
  description: string;
  href?: string;
  isActive?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'gray';
}

interface SectionNavigationProps {
  title: string;
  items: NavigationItem[];
  className?: string;
}

export default function SectionNavigation({ title, items, className = "" }: SectionNavigationProps) {
  const getColorClasses = (color: string = 'gray', isActive: boolean = false) => {
    const colorMap = {
      blue: {
        active: 'bg-blue-50 border-blue-500',
        activeText: 'text-blue-900',
        activeDesc: 'text-blue-700',
        hover: 'hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700',
        hoverDesc: 'group-hover:text-blue-600'
      },
      green: {
        active: 'bg-green-50 border-green-500',
        activeText: 'text-green-900',
        activeDesc: 'text-green-700',
        hover: 'hover:bg-green-50 hover:border-green-500 hover:text-green-700',
        hoverDesc: 'group-hover:text-green-600'
      },
      purple: {
        active: 'bg-purple-50 border-purple-500',
        activeText: 'text-purple-900',
        activeDesc: 'text-purple-700',
        hover: 'hover:bg-purple-50 hover:border-purple-500 hover:text-purple-700',
        hoverDesc: 'group-hover:text-purple-600'
      },
      pink: {
        active: 'bg-pink-50 border-pink-500',
        activeText: 'text-pink-900',
        activeDesc: 'text-pink-700',
        hover: 'hover:bg-pink-50 hover:border-pink-500 hover:text-pink-700',
        hoverDesc: 'group-hover:text-pink-600'
      },
      orange: {
        active: 'bg-orange-50 border-orange-500',
        activeText: 'text-orange-900',
        activeDesc: 'text-orange-700',
        hover: 'hover:bg-orange-50 hover:border-orange-500 hover:text-orange-700',
        hoverDesc: 'group-hover:text-orange-600'
      },
      gray: {
        active: 'bg-gray-50 border-gray-500',
        activeText: 'text-gray-900',
        activeDesc: 'text-gray-700',
        hover: 'hover:bg-gray-100 hover:border-gray-500 hover:text-gray-700',
        hoverDesc: 'group-hover:text-gray-600'
      }
    };

    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  return (
    <div className={`mb-12 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((item, index) => {
            const colors = getColorClasses(item.color, item.isActive);
            
            if (item.href && !item.isActive) {
              return (
                <Link key={index} href={item.href} className="group">
                  <div className={`bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300 transition-all duration-200 ${colors.hover}`}>
                    <h3 className={`font-medium text-gray-900 mb-2 ${colors.hoverDesc}`}>
                      {item.label}
                    </h3>
                    <p className={`text-sm text-gray-600 ${colors.hoverDesc}`}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            }
            
            return (
              <div key={index} className={`rounded-lg p-4 border-l-4 ${colors.active}`}>
                <h3 className={`font-medium mb-2 ${colors.activeText}`}>
                  {item.label}
                </h3>
                <p className={`text-sm ${colors.activeDesc}`}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}