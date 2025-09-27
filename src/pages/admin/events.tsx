/**
 * Special Events Admin Portal
 * Dedicated page for managing promotional event cards
 */

import MasterAdminLayout from '../../components/admin/MasterAdminLayout';
import SpecialEventsManagerEnhanced from '../../components/admin/SpecialEventsManagerEnhanced';
import { RequireAuth } from '../../components/SecureAuth';

function SpecialEventsPortal() {
  return (
    <MasterAdminLayout
      currentSection="events"
      pageTitle="🎉 Special Events"
      pageDescription="Create and manage promotional event cards, announcements, and special activities"
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <SpecialEventsManagerEnhanced />
      </div>
    </MasterAdminLayout>
  );
}

// Secure wrapper for special events portal
export default function SpecialEventsPage() {
  return (
    <RequireAuth>
      <SpecialEventsPortal />
    </RequireAuth>
  );
}