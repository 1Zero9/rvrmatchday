/**
 * User Management Admin Portal
 * Dedicated page for comprehensive user account management
 */

import MasterAdminLayout from '../../components/admin/MasterAdminLayout';
import UnifiedAccountManagement from '../../components/UnifiedAccountManagement';
import { RequireAuth } from '../../components/SecureAuth';

function UserManagementPortal() {
  return (
    <MasterAdminLayout
      currentSection="users"
      pageTitle="👥 User Management"
      pageDescription="Comprehensive user account management with full CRUD operations, role management, and audit trails"
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <UnifiedAccountManagement />
      </div>
    </MasterAdminLayout>
  );
}

// Secure wrapper for user management portal
export default function UserManagementPage() {
  return (
    <RequireAuth>
      <UserManagementPortal />
    </RequireAuth>
  );
}