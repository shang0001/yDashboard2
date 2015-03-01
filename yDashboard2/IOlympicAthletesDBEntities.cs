using System.Data.Entity;

namespace yDashboard2
{
    public interface IOlympicAthletesDbEntities
    {
        DbSet<OlympicAthlete> OlympicAthletes { get; set; }
    }
}