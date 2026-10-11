$os = Get-CimInstance Win32_OperatingSystem
Write-Output ("FreeMB={0} TotalMB={1}" -f [math]::Round($os.FreePhysicalMemory/1024), [math]::Round($os.TotalVisibleMemorySize/1024))

Write-Output "--- top 15 processes by working set ---"
Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 15 |
  ForEach-Object { Write-Output ("  {0,-22} PID={1,-6} WS={2,6}MB Private={3}MB" -f $_.ProcessName, $_.Id, [math]::Round($_.WorkingSet64/1MB), [math]::Round($_.PrivateMemorySize64/1MB)) }

Write-Output "--- ffmpeg / remotion leftovers ---"
Get-CimInstance Win32_Process -Filter "Name='ffmpeg.exe' OR Name='remotion.exe'" -ErrorAction SilentlyContinue |
  ForEach-Object { Write-Output ("  PID {0} {1}" -f $_.ProcessId, $_.CommandLine) }
