# yDashboard2
This is for the In­Touch Insight Systems Inc. - Developer Technical Interview 

This is a dashboard application to display the sample dataset "Medals Won by Olympic Athletes", which can be found at http://www.tableau.com/public/community/sample-data-sets#medals

# To build & run:
1. Download and install Visual Studio Community 2013 on Windows 7 that has .NET Framework 4.5 installed.
2. Install Visual Studio 2013 Update 4 if the current VS2013 is not Update 4.
3. Pull yDashboard2 solution in VS2013.
4. Build the solution, which should automatically restore all NuGet packages.
5. Check <appSettings> section in the app.config of the yDashboard2 project, change the "port" to the desired port number if necessary.
6. Run the yDashboard2 project. There should be a command prompt window open, keep it open.
7. Open browser, go to "http://localhost:[your desired port number]/Client/app.html"
8. Start to use the application in browser.
9. To exit, simply press "Enter" in the command prompt window.

# To test
1. For server-side test, run tests developed in yDashboard2Test project.
2. For client-side test, run the application firstly, then open browser to "http://localhost:[your desired port number]/Client/test/specrunner.html". This will run all test cases developed in Jasmine and show the test report.

# Technical Factors
1. Front-end: AngularJS, Google Charts, Bootstrap, HTML5, CSS3.
2. Back-end: .NET Framework 4.5, C#, OWIN, ASP.NET Web Api 2.
3. Testing: Visual Studio Unit Testing Framework, Jasmine.
4. Database: SQL Server Compact 4.0

# Development Notes
1. For easy deployment and testing purpose, this is a self-hosted web applicatino with embedded database. The compiled binaries of yDashboard2 project, i.e. the "bin/Debug" folder, can be copied to another Windows 7 + .NET 4.5 computer. Visual Studio/IIS/SQL Server is not mandatory to run this application.
2. The client is a single page application using AngularJS. I would like to add ngResource module in the next commit to use the REST API as an object.
3. The back-end is a REST API powered by ASP.NET Web Api 2. I use attribute routing to decouple the routes from the controller and action names, which is flexible to add more actions in one controller.
4. The application should be upgraded to a Windows Service, so that the System Administrator can keep it running on the server.
5. End to end test scenarios should be added in next commit.
6. Web Api's "async" actions should be implemented for less server resource usage.
7. Cache (both server side and client side) should be enabled for better performance.

# Known Issues
1. In View by Country page, the pie chart stops to response after changing country.
