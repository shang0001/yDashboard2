using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace yDashboard2.Models
{
    public class MedalRecordDto
    {
        public IList<Object> c { get; set; }

        public MedalRecordDto(string title, double value)
        {
            c = new List<Object>
            {
                new {v = title},
                new {v = value}
            };
        }

        public MedalRecordDto()
        {
            
        }
    }
}