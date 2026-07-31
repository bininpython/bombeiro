$url = "https://ujqgtuxvtnvgphrfatln.supabase.co/auth/v1/signup"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcWd0dXh2dG52Z3BocmZhdGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0NTk1MjcsImV4cCI6MjEwMTAzNTUyN30.iy5tV-uLly9iT0zgQqkDDgASP3VeEK5Z0LGPmYhKDyg"

$headers = @{
    "apikey" = $anonKey
    "Authorization" = "Bearer $anonKey"
    "Content-Type" = "application/json"
}

$body = @{
    email = "test200@bombeiro.com"
    password = "Password123!"
    data = @{
        full_name = "Test"
    }
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
} catch {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    Write-Host "Error Body: $responseBody"
}
