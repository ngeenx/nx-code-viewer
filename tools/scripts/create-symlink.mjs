import { existsSync, mkdirSync, symlinkSync, unlinkSync, lstatSync } from 'fs';
import { dirname, resolve } from 'path';

const [, , source, target] = process.argv;

if (!source || !target) {
  console.error('Usage: node create-symlink.mjs <source> <target>');
  process.exit(1);
}

const absoluteSource = resolve(process.cwd(), source);
const absoluteTarget = resolve(process.cwd(), target);

// Ensure source exists
if (!existsSync(absoluteSource)) {
  console.error(`Source does not exist: ${absoluteSource}`);
  process.exit(1);
}

// Create target directory if it doesn't exist
const targetDir = dirname(absoluteTarget);
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

// Remove existing symlink/file if exists
if (existsSync(absoluteTarget) || lstatSync(absoluteTarget, { throwIfNoEntry: false })) {
  try {
    unlinkSync(absoluteTarget);
  } catch {
    // Ignore if doesn't exist
  }
}

// Create symlink (use 'junction' on Windows for directories, 'file' for files)
try {
  symlinkSync(absoluteSource, absoluteTarget, 'file');
  console.log(`Symlink created: ${target} -> ${source}`);
} catch (error) {
  console.error(`Failed to create symlink: ${error.message}`);
  process.exit(1);
}
