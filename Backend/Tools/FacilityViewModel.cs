using Emergency_Services_Locator.Backend.Models;

namespace Emergency_Services_Locator.Backend.Tools
{
    public class FacilityViewModel
    {
        public int id { get; set; }
        public string facility_name { get; set; }
        public string address { get; set; }
        public string contact { get; set; }
        public int map_id { get; set; }

        public FacilityViewModel(Facility facility)
        {
            id = facility.id;
            facility_name = facility.facility_name;
            address = facility.address;
            contact = facility.contact;
            map_id = facility.map_id; 
        }


    }
}
