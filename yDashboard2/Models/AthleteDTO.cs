using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace yDashboard2.Models
{
    // This is a Data Transfer Object(DTO) class to represent an athlete.
    public class AthleteDto
    {
        public string Name { get; set; }
        public string Sport { get; set; }
        public IEnumerable<MedalRecordDto> MedalRecords { get; set; } 
    }
}
