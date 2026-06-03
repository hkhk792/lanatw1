# 在 mpm4hndtbr-4652s-projects 团队创建/配置 Vercel 项目 sp2s-3（lanatw1.com 方案 B）
# 前置：npx vercel login 且选择能访问该团队的账号
# 用法：powershell -ExecutionPolicy Bypass -File scripts/setup-sp2s-3-vercel.ps1

$ErrorActionPreference = "Stop"
$Scope = "mpm4hndtbr-4652s-projects"
$NewProject = "sp2s-3"
$SourceProject = "obsidian-vapor-zen"
$Domain = "lanatw1.com"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "==> Vercel account"
npx --yes vercel@latest whoami
if ($LASTEXITCODE -ne 0) { throw "请先运行: npx vercel login" }

Write-Host "==> 确保项目 $NewProject 存在"
$projects = npx --yes vercel@latest project ls --scope $Scope 2>&1 | Out-String
if ($projects -notmatch [regex]::Escape($NewProject)) {
  npx --yes vercel@latest project add $NewProject --scope $Scope
  if ($LASTEXITCODE -ne 0) { throw "project add 失败" }
}

Write-Host "==> 链接本地目录到 $NewProject"
if (Test-Path ".vercel") { Remove-Item -Recurse -Force ".vercel" }
npx --yes vercel@latest link --yes --project $NewProject --scope $Scope
if ($LASTEXITCODE -ne 0) { throw "vercel link 失败" }

Write-Host "==> 从 $SourceProject 拉取 Production 环境变量（临时文件，勿提交）"
$envFile = ".env.sp2s3.bootstrap"
npx --yes vercel@latest env pull $envFile --environment production --scope $Scope --yes 2>$null
# 若 sp2s-3 尚无变量，改从源项目拉：先链到源项目
if (-not (Test-Path $envFile) -or ((Get-Item $envFile).Length -lt 50)) {
  Write-Host "    sp2s-3 无 env，改从 $SourceProject 复制..."
  Remove-Item -Recurse -Force ".vercel" -ErrorAction SilentlyContinue
  npx --yes vercel@latest link --yes --project $SourceProject --scope $Scope
  npx --yes vercel@latest env pull $envFile --environment production --scope $Scope --yes
  Remove-Item -Recurse -Force ".vercel" -ErrorAction SilentlyContinue
  npx --yes vercel@latest link --yes --project $NewProject --scope $Scope
}

Write-Host "==> 写入 lanatw1 方案 B 变量到 $envFile"
$lines = Get-Content $envFile -ErrorAction SilentlyContinue
$map = @{
  "SITE_CODE" = "lanatw1"
  "VITE_SHOP_SITE_URL" = "https://lanatw1.com"
  "VITE_SHOP_HOME_TITLE" = "LANA 煙彈主機官方商城｜現貨配送"
  "VITE_SHOP_HOME_DESCRIPTION" = "LANA 小蠻腰煙彈、主機與通配系列現貨。台灣配送，僅限 18 歲以上。"
  "VITE_SHOP_ORG_NAME" = "LANA 官方"
  "VITE_SHOP_WEBSITE_NAME" = "LANA 電子煙官方商城"
  "VITE_SHOP_JSON_LD_BRAND" = "LANA"
}
$out = New-Object System.Collections.Generic.List[string]
$seen = @{}
foreach ($line in $lines) {
  if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)=') {
    $key = $Matches[1]
    if ($map.ContainsKey($key)) {
      $out.Add("$key=$($map[$key])")
      $seen[$key] = $true
      continue
    }
  }
  $out.Add($line)
}
foreach ($k in $map.Keys) {
  if (-not $seen[$k]) { $out.Add("$k=$($map[$k])") }
}
$out | Set-Content $envFile -Encoding utf8

Write-Host "==> 上传环境变量到 $NewProject (production)"
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$') {
    $k = $Matches[1]
    $v = $Matches[2].Trim('"')
    if ($k -match '^VERCEL_' -or [string]::IsNullOrWhiteSpace($v)) { return }
    Write-Host "    env add $k"
    $v | npx --yes vercel@latest env add $k production --scope $Scope --force 2>&1 | Out-Null
  }
}

Write-Host "==> 绑定域名 $Domain"
npx --yes vercel@latest domains add $Domain $NewProject --scope $Scope
npx --yes vercel@latest domains add "www.$Domain" $NewProject --scope $Scope 2>$null

Write-Host "==> 生产部署"
npx --yes vercel@latest deploy --prod --yes --scope $Scope
if ($LASTEXITCODE -ne 0) { throw "deploy 失败" }

Write-Host ""
Write-Host "完成。请在 Vercel 控制台确认："
Write-Host "  项目: https://vercel.com/$Scope/$NewProject"
Write-Host "  域名: https://$Domain"
Write-Host "  Git: Settings -> Git -> 连接 hkhk792/obsidian-vapor-zen (若尚未连接)"
Write-Host "  Cloudflare 建议再加 CNAME www -> cname.vercel-dns.com"
Write-Host ""
Write-Host "后台订单: https://sp2spods.com/admin2589 ，筛选站点 lanatw1"
