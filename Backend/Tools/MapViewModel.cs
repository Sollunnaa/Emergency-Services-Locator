using Emergency_Services_Locator.Backend.Models;

namespace Emergency_Services_Locator.Backend.Tools
{
    public class MapViewModel
    {
        public int id { get; set; }
        public string longitude { get; set; }
        public string latitude { get; set; }
        public string location_name { get; set; }

        public MapViewModel()
        {
        }

        public MapViewModel(Map map)
        {
            id = map.id;
            longitude = map.longitude;
            latitude = map.latitude;
            location_name = map.location_name;
        }
    }
}
