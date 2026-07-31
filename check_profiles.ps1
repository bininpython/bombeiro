$url = "https://ujqgtuxvtnvgphrfatln.supabase.co/rest/v1/profiles"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcWd0dXh2dG52Z3BocmZhdGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0NTk1MjcsImV4cCI6MjEwMTAzNTUyN30.iy5tV-uLly9iT0zgQqkDDgASP3VeEK5Z0LGPmYhKDyg"

$headers = @{
    "apikey" = $anonKey
    "Authorization" = "Bearer $anonKey"
}

try {
    $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
    Write-Host "Perfis encontrados:"
    $response | ConvertTo-Json
} catch {
    Write-Host "Erro ao buscar perfis:"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object IO.StreamReader($stream)
    $reader.ReadToEnd()
}
