using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace yDashboard2.Models
{
    public class AthleteDto
    {
        public string Name { get; set; }
        public string Sport { get; set; }
        public IEnumerable<MedalRecordDto> MedalRecords { get; set; } 
    }
}
