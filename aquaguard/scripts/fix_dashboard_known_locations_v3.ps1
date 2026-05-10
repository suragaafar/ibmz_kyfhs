$ErrorActionPreference = 'Stop'
$p = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\frontend\src\pages\Dashboard.jsx'
$c = Get-Content -Raw $p

$c = $c.Replace("import { municipalities } from '../data/municipalities';`r`n", '')

$c = $c.Replace("        ...municipalities.map(function (m) { return m.name; }),`r`n        ...Array.from(new Set(municipalities.map(function (m) { return m.country; })))", "        'Windsor, ON',`r`n        'Tecumseh, ON',`r`n        'Chatham, ON',`r`n        'Toronto, ON',`r`n        'Ottawa, ON',`r`n        'Vancouver, BC',`r`n        'Montreal, QC',`r`n        'Calgary, AB',`r`n        'New York, NY',`r`n        'Los Angeles, CA',`r`n        'London, UK',`r`n        'Sydney, AU',`r`n        'Mumbai, IN',`r`n        'Delhi, IN',`r`n        'Bangalore, IN'")

Set-Content -Path $p -Value $c -NoNewline
Write-Output 'Dashboard locations block patched.'
