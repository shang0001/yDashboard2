using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yDashboard2;

namespace yDashboard2Test
{
    public class TestOlympicAthletesEntities : IOlympicAthletesDbEntities
    {

        public TestOlympicAthletesEntities()
            {
                this.OlympicAthletes = new TestDbSet<OlympicAthlete>();
            }

            public void Dispose() { }

            public DbSet<OlympicAthlete> OlympicAthletes { get; set; }
    }
}
