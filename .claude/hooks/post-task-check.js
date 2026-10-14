const { execSync } = require('child_process');

try {
  execSync('git diff --quiet', {
    stdio: 'ignore'
  });

  console.log('No file changes detected.');
  process.exit(0);
} catch {
  try {
    execSync('yarn local-check', {
      stdio: 'pipe',
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024
    });

    console.log('Validation passed.');
    process.exit(0);
  } catch (error) {
    const output = [error.stdout || '', error.stderr || '', error.message || '']
      .filter(Boolean)
      .join('\n');

    console.error(`
==================================================
LOCAL CHECK FAILED
==================================================

The complete validation output is below.

${output}

==================================================
END OF LOCAL CHECK OUTPUT
==================================================
`);

    process.exit(2);
  }
}
