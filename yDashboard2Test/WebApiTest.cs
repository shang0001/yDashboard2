using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using yDashboard2;
using yDashboard2.Controllers;

namespace yDashboard2Test
{
    [TestClass]
    public class WebApiTest
    {
        private IOlympicAthletesDbEntities db;

        [TestInitialize]
        public void Setup()
        {
            db = new TestOlympicAthletesEntities();
            db.OlympicAthletes.Add(new OlympicAthlete
            {
                id = 1,
                Age = 18,
                Athlete = "Athlete 1",
                Sport = "Ice Hockey",
                Country = "Canada",
                Year = 2008,
                Gold_Medals = 1,
                Silver_Medals = 0,
                Bronze_Medals = 0,
                Total_Medals = 1,
                Closing_Ceremony_Date = new DateTime(2008, 8, 12)
            });

            db.OlympicAthletes.Add(new OlympicAthlete
            {
                id = 2,
                Age = 20,
                Athlete = "Athlete 2",
                Sport = "Swimming",
                Country = "United States",
                Year = 2008,
                Gold_Medals = 1,
                Silver_Medals = 2,
                Bronze_Medals = 0,
                Total_Medals = 3,
                Closing_Ceremony_Date = new DateTime(2008, 8, 22)
            });

            db.OlympicAthletes.Add(new OlympicAthlete
            {
                id = 3,
                Age = 17,
                Athlete = "Athlete 3",
                Sport = "Table Tennis",
                Country = "China",
                Year = 2008,
                Gold_Medals = 1,
                Silver_Medals = 0,
                Bronze_Medals = 1,
                Total_Medals = 2,
                Closing_Ceremony_Date = new DateTime(2008, 8, 19)
            });

            db.OlympicAthletes.Add(new OlympicAthlete
            {
                id = 4,
                Age = 17,
                Athlete = "Athlete 4",
                Sport = "Rowing",
                Country = "Canada",
                Year = 2004,
                Gold_Medals = 0,
                Silver_Medals = 2,
                Bronze_Medals = 1,
                Total_Medals = 3,
                Closing_Ceremony_Date = new DateTime(2004, 8, 29)
            });

            db.OlympicAthletes.Add(new OlympicAthlete
            {
                id = 5,
                Age = 20,
                Athlete = "Athlete 5",
                Sport = "Gymnastics",
                Country = "Canada",
                Year = 2012,
                Gold_Medals = 1,
                Silver_Medals = 0,
                Bronze_Medals = 1,
                Total_Medals = 2,
                Closing_Ceremony_Date = new DateTime(2012, 8, 12)
            });
        }

        [TestMethod,
         Description("Validates the result of GetMedalRecordsByYear method.")]
        public void TestByYearMethod()
        {
            var controller = new MedalRecordsController(db);
            var result = controller.GetByYear(2008);

            //Check for 3 countries
            Assert.AreEqual(3, result.Count());

            //Check for each country
            Assert.AreEqual(1, result.Count(r => GetStringValue(r.c.First()) == "China"));
            Assert.AreEqual(1, result.Count(r => GetStringValue(r.c.First()) == "Canada"));
            Assert.AreEqual(1, result.Count(r => GetStringValue(r.c.First()) == "United States"));

            //Check for Canada
            var rCanada = result.Single(r => GetStringValue(r.c.First()) == "Canada");
            //Canada's total Bronze medals
            Assert.AreEqual(0, GetIntValue(rCanada.c.ElementAt(1)));
            //Canada's total Silver medals
            Assert.AreEqual(0, GetIntValue(rCanada.c.ElementAt(2)));
            //Canada's total Gold medals
            Assert.AreEqual(1, GetIntValue(rCanada.c.ElementAt(3)));

            //Check for US
            var rUS = result.Single(r => GetStringValue(r.c.First()) == "United States");
            //US's total Bronze medals
            Assert.AreEqual(0, GetIntValue(rUS.c.ElementAt(1)));
            //US's total Silver medals
            Assert.AreEqual(2, GetIntValue(rUS.c.ElementAt(2)));
            //US's total Gold medals
            Assert.AreEqual(1, GetIntValue(rUS.c.ElementAt(3)));

            //Check for China
            var rChina = result.Single(r => GetStringValue(r.c.First()) == "China");
            //China's total Bronze medals
            Assert.AreEqual(1, GetIntValue(rChina.c.ElementAt(1)));
            //China's total Silver medals
            Assert.AreEqual(0, GetIntValue(rChina.c.ElementAt(2)));
            //China's total Gold medals
            Assert.AreEqual(1, GetIntValue(rChina.c.ElementAt(3)));
        }

