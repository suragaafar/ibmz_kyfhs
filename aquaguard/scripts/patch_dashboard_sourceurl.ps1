$ErrorActionPreference = 'Stop'
$p = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\frontend\src\pages\Dashboard.jsx'
$c = Get-Content -Raw $p
$old = "                                                        detail: signal.title`r`n                                                }"
$new = "                                                        detail: signal.title,`r`n                                                        sourceUrl: signal.sourceUrl`r`n                                                }"
$c = $c.Replace($old, $new)
Set-Content -Path $p -Value $c -NoNewline
Write-Output 'Dashboard source links wired.'
