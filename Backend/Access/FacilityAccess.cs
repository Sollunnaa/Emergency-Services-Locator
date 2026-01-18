using System.ComponentModel.DataAnnotations;
using Emergency_Services_Locator.Backend.Models;

namespace Emergency_Services_Locator.Backend.Access
{
    public class FacilityAccess
    {
        [Required]
        public string name { get; set; }

        [Required]
        public string address { get; set; }

        [Required]
        public string contact { get; set; }

        [Required]
        public string type { get; set; }

        [Required]
        public int map_id { get; set; }

        public Facility ToFacility()
        {
            return new Facility
            {
                facility_name = name,
                address = address,
                contact = contact,
                facility_type = type,
                map_id = map_id
            };

        }
    }
}
