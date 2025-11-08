/**
 * Match Result PDF Export Utility
 * Generates shareable PDF reports for match results
 *
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import { jsPDF } from 'jspdf';
import { Match, Team, MatchEvent } from '../types/match-tracker';

export interface MatchResultData {
  match: Match;
  team: Team;
  teamScore: number;
  opponentScore: number;
  result: 'W' | 'L' | 'D';
  goalEvents?: MatchEvent[];
}

/**
 * Generates a PDF for a match result
 */
export async function generateMatchResultPDF(data: MatchResultData): Promise<void> {
  const { match, team, teamScore, opponentScore, result, goalEvents = [] } = data;

  // Create PDF in portrait mode
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  // Colors based on team branding
  const primaryColor: [number, number, number] = [163, 42, 76]; // RVR burgundy
  const successColor: [number, number, number] = [34, 197, 94]; // Green
  const dangerColor: [number, number, number] = [239, 68, 68]; // Red
  const neutralColor: [number, number, number] = [156, 163, 175]; // Gray

  // Helper function to add text
  const addText = (text: string, x: number, y: number, size: number, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.setTextColor(...color);
    doc.text(text, x, y);
  };

  // Header - Club Name
  addText('RVR FOOTBALL CLUB', pageWidth / 2, yPosition, 24, 'bold', primaryColor);
  doc.setTextColor(0, 0, 0);
  yPosition += 8;

  addText('Match Result Report', pageWidth / 2, yPosition, 14, 'normal', [100, 100, 100]);
  yPosition += 15;

  // Draw header line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Match Date and Type
  const matchDate = new Date(match.scheduledDate);
  const formattedDate = matchDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  addText(formattedDate, margin, yPosition, 12, 'bold');
  yPosition += 6;
  addText(`${match.matchType} Match`, margin, yPosition, 10, 'normal', [100, 100, 100]);
  yPosition += 6;
  addText(`Venue: ${match.venue || (match.isHomeMatch ? 'Home Ground' : 'Away Ground')}`, margin, yPosition, 10, 'normal', [100, 100, 100]);
  yPosition += 15;

  // Result Box
  const boxHeight = 45;
  const boxY = yPosition;

  // Background box
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, boxY, pageWidth - (margin * 2), boxHeight, 3, 3, 'FD');

  // Team names
  yPosition += 10;
  addText(team.name, margin + 10, yPosition, 14, 'bold', primaryColor);
  addText(match.opponent, pageWidth - margin - 10, yPosition, 14, 'bold', neutralColor);

  // Scores - centered and large
  yPosition += 15;
  const scoreText = `${teamScore}  -  ${opponentScore}`;
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');

  // Color the team score based on result
  const resultColor = result === 'W' ? successColor : result === 'L' ? dangerColor : neutralColor;
  doc.setTextColor(...resultColor);

  const scoreWidth = doc.getTextWidth(scoreText);
  doc.text(scoreText, (pageWidth - scoreWidth) / 2, yPosition);

  // Result badge
  yPosition += 10;
  const resultText = result === 'W' ? 'VICTORY' : result === 'L' ? 'DEFEAT' : 'DRAW';
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');

  const badgeWidth = doc.getTextWidth(resultText) + 12;
  const badgeX = (pageWidth - badgeWidth) / 2;

  doc.setFillColor(...resultColor);
  doc.roundedRect(badgeX, yPosition - 5, badgeWidth, 8, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.text(resultText, pageWidth / 2, yPosition, { align: 'center' });

  yPosition = boxY + boxHeight + 15;

  // Home/Away indicator
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const locationText = match.isHomeMatch ? '🏠 Home Match' : '✈️ Away Match';
  doc.text(locationText, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Goal Scorers Section
  if (goalEvents && goalEvents.length > 0) {
    addText('Goal Scorers', margin, yPosition, 14, 'bold', primaryColor);
    yPosition += 8;

    goalEvents.forEach((goal, index) => {
      // Goal bullet
      doc.setFillColor(...successColor);
      doc.circle(margin + 2, yPosition - 1.5, 1.5, 'F');

      // Player name
      addText(goal.playerName || 'Unknown', margin + 6, yPosition, 11, 'bold');

      // Assist if available
      if (goal.eventData?.assistPlayerName) {
        yPosition += 5;
        addText(`   Assist: ${goal.eventData.assistPlayerName}`, margin + 6, yPosition, 9, 'normal', [100, 100, 100]);
      }

      // Time
      const timeText = goal.minute ? `${goal.minute}'` : 'FT';
      const timeWidth = doc.getTextWidth(timeText);
      addText(timeText, pageWidth - margin - timeWidth, yPosition, 10, 'normal', [100, 100, 100]);

      yPosition += 8;
    });

    yPosition += 5;
  }

  // Match Details Section
  addText('Match Details', margin, yPosition, 14, 'bold', primaryColor);
  yPosition += 8;

  const details = [
    { label: 'Competition', value: match.matchType },
    { label: 'Kick-off Time', value: matchDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) },
    { label: 'Venue', value: match.venue || (match.isHomeMatch ? 'Home Ground' : 'Away Ground') },
  ];

  // Add optional details
  if (match.weather) details.push({ label: 'Weather', value: match.weather });
  if (match.attendance) details.push({ label: 'Attendance', value: match.attendance.toString() });
  if (match.referee) details.push({ label: 'Referee', value: match.referee });

  details.forEach(detail => {
    addText(`${detail.label}:`, margin + 5, yPosition, 10, 'bold');
    addText(detail.value, margin + 50, yPosition, 10, 'normal');
    yPosition += 6;
  });

  yPosition += 10;

  // Match Notes
  if (match.notes) {
    addText('Match Notes', margin, yPosition, 14, 'bold', primaryColor);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    const splitNotes = doc.splitTextToSize(match.notes, pageWidth - (margin * 2) - 10);
    doc.text(splitNotes, margin + 5, yPosition);
    yPosition += (splitNotes.length * 5) + 10;
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  addText('RVR Football Club - Match Day Report', pageWidth / 2, footerY + 5, 8, 'normal', [150, 150, 150]);

  const timestamp = new Date().toLocaleString('en-GB');
  addText(`Generated: ${timestamp}`, pageWidth / 2, footerY + 10, 7, 'normal', [180, 180, 180]);

  // Generate filename
  const dateStr = matchDate.toISOString().split('T')[0];
  const filename = `RVR_Match_${dateStr}_${team.name.replace(/\s/g, '_')}_vs_${match.opponent.replace(/\s/g, '_')}.pdf`;

  // Save the PDF
  doc.save(filename);
}

/**
 * Generates a quick share text for match results (for text messaging)
 */
export function generateShareText(data: MatchResultData): string {
  const { match, team, teamScore, opponentScore, result } = data;

  const resultEmoji = result === 'W' ? '🎉' : result === 'L' ? '💪' : '🤝';
  const resultText = result === 'W' ? 'Victory' : result === 'L' ? 'Result' : 'Draw';

  const date = new Date(match.scheduledDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  });

  return `${resultEmoji} ${resultText}!\n\n${team.name} ${teamScore} - ${opponentScore} ${match.opponent}\n\n${match.matchType} | ${date}\n${match.isHomeMatch ? '🏠 Home' : '✈️ Away'} at ${match.venue || 'our ground'}`;
}
