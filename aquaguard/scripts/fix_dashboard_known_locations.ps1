$ErrorActionPreference = 'Stop'
$p = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\frontend\src\pages\Dashboard.jsx'
$c = Get-Content -Raw $p

# Remove any lingering municipalities import
$c = $c -replace "import \{ municipalities \} from '../data/municipalities';\r?\n", ''

# Replace KNOWN_LOCATIONS block safely
$pattern = "// Build autocomplete list — all cities \+ all unique countries\r?\nconst KNOWN_LOCATIONS = \[(.|\r|\n)*?\]\.sort\(\);"
$replacement = @'
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
$c = [System.Text.RegularExpressions.Regex]::Replace($c, $pattern, $replacement)

Set-Content -Path $p -Value $c -NoNewline
Write-Output 'Dashboard location list fixed.'
