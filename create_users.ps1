$url = "https://ujqgtuxvtnvgphrfatln.supabase.co/auth/v1/signup"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcWd0dXh2dG52Z3BocmZhdGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0NTk1MjcsImV4cCI6MjEwMTAzNTUyN30.iy5tV-uLly9iT0zgQqkDDgASP3VeEK5Z0LGPmYhKDyg"

$headers = @{
    "apikey" = $anonKey
    "Authorization" = "Bearer $anonKey"
    "Content-Type" = "application/json"
}

$joao = @{
    email = "joao@cbmmg.com"
    password = "12345678"
    data = @{
        full_name = "João Victor"
        nickname = "João"
    }
} | ConvertTo-Json

$abner = @{
    email = "abner@cbmmg.com"
    password = "12345678"
    data = @{
        full_name = "Abner"
        nickname = "Abner"
    }
} | ConvertTo-Json

Write-Host "Criando Joao..."
try {
    $res = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $joao
    Write-Host "João criado com sucesso!"
} catch {
    Write-Host "Erro Joao: $($_.Exception.Message)"
}

Write-Host "Criando Abner..."
try {
    $res = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $abner
    Write-Host "Abner criado com sucesso!"
} catch {
    Write-Host "Erro Abner: $($_.Exception.Message)"
}
