const { execFileSync } = require("child_process");
const out = execFileSync("powershell", [
  "-NoProfile",
  "-Command",
  "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Select-Object ProcessId,CommandLine | Format-List",
], { encoding: "utf8" });
for (const chunk of out.split(/\r?\nProcessId/)) {
  const t = chunk.replace(/\s+/g, " ").trim();
  if (t) console.log(t.slice(0, 260));
}
