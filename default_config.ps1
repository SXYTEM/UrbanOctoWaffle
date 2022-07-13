$confirmation = Read-Host -Prompt "Are you sure you want to reset the `config.json` file (y/n)?"
$yes = @("y", "yes")
if ($yes -contains $confirmation.ToLower()) {
    Copy-Item "./src/default_config.json" "config.json"
}