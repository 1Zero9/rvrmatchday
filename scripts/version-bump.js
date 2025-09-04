#!/usr/bin/env node
/**
 * Automated Version Bump Script
 * Updates VERSION_CONFIG automatically based on git commits
 * 
 * Usage:
 * node scripts/version-bump.js [patch|minor|major]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERSION_CONFIG_PATH = path.join(__dirname, '../src/config/version.ts');

function getCurrentVersion() {
  const configContent = fs.readFileSync(VERSION_CONFIG_PATH, 'utf8');
  const versionMatch = configContent.match(/version:\s*["']([^"']+)["']/);
  return versionMatch ? versionMatch[1] : '1.0.0';
}

function incrementVersion(version, type = 'patch') {
  const [major, minor, patch] = version.split('.').map(Number);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

function updateVersionConfig(newVersion) {
  let configContent = fs.readFileSync(VERSION_CONFIG_PATH, 'utf8');
  
  // Update version
  configContent = configContent.replace(
    /version:\s*["'][^"']+["']/,
    `version: "${newVersion}"`
  );
  
  // Update release date
  const today = new Date().toISOString().split('T')[0];
  configContent = configContent.replace(
    /releaseDate:\s*["'][^"']+["']/,
    `releaseDate: "${today}"`
  );
  
  // Update build number
  const buildNumber = `${today.replace(/-/g, '.')}.${String(Date.now()).slice(-3)}`;
  configContent = configContent.replace(
    /buildNumber:\s*["'][^"']+["']/,
    `buildNumber: "${buildNumber}"`
  );
  
  fs.writeFileSync(VERSION_CONFIG_PATH, configContent);
  return { newVersion, buildNumber, releaseDate: today };
}

function getGitInfo() {
  try {
    const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
    return { commitHash, branch, commitCount };
  } catch (error) {
    return { commitHash: 'unknown', branch: 'unknown', commitCount: '0' };
  }
}

function determineVersionType() {
  try {
    // Get recent commit messages
    const commits = execSync('git log --oneline -5', { encoding: 'utf8' });
    
    if (commits.includes('BREAKING') || commits.includes('major')) {
      return 'major';
    } else if (commits.includes('feat') || commits.includes('feature') || commits.includes('minor')) {
      return 'minor';
    } else {
      return 'patch';
    }
  } catch (error) {
    return 'patch';
  }
}

function main() {
  const versionType = process.argv[2] || determineVersionType();
  const currentVersion = getCurrentVersion();
  const newVersion = incrementVersion(currentVersion, versionType);
  
  console.log(`🚀 Bumping version from ${currentVersion} to ${newVersion} (${versionType})`);
  
  const updateInfo = updateVersionConfig(newVersion);
  const gitInfo = getGitInfo();
  
  console.log(`✅ Version updated successfully!`);
  console.log(`   Version: ${updateInfo.newVersion}`);
  console.log(`   Build: ${updateInfo.buildNumber}`);
  console.log(`   Date: ${updateInfo.releaseDate}`);
  console.log(`   Commit: ${gitInfo.commitHash.slice(0, 7)}`);
  console.log(`   Branch: ${gitInfo.branch}`);
  
  // Update package.json version too
  try {
    const packagePath = path.join(__dirname, '../package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageContent.version = newVersion;
    fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2) + '\n');
    console.log(`📦 Package.json version updated to ${newVersion}`);
  } catch (error) {
    console.warn(`⚠️  Could not update package.json: ${error.message}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getCurrentVersion, incrementVersion, updateVersionConfig };