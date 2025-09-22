/**
 * 🏢 User Management Page
 * RVR FC - User administration dashboard
 */

import React from 'react';
import Head from 'next/head';
import { RequireAuth } from '../components/SecureAuth';
import { UserManagementApp } from '../modules/user-management';

export default function UserManagement() {
  return (
    <>
      <Head>
        <title>User Management | RVR FC</title>
        <meta name="description" content="RVR Football Club user management system" />
      </Head>
      
      <RequireAuth>
        <UserManagementApp />
      </RequireAuth>
    </>
  );
}