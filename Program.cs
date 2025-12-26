using Emergency_Services_Locator.Backend;
using Emergency_Services_Locator.Backend.Access;
using Emergency_Services_Locator.Backend.Functions;
using Emergency_Services_Locator.Backend.Routes;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddScoped<map_function>();
builder.Services.AddScoped<facility_function>();
builder.Services.AddScoped<FacilityAccess>();
builder.Services.AddScoped<MapAccess>();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();


app.MapMapEndpoints();
app.FacilityEndpoints();


app.Run();
