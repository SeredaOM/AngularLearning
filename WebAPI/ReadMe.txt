# Execute in Package Manager Console to refresh the DB
#   Don't forget to change the connection string inside of BrowserWarContext.OnConfiguring to use
#   ConfigurationManager.ConnectionStrings[0].ConnectionString
Scaffold-DbContext "server=127.0.0.1;uid=usr_browser_wars;pwd=psw_browser_wars;database=browser_wars" MySql.EntityFrameworkCore -OutputDir DAL -f -Context BrowserWarContext
(https://dev.mysql.com/doc/connector-net/en/connector-net-entityframework-core-scaffold-example.html)

# check sometimes when needed to save DB in Git
https://github.com/skeema/skeema
