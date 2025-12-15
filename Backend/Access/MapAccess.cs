using System.ComponentModel.DataAnnotations;
using Emergency_Services_Locator.Backend.Models;
using System.Text.Json.Serialization;

namespace Emergency_Services_Locator.Backend.Access
{
    public class MapAccess
    {
        [Required]
        [JsonPropertyName("longitude")]
        public string longitude { get; set; }

        [Required]
        [JsonPropertyName("latitude")]
        public string latitude { get; set; }

        [Required]
        [JsonPropertyName("locationName")]
        public string locationName { get; set; }

        public Map ToMap()
        {
            return new Map
            {
                longitude = longitude,
                latitude = latitude,
                location_name = locationName
            };
        }  
    }

}
