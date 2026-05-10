$ErrorActionPreference = 'Stop'

$leaderboard = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\frontend\src\components\Leaderboard.jsx'
$c = Get-Content -Raw $leaderboard
$c = $c.Replace('Mock points for community engagement and reporting.', 'Community points for engagement and reporting activity.')
Set-Content -Path $leaderboard -Value $c -NoNewline

$page = 'c:\Users\user\Downloads\VS\IBMZ_KYFHS\aquaguard\frontend\src\pages\LeaderboardPage.jsx'
$c = Get-Content -Raw $page
$c = $c.Replace('AquaGuard uses leaderboard points as a playful mock incentive system for reporting issues and helping keep the water network visible.', 'AquaGuard uses leaderboard points as a community incentive system for reporting issues and helping keep the water network visible.')
Set-Content -Path $page -Value $c -NoNewline

Write-Output 'Remaining mock copy removed.'
