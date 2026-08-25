#requires -Version 5.1

<#
.SYNOPSIS
Downloads XCC actor headshots from a CSV or JSON artifact.

.DESCRIPTION
Reads rows containing NAME and HEADSHOT_URL, downloads each image into the
specified directory, and names the file after the actor. Downloads are written
to a temporary .part file and renamed only after they complete.

The script is safe to rerun: an existing, non-empty destination file is treated
as complete and skipped. An abandoned .part file is replaced automatically.
There is at least a one-second pause between download attempts.

.PARAMETER ArtifactPath
Path to a .csv or .json file containing NAME and HEADSHOT_URL fields.

.PARAMETER OutputDirectory
Directory where the downloaded actor images will be stored. It is created when
it does not already exist.

.EXAMPLE
.\scripts\download_xcc_headshots.ps1 `
  -ArtifactPath .\temp\xcc_celebrity_headshots.csv `
  -OutputDirectory D:\RandomRoll\xcc-headshots
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateScript({ Test-Path -LiteralPath $_ -PathType Leaf })]
    [string] $ArtifactPath,

    [Parameter(Mandatory = $true, Position = 1)]
    [string] $OutputDirectory
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-ArtifactRows {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Path
    )

    $extension = [System.IO.Path]::GetExtension($Path).ToLowerInvariant()

    switch ($extension) {
        ".csv" {
            return @(Import-Csv -LiteralPath $Path)
        }
        ".json" {
            return @((Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json))
        }
        default {
            throw "Unsupported artifact type '$extension'. Use a .csv or .json file."
        }
    }
}

function Get-SafeFileStem {
    param(
        [Parameter(Mandatory = $true)]
        [string] $ActorName
    )

    # These characters are forbidden in Windows filenames. Control characters
    # and trailing periods/spaces are forbidden as well.
    $stem = $ActorName -replace '[<>:"/\\|?*\x00-\x1F]', "_"
    $stem = $stem.Trim()
    $stem = $stem -replace '[ .]+$', ""

    if ([string]::IsNullOrWhiteSpace($stem)) {
        throw "Actor name '$ActorName' does not produce a usable Windows filename."
    }

    if ($stem -match '^(?i:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$') {
        $stem = "_$stem"
    }

    return $stem
}

function Get-ImageExtension {
    param(
        [Parameter(Mandatory = $true)]
        [uri] $Uri
    )

    $extension = [System.IO.Path]::GetExtension($Uri.AbsolutePath).ToLowerInvariant()
    $supportedExtensions = @(".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif")

    if ($supportedExtensions -notcontains $extension) {
        throw "URL '$Uri' does not end in a supported image extension."
    }

    return $extension
}

$resolvedArtifactPath = (Resolve-Path -LiteralPath $ArtifactPath).Path

if (-not (Test-Path -LiteralPath $OutputDirectory -PathType Container)) {
    $null = New-Item -ItemType Directory -Path $OutputDirectory -Force
}

$resolvedOutputDirectory = (Resolve-Path -LiteralPath $OutputDirectory).Path
$rows = @(Get-ArtifactRows -Path $resolvedArtifactPath)

if ($rows.Count -eq 0) {
    throw "Artifact '$resolvedArtifactPath' contains no rows."
}

# Validate the entire artifact and detect filename collisions before starting
# any network requests.
$workItems = @()
$claimedFileNames = @{}

for ($index = 0; $index -lt $rows.Count; $index++) {
    $row = $rows[$index]
    $nameProperty = $row.PSObject.Properties["NAME"]
    $urlProperty = $row.PSObject.Properties["HEADSHOT_URL"]
    $rowNumber = $index + 1

    if ($null -eq $nameProperty -or $null -eq $urlProperty) {
        throw "Artifact row $rowNumber must contain NAME and HEADSHOT_URL fields."
    }

    $actorName = ([string] $nameProperty.Value).Trim()
    $urlText = ([string] $urlProperty.Value).Trim()

    if ([string]::IsNullOrWhiteSpace($actorName)) {
        throw "Artifact row $rowNumber has an empty NAME value."
    }

    [System.Uri] $uri = $null
    if (-not [System.Uri]::TryCreate($urlText, [System.UriKind]::Absolute, [ref] $uri)) {
        throw "Artifact row $rowNumber has an invalid HEADSHOT_URL: '$urlText'."
    }

    if ($uri.Scheme -ne "https" -and $uri.Scheme -ne "http") {
        throw "Artifact row $rowNumber uses unsupported URL scheme '$($uri.Scheme)'."
    }

    $fileName = "$(Get-SafeFileStem -ActorName $actorName)$(Get-ImageExtension -Uri $uri)"

    if ($claimedFileNames.ContainsKey($fileName)) {
        $otherActor = $claimedFileNames[$fileName]
        throw "Actors '$otherActor' and '$actorName' both map to filename '$fileName'."
    }

    $claimedFileNames[$fileName] = $actorName
    $workItems += [PSCustomObject]@{
        ActorName = $actorName
        Uri = $uri
        FileName = $fileName
    }
}

