/**
 * Maintenance-Aware Link Component
 * Shows/hides navigation links based on page maintenance status
 */

import React from 'react';
import Link from 'next/link';
import { useAuth } from './SecureAuth';

interface MaintenanceAwareLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isMaintenanceDisabled?: boolean;
  maintenanceReason?: string;
  onClick?: () => void;
}

export default function MaintenanceAwareLink({ 
  href, 
  children, 
  className = '', 
  isMaintenanceDisabled = false,
  maintenanceReason,
  onClick 
}: MaintenanceAwareLinkProps) {
  const { isAdmin } = useAuth();
  
  // Admins can always access pages, even if under maintenance
  if (isAdmin) {
    const adminClassName = isMaintenanceDisabled 
      ? `${className} opacity-50 text-gray-400` 
      : className;
      
    return (
      <Link href={href} className={adminClassName} onClick={onClick}>
        {children}
      </Link>
    );
  }
  
  // Regular users: show disabled pages as grayed out and non-clickable
  if (isMaintenanceDisabled) {
    return (
      <div className={`${className} opacity-50 text-gray-400 cursor-not-allowed`}>
        {children}
      </div>
    );
  }
  
  // Normal enabled link
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}