        [TestMethod,
         Description("Validates whether the GetMedalRecordsByYear method returns an empty result.")]
        public void TestByYearMethod_EmptyResult()
        {
            var controller = new MedalRecordsController(db);
            var result = controller.GetByYear(2007);

            //Check for 0 country
            Assert.AreEqual(0, result.Count());
        }

        [TestMethod,
         Description("Validates the result of GetMedalRecordsByCountry method.")]
        public void TestByCountryMethod()
        {
            var controller = new MedalRecordsController(db);
            var result = controller.GetMedalRecordsByCountry("Canada");

            //Check for 3 years
            Assert.AreEqual(3, result.Count());

            //Check for each country
            Assert.AreEqual(1, result.Count(r => GetIntValue(r.c.First()) == 2004));
            Assert.AreEqual(1, result.Count(r => GetIntValue(r.c.First()) == 2008));
            Assert.AreEqual(1, result.Count(r => GetIntValue(r.c.First()) == 2012));

            //Check for 2004
            var r2004 = result.Single(r => GetIntValue(r.c.First()) == 2004);
            //Canada's total Bronze medals
            Assert.AreEqual(1, GetIntValue(r2004.c.ElementAt(1)));
            //Canada's total Silver medals
            Assert.AreEqual(2, GetIntValue(r2004.c.ElementAt(2)));
            //Canada's total Gold medals
            Assert.AreEqual(0, GetIntValue(r2004.c.ElementAt(3)));

            //Check for 2008
            var r2008 = result.Single(r => GetIntValue(r.c.First()) == 2008);
            //US's total Bronze medals
            Assert.AreEqual(0, GetIntValue(r2008.c.ElementAt(1)));
            //US's total Silver medals
            Assert.AreEqual(0, GetIntValue(r2008.c.ElementAt(2)));
            //US's total Gold medals
            Assert.AreEqual(1, GetIntValue(r2008.c.ElementAt(3)));

            //Check for 2012
            var r2012 = result.Single(r => GetIntValue(r.c.First()) == 2012);
            //China's total Bronze medals
            Assert.AreEqual(1, GetIntValue(r2012.c.ElementAt(1)));
            //China's total Silver medals
            Assert.AreEqual(0, GetIntValue(r2012.c.ElementAt(2)));
            //China's total Gold medals
            Assert.AreEqual(1, GetIntValue(r2012.c.ElementAt(3)));
        }

        [TestMethod,
         Description("Validates whether the GetMedalRecordsByCountry method returns an empty result.")]
        public void TestByCountryMethod_EmptyResult()
        {
            var controller = new MedalRecordsController(db);
            var result = controller.GetMedalRecordsByCountry("Fake Country Name");

            //Check for 0 
            Assert.AreEqual(0, result.Count());
        }

        [TestMethod]
        public void TestGetAthletesMethod()
        {
            var controller = new AthletesController(db);
            var result = controller.Get();

            Assert.IsTrue(result.Any());
            Assert.AreEqual(5, result.Count());
        }

        [TestMethod]
        public void TestGetAthleteMethod()
        {
            var controller = new AthletesController(db);
            var result = controller.GetAthlete("Athlete 5");

            Assert.IsTrue(result.Any());

            var rAthlete5 = result.Single(r => GetIntValue(r.c.First()) == 2012);
            Assert.AreEqual(1, GetIntValue(rAthlete5.c.ElementAt(1)));
            Assert.AreEqual(0, GetIntValue(rAthlete5.c.ElementAt(2)));
            Assert.AreEqual(1, GetIntValue(rAthlete5.c.ElementAt(3)));
        }

        [TestMethod]
        public void TestGetAthleteMethod_EmptyResult()
        {
            var controller = new AthletesController(db);
            var result = controller.GetAthlete("Athlete 100");

            Assert.IsFalse(result.Any());
        }

        private String GetStringValue(dynamic d)
        {
            return d.GetType().GetProperty("v").GetValue(d, null);
        }

        private int GetIntValue(dynamic d)
        {
            return d.GetType().GetProperty("v").GetValue(d, null);
        }
    }
}