$downloadedCount = 0
$skippedCount = 0
$failedItems = @()
$downloadAttempted = $false

Write-Host ""
Write-Host "XCC headshot downloader" -ForegroundColor Cyan
Write-Host "Artifact : $resolvedArtifactPath"
Write-Host "Output   : $resolvedOutputDirectory"
Write-Host "Images   : $($workItems.Count)"
Write-Host ""

for ($index = 0; $index -lt $workItems.Count; $index++) {
    $item = $workItems[$index]
    $destinationPath = Join-Path $resolvedOutputDirectory $item.FileName
    $partialPath = "$destinationPath.part"
    $position = $index + 1
    $percentComplete = [Math]::Floor(($position / $workItems.Count) * 100)

    Write-Progress `
        -Activity "Downloading XCC headshots" `
        -Status "$position of $($workItems.Count): $($item.ActorName)" `
        -PercentComplete $percentComplete

    if (Test-Path -LiteralPath $destinationPath -PathType Leaf) {
        $existingFile = Get-Item -LiteralPath $destinationPath

        if ($existingFile.Length -gt 0) {
            $skippedCount++
            Write-Host "[$position/$($workItems.Count)] SKIP  $($item.FileName)" -ForegroundColor DarkGray
            continue
        }
    }

    # Sleep only when another network request has already been started. Skipped
    # files do not add unnecessary delays during a resumed run.
    if ($downloadAttempted) {
        Start-Sleep -Seconds 1
    }
    $downloadAttempted = $true

    try {
        if (Test-Path -LiteralPath $partialPath) {
            Remove-Item -LiteralPath $partialPath -Force
        }

        Write-Host "[$position/$($workItems.Count)] GET   $($item.ActorName)" -ForegroundColor Yellow

        $response = Invoke-WebRequest `
            -Uri $item.Uri `
            -OutFile $partialPath `
            -PassThru `
            -MaximumRedirection 5 `
            -UseBasicParsing `
            -Headers @{ "User-Agent" = "RandomRoll-XCC-Headshot-Downloader/1.0" }

        $contentType = [string] $response.Headers["Content-Type"]
        if (-not $contentType.StartsWith("image/", [System.StringComparison]::OrdinalIgnoreCase)) {
            throw "The server returned Content-Type '$contentType' instead of an image."
        }

        $partialFile = Get-Item -LiteralPath $partialPath
        if ($partialFile.Length -le 0) {
            throw "The server returned an empty file."
        }

        Move-Item -LiteralPath $partialPath -Destination $destinationPath -Force
        $downloadedCount++
        Write-Host "[$position/$($workItems.Count)] SAVED $($item.FileName) ($($partialFile.Length) bytes)" -ForegroundColor Green
    }
    catch {
        if (Test-Path -LiteralPath $partialPath) {
            Remove-Item -LiteralPath $partialPath -Force
        }

        $failedItems += [PSCustomObject]@{
            ActorName = $item.ActorName
            Url = $item.Uri.AbsoluteUri
            Error = $_.Exception.Message
        }
        Write-Warning "[$position/$($workItems.Count)] FAILED $($item.ActorName): $($_.Exception.Message)"
    }
}

Write-Progress -Activity "Downloading XCC headshots" -Completed
Write-Host ""
Write-Host "Download summary" -ForegroundColor Cyan
Write-Host "Downloaded : $downloadedCount" -ForegroundColor Green
Write-Host "Already done: $skippedCount" -ForegroundColor DarkGray
Write-Host "Failed     : $($failedItems.Count)" -ForegroundColor $(if ($failedItems.Count -gt 0) { "Red" } else { "Green" })

if ($failedItems.Count -gt 0) {
    Write-Host ""
    Write-Host "Failed images:" -ForegroundColor Red
    $failedItems | Format-Table ActorName, Url, Error -Wrap
    throw "$($failedItems.Count) image download(s) failed. Rerun the same command to retry them."
}

Write-Host ""
Write-Host "All images are present in $resolvedOutputDirectory" -ForegroundColor Green
