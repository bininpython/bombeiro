$url = "https://ujqgtuxvtnvgphrfatln.supabase.co/auth/v1/signup"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcWd0dXh2dG52Z3BocmZhdGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0NTk1MjcsImV4cCI6MjEwMTAzNTUyN30.iy5tV-uLly9iT0zgQqkDDgASP3VeEK5Z0LGPmYhKDyg"

$headers = @{
    "apikey" = $anonKey
    "Authorization" = "Bearer $anonKey"
    "Content-Type" = "application/json"
}

$abner = @{
    email = "abner@canhoto.com"
    password = "AbnerTAF2027!"
    data = @{
        full_name = "Abner"
        nickname = "Abner"
    }
} | ConvertTo-Json

$joao = @{
    email = "joao@canhoto.com"
    password = "JoaoTAF2027!"
    data = @{
        full_name = "João Vitor"
        nickname = "João"
    }
} | ConvertTo-Json

Write-Host "Criando Abner..."
try {
    Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $abner
    Write-Host "Abner criado!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao criar Abner: $_" -ForegroundColor Red
}

Write-Host "Criando João..."
try {
    Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $joao
    Write-Host "João criado!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao criar João: $_" -ForegroundColor Red
}
