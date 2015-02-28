using System;
using System.Collections.Generic;
using System.Linq;
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
        private OlympicAthletesDBEntities db = new OlympicAthletesDBEntities();

        // GET: api/MedalRecords
        [Route("{year:int}")]
        public IEnumerable<MedalRecordDto> GetMedalRecordsByYear(int year)
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

        [Route("{country}")]
        public IEnumerable<MedalRecordDto> GetMedalRecordsByCountry(string country)
        {
            return db.OlympicAthletes
                .Where(r => r.Country == country)
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
    }
}
