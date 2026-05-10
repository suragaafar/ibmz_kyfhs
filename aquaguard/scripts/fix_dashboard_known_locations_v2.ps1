$ErrorActionPreference = 'Stop'
$p = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\frontend\src\pages\Dashboard.jsx'
$c = Get-Content -Raw $p

$c = $c.Replace("import { municipalities } from '../data/municipalities';`r`n", '')

$old = @'
// Build autocomplete list — all cities + all unique countries
const KNOWN_LOCATIONS = [
        ...municipalities.map(function (m) { return m.name; }),
        ...Array.from(new Set(municipalities.map(function (m) { return m.country; })))
].sort();
'@

$new = @'
// Autocomplete list sourced from supported backend coordinate set.
const KNOWN_LOCATIONS = [
        'Windsor, ON',
        'Tecumseh, ON',
        'Chatham, ON',
        'Toronto, ON',
        'Ottawa, ON',
        'Vancouver, BC',
        'Montreal, QC',
        'Calgary, AB',
        'New York, NY',
        'Los Angeles, CA',
        'London, UK',
        'Sydney, AU',
        'Mumbai, IN',
        'Delhi, IN',
        'Bangalore, IN'
].sort();
'@

$c = $c.Replace($old, $new)
Set-Content -Path $p -Value $c -NoNewline
Write-Output 'Dashboard location list fixed.'
