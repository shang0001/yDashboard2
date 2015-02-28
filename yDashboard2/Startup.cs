using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;


namespace yDashboard2
{
    class Startup
    {
        // This method is required by Katana:
        public void Configuration(IAppBuilder app)
        {
            var webApiConfiguration = ConfigureWebApi();

            // Use the extension method provided by the WebApi.Owin library:
            app.UseWebApi(webApiConfiguration);

            // Turns on static files, directory browsing, and default files.
            app.UseFileServer(new FileServerOptions()
            {
                RequestPath = new PathString("/Client"),
                EnableDirectoryBrowsing = true,
            });
        }


        private HttpConfiguration ConfigureWebApi()
        {
            var config = new HttpConfiguration();

            //disable Xml serialization
            config.Formatters.XmlFormatter.SupportedMediaTypes.Clear();
            
            //  Enable attribute based routing
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                "DefaultApi",
                "api/{controller}/{id}",
                new { id = RouteParameter.Optional });
            return config;
        }
    }
}
