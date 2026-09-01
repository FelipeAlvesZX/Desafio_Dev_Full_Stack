$ErrorActionPreference = "Stop"
$base = "http://localhost:8082"
$ok = 0; $fail = 0

function Passo($nome, $bloco) {
    try { $r = & $bloco; Write-Host "[OK]    $nome" -ForegroundColor Green; $script:ok++; return $r }
    catch { Write-Host "[FALHA] $nome -> $($_.Exception.Message)" -ForegroundColor Red; $script:fail++; return $null }
}
function EsperaErro($nome, $statusEsperado, $bloco) {
    try { & $bloco | Out-Null; Write-Host "[FALHA] $nome -> deveria ter dado $statusEsperado" -ForegroundColor Red; $script:fail++ }
    catch {
        $s = $_.Exception.Response.StatusCode.value__
        if ($s -eq $statusEsperado) { Write-Host "[OK]    $nome (HTTP $s)" -ForegroundColor Green; $script:ok++ }
        else { Write-Host "[FALHA] $nome -> esperado $statusEsperado, veio $s" -ForegroundColor Red; $script:fail++ }
    }
}
function Post($rota, $corpo) {
    Invoke-RestMethod -Uri "$base$rota" -Method Post -ContentType "application/json" `
        -Body ($corpo | ConvertTo-Json -Depth 10)
}
function Put($rota, $corpo) {
    Invoke-RestMethod -Uri "$base$rota" -Method Put -ContentType "application/json" `
        -Body ($corpo | ConvertTo-Json -Depth 10)
}
function Get_($rota) { Invoke-RestMethod -Uri "$base$rota" -Method Get }

Write-Host "`n=== 3.1 CADASTRO DE ITENS ===" -ForegroundColor Cyan

$beb1 = Passo "POST /bebidas (codigo automatico)" { Post "/bebidas" @{
    codigo=$null; descricao="Coca-Cola Lata 350ml"; precoUnitario=6.50; contemAcucar=$true } }
if ($beb1) { Write-Host "        codigo gerado: $($beb1.codigo)" }

$beb2 = Passo "POST /bebidas (codigo manual SUC-0001)" { Post "/bebidas" @{
    codigo="SUC-0001"; descricao="Suco de Laranja 500ml"; precoUnitario=8.00; contemAcucar=$false } }

EsperaErro "POST /bebidas codigo duplicado -> 409" 409 { Post "/bebidas" @{
    codigo="SUC-0001"; descricao="Duplicata"; precoUnitario=1.00; contemAcucar=$false } }

EsperaErro "POST /bebidas formato invalido -> 400" 400 { Post "/bebidas" @{
    codigo="coca350"; descricao="Formato errado"; precoUnitario=1.00; contemAcucar=$false } }

EsperaErro "POST /bebidas sem descricao -> 400" 400 { Post "/bebidas" @{
    codigo=$null; descricao=""; precoUnitario=1.00; contemAcucar=$false } }

Passo "GET /bebidas" { Get_ "/bebidas" } | Out-Null
Passo "GET /bebidas?termo=coca" { Get_ "/bebidas?termo=coca" } | Out-Null
Passo "GET /bebidas/{id}" { Get_ "/bebidas/$($beb1.id)" } | Out-Null
Passo "PUT /bebidas/{id}" { Put "/bebidas/$($beb1.id)" @{
    codigo=$beb1.codigo; descricao="Coca-Cola Lata 350ml"; precoUnitario=7.00; contemAcucar=$true } } | Out-Null
EsperaErro "GET /bebidas/999999 -> 404" 404 { Get_ "/bebidas/999999" }

$ing1 = Passo "POST /ingredientes (adicional SIM)" { Post "/ingredientes" @{
    codigo=$null; descricao="Queijo Cheddar"; precoUnitario=3.00; permiteAdicional=$true } }
$ing2 = Passo "POST /ingredientes (adicional NAO)" { Post "/ingredientes" @{
    codigo=$null; descricao="Alface"; precoUnitario=0.50; permiteAdicional=$false } }
$ing3 = Passo "POST /ingredientes (adicional SIM)" { Post "/ingredientes" @{
    codigo=$null; descricao="Bacon"; precoUnitario=4.00; permiteAdicional=$true } }

$adic = Passo "GET /ingredientes/adicionais (3.4)" { Get_ "/ingredientes/adicionais" }
if ($adic) { Write-Host "        adicionais disponiveis: $($adic.Count) (esperado 2)" }
Passo "GET /ingredientes?termo=bacon" { Get_ "/ingredientes?termo=bacon" } | Out-Null

