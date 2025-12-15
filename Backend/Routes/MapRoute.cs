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

            builder.MapPut("/edit/{id}", async (int id, [FromBody] MapAccess ma, map_function mf) =>
            {
                int mapId = await mf.editMap(ma, id);
                return Results.Ok(mapId);
            });

            builder.MapPut("/softdelete/{id}", async (int id, map_function mf) =>
            {
                int mapId = await mf.softDeleteMap(id);
                return Results.Ok(mapId);
            });

            builder.MapPut("/restore/{id}", async (int id, map_function mf) =>
            {
                int mapId = await mf.restoreDelete(id);
                return Results.Ok(mapId);
            });

            builder.MapDelete("/delete/{id}", async (int id, map_function mf) =>
            {
                int mapId = await mf.hardDeleteMap(id);
                return Results.Ok(mapId);
            });
            return builder;
        }


        
    }
}
