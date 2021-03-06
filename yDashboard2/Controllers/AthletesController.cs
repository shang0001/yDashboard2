﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using yDashboard2.Models;

namespace yDashboard2.Controllers
{
    [RoutePrefix("api/athletes")]
    public class AthletesController : ApiController
    {
        private IOlympicAthletesDbEntities db = new OlympicAthletesDBEntities();

        public AthletesController()
        {
        }

        public AthletesController(IOlympicAthletesDbEntities db)
        {
            this.db = db;
        }

        // Retrieve all athletes.
        [Route("")]
        public IEnumerable<AthleteDto> Get()
        {
            return db.OlympicAthletes.AsEnumerable()
               .GroupBy(r => r.Athlete)
               .OrderBy(r => r.Key)
               .Select(g => new AthleteDto
               {
                   Name = g.Key, 
                   Sport = g.Select(r=>r.Sport).FirstOrDefault()
               });
        }

        // Retrieve one specific athlete.
        [Route("{name}")]
        public IEnumerable<MedalRecordDto> GetAthlete(string name)
        {
            return db.OlympicAthletes
               .Where(a => a.Athlete == name).AsEnumerable()
               .GroupBy(r => r.Year)
               .Select(g => new MedalRecordDto
               {
                   c = new List<Object>()
                    {
                        new {v = g.Key},
                        new {v = g.Sum(r => r.Gold_Medals)},
                        new {v = g.Sum(r => r.Silver_Medals)},
                        new {v = g.Sum(r => r.Bronze_Medals)}
                    }
               });
        }
    }
}