Write-Host "`n=== 3.2 CADASTRO DE HAMBURGUER ===" -ForegroundColor Cyan

$ham = Passo "POST /hamburgueres (com ingredientes)" { Post "/hamburgueres" @{
    codigo=$null; descricao="X-Bacon"; valor=22.90;
    ingredienteIds=@($ing1.id, $ing2.id, $ing3.id) } }
if ($ham) { Write-Host "        codigo: $($ham.codigo) | ingredientes: $($ham.ingredientes.Count)" }

EsperaErro "POST /hamburgueres ingrediente inexistente -> 409" 409 { Post "/hamburgueres" @{
    codigo=$null; descricao="Invalido"; valor=10.00; ingredienteIds=@(999999) } }

Passo "GET /hamburgueres?termo=bacon" { Get_ "/hamburgueres?termo=bacon" } | Out-Null

Write-Host "`n=== 3.3 / 3.4 / 3.5 PEDIDO ===" -ForegroundColor Cyan

$ped = Passo "POST /pedidos (completo)" { Post "/pedidos" @{
    descricao="Pedido balcao"
    clienteNome="Felipe Alves"; clienteEndereco="Rua Teste, 123"; clienteTelefone="(18) 99999-0000"
    hamburgueres=@(@{ hamburguerId=$ham.id; quantidade=1 })
    bebidas=@(@{ bebidaId=$beb1.id; quantidade=2 })
    adicionais=@(@{ ingredienteId=$ing1.id; quantidade=1 })
    observacoes=@(@{ texto="sem cebola" }, @{ texto="entregar ate 20h" }) } }

if ($ped) {
    $esperado = 22.90 + (2 * 7.00) + 3.00  
    Write-Host "        codigo: $($ped.codigo)"
    Write-Host "        valorTotal retornado: $($ped.valorTotal) | esperado: $esperado"
    if ([decimal]$ped.valorTotal -eq [decimal]$esperado) {
        Write-Host "[OK]    3.5 calculo do total confere" -ForegroundColor Green; $ok++
    } else {
        Write-Host "[FALHA] 3.5 calculo do total NAO confere" -ForegroundColor Red; $fail++
    }
}

EsperaErro "POST /pedidos com adicional nao permitido -> 409" 409 { Post "/pedidos" @{
    clienteNome="Teste"; clienteEndereco="Rua X"; clienteTelefone="(18) 90000-0000"
    bebidas=@(@{ bebidaId=$beb1.id; quantidade=1 })
    adicionais=@(@{ ingredienteId=$ing2.id; quantidade=1 }) } }

EsperaErro "POST /pedidos sem itens -> 409" 409 { Post "/pedidos" @{
    clienteNome="Teste"; clienteEndereco="Rua X"; clienteTelefone="(18) 90000-0000" } }

EsperaErro "POST /pedidos sem cliente -> 400" 400 { Post "/pedidos" @{
    clienteNome=""; clienteEndereco=""; clienteTelefone=""
    bebidas=@(@{ bebidaId=$beb1.id; quantidade=1 }) } }

Passo "GET /pedidos" { Get_ "/pedidos" } | Out-Null
Passo "GET /pedidos/{id}" { Get_ "/pedidos/$($ped.id)" } | Out-Null
Passo "GET /pedidos?termo=Felipe" { Get_ "/pedidos?termo=Felipe" } | Out-Null

Passo "PUT /pedidos/{id} (recalcula total)" { Put "/pedidos/$($ped.id)" @{
    descricao="Pedido editado"
    clienteNome="Felipe Alves"; clienteEndereco="Rua Teste, 123"; clienteTelefone="(18) 99999-0000"
    hamburgueres=@(@{ hamburguerId=$ham.id; quantidade=2 })
    bebidas=@(); adicionais=@()
    observacoes=@(@{ texto="dobro de hamburguer" }) } } | Out-Null

Write-Host "`n=== LIMPEZA ===" -ForegroundColor Cyan
Passo "DELETE /pedidos/{id}" { Invoke-RestMethod -Uri "$base/pedidos/$($ped.id)" -Method Delete } | Out-Null

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "  OK: $ok    FALHAS: $fail" -ForegroundColor $(if ($fail -eq 0) {"Green"} else {"Red"})
Write-Host "================================`n" -ForegroundColor Cyan
