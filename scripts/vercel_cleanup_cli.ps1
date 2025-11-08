<#
vercel_cleanup_cli.ps1

Interactive, safe helper to list Vercel projects and remove a selected project using the Vercel CLI.
Run locally in PowerShell. This script does NOT run any deletions without explicit confirmation.
#>

# Check for vercel CLI
$vercelCmd = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelCmd) {
    Write-Host "Vercel CLI not found on PATH." -ForegroundColor Yellow
    $install = Read-Host "Do you want to install it now globally with npm? (y/N)"
    if ($install -match '^[Yy]') {
        npm i -g vercel
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to install vercel CLI. Please install it manually and re-run this script." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Install the Vercel CLI and re-run. Exiting." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host "Make sure you are logged into Vercel in this terminal." -ForegroundColor Cyan
Write-Host "If needed, run: vercel login" -ForegroundColor Cyan

$continue = Read-Host "Press Enter to continue (or Ctrl+C to cancel)"

# Show projects (human-readable). The exact command may differ by CLI version.
Write-Host "Listing Vercel projects (raw output from CLI):" -ForegroundColor Green
try {
    vercel projects ls --confirm 2>&1 | Out-Host
} catch {
    # fallback to older commands
    try {
        vercel projects list 2>&1 | Out-Host
    } catch {
        Write-Host "Unable to list projects with vercel CLI. You can still provide a project name manually." -ForegroundColor Yellow
    }
}

$project = Read-Host "Enter the project name or id you want to delete (or leave blank to cancel)"
if ([string]::IsNullOrWhiteSpace($project)) {
    Write-Host "No project selected. Exiting." -ForegroundColor Yellow
    exit 0
}

Write-Host "You chose: $project" -ForegroundColor Cyan
$confirm = Read-Host "To confirm deletion type the project name exactly (type 'CANCEL' to abort)"
if ($confirm -ne $project) {
    Write-Host "Confirmation did not match. Aborting." -ForegroundColor Red
    exit 0
}

# Remove the project using vercel CLI. This will delete the project and its deployments.
Write-Host "Deleting project: $project" -ForegroundColor Red
try {
    # `vercel remove <project>` is the common command, but exact CLI might differ.
    vercel remove $project --yes
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Project removed successfully." -ForegroundColor Green
    } else {
        Write-Host "vercel CLI returned a non-zero exit code. Check output above." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Failed to remove project via vercel CLI. Error: $_" -ForegroundColor Red
}

Write-Host "Done. If any tokens or Git integrations exist, visit the Vercel dashboard to revoke them." -ForegroundColor Cyan
