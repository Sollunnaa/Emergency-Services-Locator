using Emergency_Services_Locator.Backend.Access;
using Emergency_Services_Locator.Backend.Functions;
using Microsoft.AspNetCore.Mvc;

namespace Emergency_Services_Locator.Backend.Routes
{
    public static class MapRoute
    {
        public static IEndpointRouteBuilder MapMapEndpoints(this IEndpointRouteBuilder builder)
        {
            builder.MapGet("/maps", async (map_function func) =>
            {
                return await func.getMaps();
            });

            builder.MapGet("/maps/{id}", async (int id, map_function func) =>
            {
                return await func.getSpecificMap(id);
            });

            builder.MapPost("/add", async ([FromBody] MapAccess ma, map_function mf) =>
            {
                int id = await mf.createMap(ma);
                return Results.Ok(id);
            });



            return builder;
        }


        
    }
}
