using System;
using Emergency_Services_Locator.Backend.Access;
using Emergency_Services_Locator.Backend.Models;
using Emergency_Services_Locator.Backend.Tools;
using Microsoft.EntityFrameworkCore;

namespace Emergency_Services_Locator.Backend.Functions
{
    public class map_function
    {
        private readonly ApplicationDbContext _context;

        public map_function(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<MapViewModel>> getMaps()
        {
            var maps = await _context.Maps
                .Where(c => !c.is_deleted)
                .Select(c => new MapViewModel(c))
                .ToListAsync();
            return maps;
                
        }

        public async Task<MapViewModel> getSpecificMap(int id)
        {
            var maps = await _context.Maps
                 .Where(c => !c.is_deleted && c.id == id)
                 .Select(c => new MapViewModel(c))
                 .SingleOrDefaultAsync();
            return maps;
        }

        public async Task<int> createMap(MapAccess ma)
        {
            var data = ma.ToMap();
            _context.Add(data);
            await _context.SaveChangesAsync();
            return data.id;
        }

        public async Task<int> editMap(MapAccess ma, int id)
        {
            var data = await _context.Maps.FindAsync(id);
            if (data == null || !data.is_deleted)
            {
                data.longitude = ma.longitude;
                data.latitude = ma.latitude;
                data.location_name = ma.locationName;
             
            }
            await _context.SaveChangesAsync();
            return data.id;
        }

        public async Task<int> softDeleteMap(int id)
        {
            var data = await _context.Maps.FindAsync(id);
            if (data != null && !data.is_deleted)
            {
                data.is_deleted = true;
                await _context.SaveChangesAsync();
            }
            return data.id;
        }

        public async Task<int> restoreDelete(int id)
        {
            var data = await _context.Maps.FindAsync(id);
            if(data != null && data.is_deleted)
            {
                data.is_deleted = false;
                await _context.SaveChangesAsync();
            }
            return data.id;
        }

        public async Task<int> hardDeleteMap(int id)
        {
            var data = await _context.Maps.FindAsync(id);
            if (data != null)
            {
                _context.Maps.Remove(data);
                await _context.SaveChangesAsync();
            }
            return id;
        }
    }
}
