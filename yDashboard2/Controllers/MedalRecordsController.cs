﻿using System;
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

        // GET: api/MedalRecords
        [Route("years/year-only")]
        public Object GetAllYears()
        {
            IEnumerable<int?> years = db.OlympicAthletes
                .Select(r => r.Year)
                .Distinct()
                .OrderByDescending(i => i);

            if (years.Any())
            {
                var selectedRecords = GetByYear(2012);
                return new
                {
                    Years = years,
                    InitialYear = 2012,
                    InitialYearMedalRecords = selectedRecords
                };
            }

            return new
            {
                Years = years
            };
        }

        // GET: api/MedalRecords
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

        [Route("countries/country-only")]
        public Object GetAllCountries()
        {
            List<string> countries = db.OlympicAthletes
                .Select(r => r.Country)
                .Distinct()
                .OrderBy(c => c).ToList();

            if (countries.Any())
            {
                var selectedRecords = GetByCountry("Canada");
                return new
                {
                    Countries = countries.Select(c => new { label = c, value = c }),
                    InitialCountryIndex = countries.FindIndex(c => c == "Canada"),
                    InitialCountryMedalRecords = selectedRecords
                };
            }

            return new
            {
                Countries = countries
            };
        }


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
