using Emergency_Services_Locator.Backend;
using Emergency_Services_Locator.Backend.Access;
using Emergency_Services_Locator.Backend.Functions;
using Emergency_Services_Locator.Backend.Routes;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages(options =>
{
    options.RootDirectory = "/Frontend/Pages";
});
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient();

builder.Services.AddScoped<map_function>();
builder.Services.AddScoped<facility_function>();
builder.Services.AddScoped<FacilityAccess>();
builder.Services.AddScoped<MapAccess>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// REMOVED: app.UseHttpsRedirection(); 
// Railway handles HTTPS at the edge, this can cause issues

app.UseStaticFiles(); // ADD THIS - Ensures wwwroot files are served

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.MapMapEndpoints();
app.FacilityEndpoints();


app.Run();
