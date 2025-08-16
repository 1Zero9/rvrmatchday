// src/app/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" component="h1">
        Dashboard
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Matches Card */}
        <Card>
          <CardHeader title="Matches" />
          <CardContent>
            <List>
              <ListItem>
                <ListItemText primary="RVR 2 - 1 Opponents" secondary="12 Aug 2025" />
              </ListItem>
              <ListItem>
                <ListItemText primary="RVR 0 - 0 City Juniors" secondary="5 Aug 2025" />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Players Card */}
        <Card>
          <CardHeader title="Players" />
          <CardContent>
            <List>
              <ListItem>
                <ListItemText primary="Alice Smith" secondary="Forward" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Bob Johnson" secondary="Midfield" />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader title="Stats" />
          <CardContent>
            <Typography>Goals: 12</Typography>
            <Typography>Assists: 7</Typography>
            <Typography>Clean Sheets: 3</Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
