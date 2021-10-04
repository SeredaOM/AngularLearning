# Execute in Package Manager Console to refresh the DB
#   Don't forget to change the connection string inside of BrowserWarContext.OnConfiguring to use
#   ConfigurationManager.ConnectionStrings[0].ConnectionString
Scaffold-DbContext "server=127.0.0.1;uid=usr_browser_wars;pwd=psw_browser_wars;database=browser_wars" MySql.EntityFrameworkCore -OutputDir DAL -f -Context BrowserWarContext
(https://dev.mysql.com/doc/connector-net/en/connector-net-entityframework-core-scaffold-example.html)

# check sometimes when needed to save DB in Git
https://github.com/skeema/skeema

#To host WebAPI project under IIS:
#1. Install IIS (Management Console, Application Development Features, Common HTTP Features)
#   - create 'regular' website, change app pool for it to use 'No Managed Code' as '.NET CLR Version'
#   - grant IIS_IUSRS access to folder with the project and web.config file
#2. Install .NET 5.0 SDK (https://dotnet.microsoft.com/download/dotnet/thank-you/sdk-5.0.301-windows-x64-installer)
#3. If these don't help try:
#   - installing IIS Rewrite module
#   - ASP.NET Core 5.0 Runtime (v5.0.7) - Windows Hosting Bundle Installer! (https://dotnet.microsoft.com/download/dotnet/thank-you/runtime-aspnetcore-5.0.7-windows-hosting-bundle-installer)
URL Rewrite Module (Extension)

