# Deep scan: check for any used-but-not-imported types/names across all .ts/.tsx files
$files = Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts

# 1. Check for unused imports (lucide, ui, lib)
Write-Host "=== UNUSED IMPORTS ==="
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    
    # lucide-react
    if ($content -match 'import\s+\{([^}]+)\}\s+from\s+[''"]lucide-react[''"]') {
        $imports = $matches[1] -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
        foreach ($i in $imports) {
            $name = ($i -split ' as ')[-1].Trim()
            $count = ([regex]::Matches($content, "\b$name\b")).Count
            if ($count -le 1) { Write-Host "  UNUSED lucide: $name in $($f.FullName)" }
        }
    }

    # @/components/ui/
    $ui_matches = [regex]::Matches($content, 'import\s+\{([^}]+)\}\s+from\s+[''"]@/components/ui/[^''"]+[''"]')
    foreach ($m in $ui_matches) {
        $imports = $m.Groups[1].Value -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
        foreach ($i in $imports) {
            $name = ($i -split ' as ')[-1].Trim()
            $count = ([regex]::Matches($content, "\b$name\b")).Count
            if ($count -le 1) { Write-Host "  UNUSED UI: $name in $($f.FullName)" }
        }
    }

    # @/lib/ imports
    $lib_matches = [regex]::Matches($content, 'import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+[''"]@/lib/[^''"]+[''"]')
    foreach ($m in $lib_matches) {
        $imports = $m.Groups[1].Value -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
        foreach ($i in $imports) {
            $name = ($i -split ' as ')[-1].Trim()
            $count = ([regex]::Matches($content, "\b$name\b")).Count
            if ($count -le 1) { Write-Host "  UNUSED lib: $name in $($f.FullName)" }
        }
    }

    # ./types or ./constants relative imports  
    $rel_matches = [regex]::Matches($content, 'import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+[''"]\.\/[^''"]+[''"]')
    foreach ($m in $rel_matches) {
        $imports = $m.Groups[1].Value -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
        foreach ($i in $imports) {
            $name = ($i -split ' as ')[-1].Trim()
            $count = ([regex]::Matches($content, "\b$name\b")).Count
            if ($count -le 1) { Write-Host "  UNUSED relative: $name in $($f.FullName)" }
        }
    }
}

# 2. Check for declared-but-unused local const variables
Write-Host ""
Write-Host "=== UNUSED LOCAL VARIABLES (const) ==="
foreach ($f in $files) {
    $lines = Get-Content $f.FullName
    $content = Get-Content $f.FullName -Raw
    $lineNum = 0
    foreach ($line in $lines) {
        $lineNum++
        # Match "const varName = " that's indented (inside a function)
        if ($line -match '^\s+const\s+(\w+)\s*=') {
            $varName = $matches[1]
            # Skip destructured or common patterns
            if ($varName -eq 'supabase' -or $varName -eq 'router' -or $varName -eq 'pathname' -or $varName -eq 'searchParams' -or $varName -eq 'supabaseResponse' -or $varName -eq 'cookieStore') { continue }
            $count = ([regex]::Matches($content, "\b$varName\b")).Count
            if ($count -le 1) {
                Write-Host "  UNUSED var: $varName at $($f.Name):$lineNum"
            }
        }
    }
}

# 3. Check for type references that might not be imported  
Write-Host ""
Write-Host "=== POTENTIAL MISSING TYPE IMPORTS ==="
$knownTypes = @('TafTestType', 'TafTestConfig', 'ScoreRange', 'ScoringResult', 'FinalScoreResult', 'ProgressResult', 'TrainingResultEntry', 'MilestoneStatus', 'ResultStatus', 'OverallStatus', 'TrendType', 'ConsistencyStatus', 'MeasurementDirection', 'MeasurementUnit', 'PerceivedEffort', 'PhysicalCondition', 'GoalType', 'SessionType', 'PlannedSessionStatus', 'SimulationSourceType', 'ExperienceLevel', 'Recommendation', 'SimulationInput', 'SimulationResult', 'Milestone', 'Achievement', 'Rank', 'RankInfo', 'WeeklySummary', 'ReadinessResult')
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    foreach ($t in $knownTypes) {
        # Check if the type is used in the file (outside of its definition)
        $usages = ([regex]::Matches($content, "\b$t\b")).Count
        if ($usages -gt 0) {
            # Check if it's imported
            $imported = $content -match "import.*\b$t\b"
            $defined = $content -match "export\s+(?:type|interface)\s+$t"
            if (-not $imported -and -not $defined) {
                Write-Host "  MISSING import for $t in $($f.Name)"
            }
        }
    }
}
