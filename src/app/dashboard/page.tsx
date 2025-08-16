"use client";

import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

export default function DashboardPage() {
  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {/* Matches Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Matches" />
          <CardContent>
            <List>
              <ListItem>
                <ListItemText
                  primary="⚽ 15' Alice Smith"
                  secondary="Assist: Bob Jones"
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="⚽ 33' Charlie Doe" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Players Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Players" />
          <CardContent>
            <Typography variant="body2">
              Placeholder for players list
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Stats Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Stats" />
          <CardContent>
            <Typography variant="body2">
              Placeholder for stats
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
