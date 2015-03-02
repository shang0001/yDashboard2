using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Net.Http;
using yDashboard2.Models;

namespace yDashboard2.Controllers
{
    [RoutePrefix("api/MedalRecords")]
    public class MedalRecordsController : ApiController
    {
        private IOlympicAthletesDbEntities db = new OlympicAthletesDBEntities();

        public MedalRecordsController()
        {
        }

        public MedalRecordsController(IOlympicAthletesDbEntities db)
        {
            this.db = db;
        }

        // GET: api/years/year-only.
        // Retrieve Olympic Games years with the default year's medal records.
        [Route("years/year-only")]
        public Object GetAllYears()
        {
            IEnumerable<int?> years = db.OlympicAthletes
                .Select(r => r.Year)
                .Distinct()
                .OrderByDescending(i => i);

            if (years.Any())
            {
                int defaultYear = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["defaultYear"]);
                var selectedRecords = GetByYear(defaultYear);
                return new
                {
                    Years = years,
                    InitialYear = defaultYear,
                    InitialYearMedalRecords = selectedRecords
                };
            }

            return new
            {
                Years = years
            };
        }

        // Retrieve medal records for a specific year.
        [Route("years/{year:int}")]
        public IEnumerable<MedalRecordDto> GetByYear(int year)
        {
            return db.OlympicAthletes
                .Where(r => r.Year == year)
                .GroupBy(r => r.Country).AsEnumerable()
                .Select(g => new MedalRecordDto
                {
                    c = new List<Object>()
                    {
                        new {v = g.Key},
                        new {v = g.Sum(r => r.Bronze_Medals)},
                        new {v = g.Sum(r => r.Silver_Medals)},
                        new {v = g.Sum(r => r.Gold_Medals)}
                    }
                });
        }

        // Retrieve the athlete's countries with the medal records of default country.
        [Route("countries/country-only")]
        public Object GetAllCountries()
        {
            List<string> countries = db.OlympicAthletes
                .Select(r => r.Country)
                .Distinct()
                .OrderBy(c => c).ToList();

            if (countries.Any())
            {
                string defaultCountry = System.Configuration.ConfigurationManager.AppSettings["defaultCountry"];
                var selectedRecords = GetByCountry(defaultCountry);
                return new
                {
                    Countries = countries.Select(c => new { label = c, value = c }),
                    InitialCountryIndex = countries.FindIndex(c => c == defaultCountry),
                    InitialCountryMedalRecords = selectedRecords
                };
            }

            return new
            {
                Countries = countries
            };
        }

        // Retrieve medal records of a specific country.
        [Route("countries/{country}")]
        public IEnumerable<MedalRecordDto> GetByCountry(string country)
        {
            return db.OlympicAthletes
                .Where(r => r.Country == country)
                .GroupBy(r => r.Year).AsEnumerable()
                .Select(g => new MedalRecordDto
                {
                    c = new List<Object>()
                    {
                        new {v = g.Key},
                        new {v = g.Sum(r => r.Bronze_Medals)},
                        new {v = g.Sum(r => r.Silver_Medals)},
                        new {v = g.Sum(r => r.Gold_Medals)}
                    }
                });
        }

        // Retrieve the medal records for a specific country in a specific year.
        [Route("years/{year:int}/{country}")]
        [Route("countries/{country}/{year:int}")]
        public IEnumerable<MedalRecordDto> GetByCountryYear(string country, int year)
        {
            return db.OlympicAthletes
                .Where(r => r.Country == country && r.Year == year)
                .GroupBy(r => r.Sport).AsEnumerable()
                .Select(g => new MedalRecordDto
                {
                    c = new List<Object>()
                    {
                        new {v = g.Key},
                        new {v = g.Sum(r => r.Bronze_Medals)},
                        new {v = g.Sum(r => r.Silver_Medals)},
                        new {v = g.Sum(r => r.Gold_Medals)}
                    }
                });
        }

        // Retrieve the specific type of medal records for a specific country in a sepcific year.
        [Route("years/{year:int}/{country}/{medal}")]
        [Route("countries/{country}/{year:int}/{medal}")]
        public IEnumerable<MedalRecordDto> GetByCountryYearMedal(string country, int year, string medal)
        {
            Expression<Func<OlympicAthlete, bool>> filterExpression = null;
            Func<OlympicAthlete, int?> aggrExpression = null;
            switch (medal)
            {
                case "Gold":
                    filterExpression = r => r.Gold_Medals > 0;
                    aggrExpression = r => r.Gold_Medals;
                    break;
                case "Silver":
                    filterExpression = r => r.Silver_Medals > 0;
                    aggrExpression = r => r.Silver_Medals;
                    break;
                case "Bronze":
                    filterExpression = r => r.Bronze_Medals > 0;
                    aggrExpression = r => r.Bronze_Medals;
                    break;
                case "Total":
                    filterExpression = r => r.Total_Medals > 0;
                    aggrExpression = r => r.Total_Medals;
                    break;
            }

            if (filterExpression == null)
            {
                return new List<MedalRecordDto>();
            }

            return db.OlympicAthletes
                .Where(r => r.Country == country && r.Year == year)
                .Where(filterExpression)
                .GroupBy(r => r.Sport).AsEnumerable()
                .Select(g => new MedalRecordDto
                {
                    c = new List<Object>()
                    {
                        new {v = g.Key},
                        new {v = g.Sum(aggrExpression)}
                    }
                });
        }
    }
}
