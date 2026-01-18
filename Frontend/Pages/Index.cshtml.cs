using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Emergency_Services_Locator.Backend.Tools;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace Emergency_Services_Locator.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public List<MapViewModel> Maps { get; set; } = new();
        public List<FacilityViewModel> Facilities { get; set; } = new();

        public IndexModel(ILogger<IndexModel> logger, IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        public async Task OnGetAsync()
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                client.BaseAddress = new Uri($"{Request.Scheme}://{Request.Host}");

                var mapsResponse = await client.GetAsync("/maps");
                if (mapsResponse.IsSuccessStatusCode)
                {
                    var mapsJson = await mapsResponse.Content.ReadAsStringAsync();
                    Maps = JsonSerializer.Deserialize<List<MapViewModel>>(mapsJson, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }) ?? new();
                }

                var facilitiesResponse = await client.GetAsync("/facilities");
                if (facilitiesResponse.IsSuccessStatusCode)
                {
                    var facilitiesJson = await facilitiesResponse.Content.ReadAsStringAsync();
                    Facilities = JsonSerializer.Deserialize<List<FacilityViewModel>>(facilitiesJson, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }) ?? new();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading data");
            }
        }
    }
}
