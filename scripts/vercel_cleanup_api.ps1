<#
vercel_cleanup_api.ps1

PowerShell helper that uses the Vercel REST API to list and optionally delete deployments for a project.
Requires a Vercel Personal Token with appropriate permissions.

Usage:
  # Pass token interactively or set environment variable VERCEL_TOKEN
  $env:VERCEL_TOKEN = Read-Host -AsSecureString "Enter Vercel Personal Token" | ConvertFrom-SecureString
  # Or export plaintext before running:
  $env:VERCEL_TOKEN = '<YOUR_TOKEN>'

  # Then run the script:
  .\vercel_cleanup_api.ps1

WARNING: deletes are irreversible. This script will prompt for confirmation before deleting.
#>

function Get-Token {
    if ($env:VERCEL_TOKEN) { return $env:VERCEL_TOKEN }
    $token = Read-Host "Enter your Vercel Personal Token (will not be stored)"
    return $token
}

$token = Get-Token
if ([string]::IsNullOrEmpty($token)) { Write-Host "No token provided; exiting." -ForegroundColor Red; exit 1 }

$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }

# List projects
Write-Host "Fetching projects..." -ForegroundColor Cyan
$projects = Invoke-RestMethod -Method Get -Uri "https://api.vercel.com/v9/projects" -Headers $headers
if (-not $projects) { Write-Host "Failed to fetch projects or none found." -ForegroundColor Yellow; exit 1 }

$projects.projects | ForEach-Object {
    Write-Host "ID: $($_.id)   Name: $($_.name)"
}

$projectId = Read-Host "Enter the project ID to inspect (or blank to exit)"
if ([string]::IsNullOrWhiteSpace($projectId)) { Write-Host "No project selected. Exiting." -ForegroundColor Yellow; exit 0 }

# List deployments for project
Write-Host "Listing deployments for project $projectId..." -ForegroundColor Cyan
$deployments = Invoke-RestMethod -Method Get -Uri "https://api.vercel.com/v13/deployments?projectId=$projectId" -Headers $headers
if (-not $deployments || -not $deployments.deployments) { Write-Host "No deployments found or request failed." -ForegroundColor Yellow }
else {
    $deployments.deployments | ForEach-Object {
        Write-Host "deploymentId: $($_.uid)  url: $($_.url)  state: $($_.state)  created: $($_.created)"
    }
}

$del = Read-Host "Do you want to delete all listed deployments? Type YES to confirm"
if ($del -ne 'YES') { Write-Host "Aborting deletion." -ForegroundColor Yellow; exit 0 }

foreach ($d in $deployments.deployments) {
    $id = $d.uid
    Write-Host "Deleting deployment $id ..." -ForegroundColor Red
    try {
        Invoke-RestMethod -Method Delete -Uri "https://api.vercel.com/v13/deployments/$id" -Headers $headers
        Write-Host "Deleted $id" -ForegroundColor Green
    } catch {
        Write-Host "Failed to delete $id: $_" -ForegroundColor Red
    }
}

Write-Host "Finished. If you want to delete the project itself via API, use the Dashboard or API carefully." -ForegroundColor Cyan
