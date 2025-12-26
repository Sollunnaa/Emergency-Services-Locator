using Emergency_Services_Locator.Backend.Access;
using Emergency_Services_Locator.Backend.Functions;
using Microsoft.AspNetCore.Mvc;

namespace Emergency_Services_Locator.Backend.Routes
{
    public static class FacilityRoute
    {
        public static IEndpointRouteBuilder FacilityEndpoints(this IEndpointRouteBuilder builder)
        {
            builder.MapGet("/facilities", async (facility_function func) =>
            {
                return await func.getFacilities();
            });
            builder.MapGet("/facility/{id}", async (int id, facility_function ff) =>
            {
                var facility = await ff.getSpecificFacility(id);
                if (facility == null)
                {
                    return Results.NotFound();
                }
                return Results.Ok(facility);
            });
            builder.MapPost("/createFaci", async ([FromBody] FacilityAccess fa, facility_function ff) =>
            {
                int id = await ff.addFacility(fa);
                return Results.Ok(id);
            });
            builder.MapPut("/editFaci/{id}", async (int id, [FromBody] FacilityAccess fa, facility_function ff) =>
            {
                int facilityId = await ff.editFacility(fa, id);
                return Results.Ok(id);
            });

            return builder;
        }
    }
}
