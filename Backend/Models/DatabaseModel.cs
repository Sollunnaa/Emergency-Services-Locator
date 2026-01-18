using System.Collections;
using System.Collections.Generic;

namespace Emergency_Services_Locator.Backend.Models
{

    public class Facility
    {
        public int id { get; set; }
        public string facility_name { get; set; }
        public string address { get; set; }
        public string contact { get; set; }
        public string facility_type { get; set; }
        public int map_id { get; set; }
        public bool is_deleted { get; set; }

    }

    public class Map
    {
        public int id { get; set; }
        public string longitude { get; set; }
        public string latitude { get; set; }
        public string location_name { get; set; }
        public bool isDefault { get; set; } = false;
        public ICollection<Facility> facilities { get; set; }
        public bool is_deleted { get; set; } = false;
    }
   
}
