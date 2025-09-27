/**
 * Site Status Admin Portal
 * Dedicated page for monitoring site health and performance
 */

import MasterAdminLayout from '../../components/admin/MasterAdminLayout';
import { motion } from 'framer-motion';
import SiteStatusReport from '../../components/admin/SiteStatusReport';
import { RequireAuth } from '../../components/SecureAuth';

function SiteStatusPortal() {
  return (
    <MasterAdminLayout
      currentSection="status"
      pageTitle="📊 System Status"
      pageDescription="Real-time site health monitoring, performance metrics, and system diagnostics"
    >

      {/* Site Status Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6">
          <SiteStatusReport />
        </div>
      </motion.div>
    </MasterAdminLayout>
  );
}

// Secure wrapper for site status portal
export default function SiteStatusPage() {
  return (
    <RequireAuth>
      <SiteStatusPortal />
    </RequireAuth>
  );
}