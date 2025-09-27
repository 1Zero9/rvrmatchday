/**
 * News Management Admin Portal
 * Dedicated page for creating and managing news articles
 */

import MasterAdminLayout from '../../components/admin/MasterAdminLayout';
import NewsManager from '../../components/admin/NewsManager';
import { RequireAuth } from '../../components/SecureAuth';

function NewsManagementPortal() {
  return (
    <MasterAdminLayout
      currentSection="news"
      pageTitle="📰 News & Articles"
      pageDescription="Create and manage news articles, announcements, and press releases with rich content editing"
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <NewsManager />
      </div>
    </MasterAdminLayout>
  );
}

// Secure wrapper for news management portal
export default function NewsManagementPage() {
  return (
    <RequireAuth>
      <NewsManagementPortal />
    </RequireAuth>
  );
}