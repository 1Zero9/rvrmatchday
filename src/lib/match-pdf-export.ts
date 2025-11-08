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

/**
 * Season Statistics Data Interface
 */
export interface SeasonStatisticsData {
  teamName: string;
  season?: string;
  matchTypes: string[];

  // Overall Stats
  played: number;
  won: number;
  drawn: number;
  lost: number;
  winPercentage: number;

  // Goals
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  avgGoalsFor: number;
  avgGoalsAgainst: number;
  cleanSheets: number;

  // Home/Away
  homeMatches: number;
  homeWins: number;
  awayMatches: number;
  awayWins: number;

  // Form & Records
  form: ('W' | 'D' | 'L')[];
  biggestWin?: { score: string; margin: number };
  biggestLoss?: { score: string; margin: number };
}

/**
 * Generates a comprehensive PDF for season statistics
 */
export async function generateStatisticsPDF(data: SeasonStatisticsData): Promise<void> {
  // Create PDF in portrait mode
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = 20;

  // Colors
  const primaryColor: [number, number, number] = [163, 42, 76]; // RVR burgundy
  const successColor: [number, number, number] = [34, 197, 94]; // Green
  const warningColor: [number, number, number] = [245, 158, 11]; // Yellow
  const dangerColor: [number, number, number] = [239, 68, 68]; // Red
  const blueColor: [number, number, number] = [59, 130, 246]; // Blue

  // Helper function to add text
  const addText = (text: string, x: number, y: number, size: number, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [0, 0, 0], align: 'left' | 'center' | 'right' = 'left') => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.setTextColor(...color);

    if (align === 'center') {
      const textWidth = doc.getTextWidth(text);
      doc.text(text, x - (textWidth / 2), y);
    } else if (align === 'right') {
      const textWidth = doc.getTextWidth(text);
      doc.text(text, x - textWidth, y);
    } else {
      doc.text(text, x, y);
    }
  };

  // Helper to draw a stat box
  const drawStatBox = (x: number, y: number, width: number, height: number, value: string, label: string, color: [number, number, number]) => {
    // Background
    doc.setFillColor(color[0], color[1], color[2], 0.1);
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, width, height, 2, 2, 'FD');

    // Value
    addText(value, x + (width / 2), y + (height / 2) - 2, 18, 'bold', color, 'center');

    // Label
    addText(label, x + (width / 2), y + (height / 2) + 5, 8, 'normal', [100, 100, 100], 'center');
  };

  // === HEADER ===
  addText('RVR FOOTBALL CLUB', pageWidth / 2, yPosition, 24, 'bold', primaryColor, 'center');
  yPosition += 8;
  addText('Season Statistics Report', pageWidth / 2, yPosition, 14, 'normal', [100, 100, 100], 'center');
  yPosition += 15;

  // Header line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Team and Season Info
  addText(data.teamName, margin, yPosition, 16, 'bold', primaryColor);
  yPosition += 6;
  if (data.season) {
    addText(`Season: ${data.season}`, margin, yPosition, 10, 'normal', [100, 100, 100]);
    yPosition += 5;
  }
  if (data.matchTypes.length > 0) {
    addText(`Competitions: ${data.matchTypes.join(', ')}`, margin, yPosition, 10, 'normal', [100, 100, 100]);
  }
  yPosition += 15;

  // === OVERALL PERFORMANCE ===
  addText('Overall Performance', margin, yPosition, 14, 'bold', primaryColor);
  yPosition += 8;

  const boxWidth = 40;
  const boxHeight = 25;
  const gap = 5;
  const startX = margin;

  // Row 1: Played, Won, Drawn, Lost
  drawStatBox(startX, yPosition, boxWidth, boxHeight, data.played.toString(), 'Played', blueColor);
  drawStatBox(startX + boxWidth + gap, yPosition, boxWidth, boxHeight, data.won.toString(), 'Wins', successColor);
  drawStatBox(startX + (boxWidth + gap) * 2, yPosition, boxWidth, boxHeight, data.drawn.toString(), 'Draws', warningColor);
  drawStatBox(startX + (boxWidth + gap) * 3, yPosition, boxWidth, boxHeight, data.lost.toString(), 'Losses', dangerColor);
  yPosition += boxHeight + 10;

  // Win Percentage Bar
  addText('Win Rate:', margin, yPosition, 10, 'bold');
  addText(`${data.winPercentage.toFixed(1)}%`, pageWidth - margin, yPosition, 10, 'bold', successColor, 'right');
  yPosition += 5;

  // Progress bar
  const barWidth = pageWidth - (margin * 2);
  const barHeight = 6;
  doc.setFillColor(230, 230, 230);
  doc.roundedRect(margin, yPosition, barWidth, barHeight, 2, 2, 'F');

  doc.setFillColor(...successColor);
  const fillWidth = (barWidth * data.winPercentage) / 100;
  doc.roundedRect(margin, yPosition, fillWidth, barHeight, 2, 2, 'F');
  yPosition += 15;

  // === GOALS ANALYSIS ===
  addText('Goals Analysis', margin, yPosition, 14, 'bold', primaryColor);
  yPosition += 8;

  // Goals boxes
  drawStatBox(startX, yPosition, boxWidth, boxHeight, data.goalsFor.toString(), 'Goals For', successColor);
  drawStatBox(startX + boxWidth + gap, yPosition, boxWidth, boxHeight, data.goalsAgainst.toString(), 'Goals Against', dangerColor);
  drawStatBox(startX + (boxWidth + gap) * 2, yPosition, boxWidth, boxHeight, data.cleanSheets.toString(), 'Clean Sheets', blueColor);

  const gdValue = data.goalDifference > 0 ? `+${data.goalDifference}` : data.goalDifference.toString();
  const gdColor: [number, number, number] = data.goalDifference > 0 ? successColor : data.goalDifference < 0 ? dangerColor : [100, 100, 100];
  drawStatBox(startX + (boxWidth + gap) * 3, yPosition, boxWidth, boxHeight, gdValue, 'Goal Diff', gdColor);
  yPosition += boxHeight + 5;

  // Averages
  addText(`Avg Goals For: ${data.avgGoalsFor.toFixed(1)}`, margin, yPosition, 9, 'normal', [100, 100, 100]);
  addText(`Avg Goals Against: ${data.avgGoalsAgainst.toFixed(1)}`, margin + 60, yPosition, 9, 'normal', [100, 100, 100]);

  if (data.played > 0) {
    const cleanSheetPercentage = ((data.cleanSheets / data.played) * 100).toFixed(1);
    addText(`Clean Sheet Rate: ${cleanSheetPercentage}%`, margin + 120, yPosition, 9, 'normal', [100, 100, 100]);
  }
  yPosition += 15;

  // === HOME vs AWAY ===
  addText('Home & Away Performance', margin, yPosition, 14, 'bold', primaryColor);
  yPosition += 8;

  // Home performance
  const homeWinRate = data.homeMatches > 0 ? ((data.homeWins / data.homeMatches) * 100).toFixed(1) : '0.0';
  const homeLosses = data.homeMatches - data.homeWins;

  addText('Home Record:', margin, yPosition, 11, 'bold');
  addText(`${data.homeWins}W - ${homeLosses}L`, margin + 40, yPosition, 11, 'normal', successColor);
  addText(`(${homeWinRate}%)`, margin + 70, yPosition, 9, 'normal', [100, 100, 100]);
  yPosition += 8;

  // Away performance
  const awayWinRate = data.awayMatches > 0 ? ((data.awayWins / data.awayMatches) * 100).toFixed(1) : '0.0';
  const awayLosses = data.awayMatches - data.awayWins;

  addText('Away Record:', margin, yPosition, 11, 'bold');
  addText(`${data.awayWins}W - ${awayLosses}L`, margin + 40, yPosition, 11, 'normal', blueColor);
  addText(`(${awayWinRate}%)`, margin + 70, yPosition, 9, 'normal', [100, 100, 100]);
  yPosition += 15;

  // === RECENT FORM ===
  addText('Recent Form', margin, yPosition, 14, 'bold', primaryColor);
  yPosition += 8;

  if (data.form.length > 0) {
    addText(`Last ${data.form.length} matches:`, margin, yPosition, 10, 'normal', [100, 100, 100]);
    yPosition += 7;

    // Draw form circles
    const circleSize = 8;
    const circleGap = 3;
    let xPos = margin;

    data.form.forEach((result, index) => {
      const color = result === 'W' ? successColor : result === 'D' ? warningColor : dangerColor;

      doc.setFillColor(...color);
      doc.circle(xPos + circleSize / 2, yPosition, circleSize / 2, 'F');

      // Letter inside circle
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      const textWidth = doc.getTextWidth(result);
      doc.text(result, xPos + (circleSize - textWidth) / 2, yPosition + 2);

      xPos += circleSize + circleGap;
    });
  } else {
    addText('No matches played yet', margin, yPosition, 10, 'normal', [150, 150, 150]);
  }
  yPosition += 15;

  // === RECORDS & ACHIEVEMENTS ===
  if (data.biggestWin || data.biggestLoss) {
    addText('Notable Results', margin, yPosition, 14, 'bold', primaryColor);
    yPosition += 8;

    if (data.biggestWin && data.biggestWin.margin > 0) {
      addText('Biggest Win:', margin, yPosition, 10, 'bold');
      addText(data.biggestWin.score, margin + 35, yPosition, 10, 'bold', successColor);
      addText(`(+${data.biggestWin.margin} goal margin)`, margin + 60, yPosition, 8, 'normal', [100, 100, 100]);
      yPosition += 7;
    }

    if (data.biggestLoss && data.biggestLoss.margin > 0) {
      addText('Biggest Loss:', margin, yPosition, 10, 'bold');
      addText(data.biggestLoss.score, margin + 35, yPosition, 10, 'bold', dangerColor);
      addText(`(-${data.biggestLoss.margin} goal margin)`, margin + 60, yPosition, 8, 'normal', [100, 100, 100]);
      yPosition += 7;
    }
    yPosition += 8;
  }

  // === SUMMARY BOX ===
  yPosition += 5;
  const summaryBoxHeight = 35;

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), summaryBoxHeight, 3, 3, 'FD');

  yPosition += 8;
  addText('Season Summary', margin + 5, yPosition, 12, 'bold', primaryColor);
  yPosition += 7;

  const summaryText = `${data.teamName} has played ${data.played} matches with a ${data.winPercentage.toFixed(1)}% win rate. ` +
    `The team has scored ${data.goalsFor} goals (${data.avgGoalsFor.toFixed(1)} avg) and conceded ${data.goalsAgainst} ` +
    `(${data.avgGoalsAgainst.toFixed(1)} avg), with ${data.cleanSheets} clean sheets. ` +
    `Performance: ${data.homeWins} home wins from ${data.homeMatches} matches, ` +
    `${data.awayWins} away wins from ${data.awayMatches} matches.`;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const splitSummary = doc.splitTextToSize(summaryText, pageWidth - (margin * 2) - 10);
  doc.text(splitSummary, margin + 5, yPosition);

  // === FOOTER ===
  const footerY = pageHeight - 20;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  addText('RVR Football Club - Season Statistics', pageWidth / 2, footerY + 5, 8, 'normal', [150, 150, 150], 'center');

  const timestamp = new Date().toLocaleString('en-GB');
  addText(`Generated: ${timestamp}`, pageWidth / 2, footerY + 10, 7, 'normal', [180, 180, 180], 'center');

  // Generate filename
  const season = data.season || new Date().getFullYear().toString();
  const teamSlug = data.teamName.replace(/\s/g, '_');
  const filename = `RVR_Statistics_${teamSlug}_${season}.pdf`;

  // Save the PDF
  doc.save(filename);
}
