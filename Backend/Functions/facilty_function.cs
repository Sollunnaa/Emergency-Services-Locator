using Emergency_Services_Locator.Backend.Access;
using Emergency_Services_Locator.Backend.Tools;
using Microsoft.EntityFrameworkCore;

namespace Emergency_Services_Locator.Backend.Functions
{
    public class facility_function
    {
        private readonly ApplicationDbContext _context;

        public facility_function(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<FacilityViewModel>> getFacilities()
        {
            var facilities = await _context.Facilities
                 .Join(_context.Maps,
                    facilities => facilities.map_id,
                    map => map.id,
                    (facilities, map) => new { facilities, map })
                 .Where(c => !c.facilities.is_deleted)
                 .Select(c => new FacilityViewModel
                 {
                     id = c.facilities.id,
                     facility_name = c.facilities.facility_name,
                     address = c.facilities.address,
                     contact = c.facilities.contact,
                     facility_type = c.facilities.facility_type,
                     map_name = c.map.location_name
                 })
                 .ToListAsync();
            return facilities;
        }

        public async Task<FacilityViewModel> getSpecificFacility(int id)
        {
            var facility = await _context.Facilities
                .Join(_context.Maps,
                    facility => facility.map_id,
                    map => map.id,
                    (facility, map) => new { facility, map })
                .Where(c => !c.facility.is_deleted && c.facility.id == id)
                .Select(c => new FacilityViewModel
                {
                    id = c.facility.id,
                    facility_name = c.facility.facility_name,
                    address = c.facility.address,
                    contact = c.facility.contact,
                    facility_type = c.facility.facility_type,
                    map_name = c.map.location_name
                })
                .SingleOrDefaultAsync();
            return facility;
        }

        public async Task<int> addFacility(FacilityAccess fa)
        {
            var data = fa.ToFacility();
            _context.Add(data);
            await _context.SaveChangesAsync();
            return data.id;
        }

        public async Task<int>editFacility(FacilityAccess fa, int id)
        {
            var data = await _context.Facilities.FindAsync(id);
            if (data != null && !data.is_deleted)
            {
                data.facility_name = fa.name;
                data.address = fa.address;
                data.contact = fa.contact;
                data.facility_type = fa.type;
                data.map_id = fa.map_id;
            }
            await _context.SaveChangesAsync();
            return data.id;
        }

        public async Task<int> softDeleteFaci(FacilityAccess fa, int id) { 
            var data = await _context.Facilities.FindAsync(id);
            if(data !=null && !data.is_deleted)
            {
                data.is_deleted = true;
                await _context.SaveChangesAsync();
            }
            return data.id;
        }

        public async Task<int> restoreFaci(FacilityAccess fa, int id)
        {
            var data = await _context.Facilities.FindAsync(id);
            if (data != null && data.is_deleted)
            {
                data.is_deleted = false;
                await _context.SaveChangesAsync();
            }
            return data.id;
        }

        public async Task<int> deleteFaci(int id)
        {
            var data = await _context.Facilities.FindAsync(id);
            if (data != null)
            {
                _context.Facilities.Remove(data);
                await _context.SaveChangesAsync();
            }
            return id;
        }

    }
}
