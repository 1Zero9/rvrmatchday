/**
 * Maintenance-Aware Navigation Component
 * Automatically checks maintenance status for navigation links
 */

import React from 'react';
import MaintenanceAwareLink from './MaintenanceAwareLink';
import { usePageMaintenanceStatus } from '../hooks/usePageMaintenanceStatus';

// Define navigation structure with maintenance checking
const NAVIGATION_STRUCTURE = {
  main: [
    { href: '/home', label: '🏠 Home' },
    { href: '/matchday', label: '⚽ MatchDay' }
  ],
  about: [
    { href: '/about', label: '🏰 Our Story' },
    { href: '/club', label: '🏛️ Club Info' }
  ],
  teams: [
    { href: '/teams', label: '👥 All Teams' },
    { href: '/teams/boys', label: '⚽ Boys Teams' },
    { href: '/teams/girls', label: '🌟 Girls Teams' },
    { href: '/teams/youth', label: '🧒 Youth Teams' },
    { href: '/teams/senior', label: '👨 Senior Teams' },
    { href: '/teams/inclusive', label: '🌈 Inclusive Football' },
    { href: '/coach', label: '👨‍🏫 Coaching Staff' }
  ],
  more: [
    { href: '/news', label: '📰 News' },
    { href: '/gallery', label: '📸 Gallery' },
    { href: '/volunteering', label: '🤝 Volunteer' },
    { href: '/fundraising', label: '💰 Fundraising' },
    { href: '/shop', label: '🛒 Club Shop' },
    { href: '/get-involved/events', label: '🎉 Events' },
    { href: '/boot-room', label: '👢 Boot Room' }
  ],
  contact: [
    { href: '/contact', label: '📞 Contact Us' },
    { href: '/join', label: '🎯 Join the Club' },
    { href: '/join/trials', label: '⚽ Trials' },
    { href: '/join/inclusive', label: '🌈 Inclusive Football' },
    { href: '/members', label: '👥 Member Area' }
  ]
};

// Extract all paths for maintenance checking
const ALL_PATHS = Object.values(NAVIGATION_STRUCTURE).flat().map(item => item.href);

interface MaintenanceAwareNavItemProps {
  href: string;
  label: string;
  className?: string;
  isMaintenanceDisabled?: boolean;
  maintenanceReason?: string;
  onClick?: () => void;
}

function MaintenanceAwareNavItem({ 
  href, 
  label, 
  className, 
  isMaintenanceDisabled, 
  maintenanceReason, 
  onClick 
}: MaintenanceAwareNavItemProps) {
  return (
    <MaintenanceAwareLink
      href={href}
      className={className}
      isMaintenanceDisabled={isMaintenanceDisabled}
      maintenanceReason={maintenanceReason}
      onClick={onClick}
    >
      {label}
    </MaintenanceAwareLink>
  );
}

interface MaintenanceAwareNavigationProps {
  children: (renderProps: {
    NavItem: React.ComponentType<MaintenanceAwareNavItemProps>;
    isLoading: boolean;
    stats: {
      total: number;
      enabled: number;
      disabled: number;
    };
  }) => React.ReactNode;
}

export default function MaintenanceAwareNavigation({ children }: MaintenanceAwareNavigationProps) {
  const { statuses, loading, isPageEnabled, getMaintenanceInfo } = usePageMaintenanceStatus(ALL_PATHS);
  
  // Create enhanced NavItem that automatically includes maintenance status
  const EnhancedNavItem: React.ComponentType<MaintenanceAwareNavItemProps> = (props) => {
    const isDisabled = !isPageEnabled(props.href);
    const maintenanceInfo = getMaintenanceInfo(props.href);
    
    return (
      <MaintenanceAwareNavItem
        {...props}
        isMaintenanceDisabled={isDisabled}
        maintenanceReason={maintenanceInfo?.maintenance_reason}
      />
    );
  };
  
  // Calculate stats
  const total = ALL_PATHS.length;
  const enabled = ALL_PATHS.filter(path => isPageEnabled(path)).length;
  const disabled = total - enabled;
  
  return (
    <>
      {children({
        NavItem: EnhancedNavItem,
        isLoading: loading,
        stats: { total, enabled, disabled }
      })}
    </>
  );
}

// Export navigation structure for use in other components
export { NAVIGATION_STRUCTURE };