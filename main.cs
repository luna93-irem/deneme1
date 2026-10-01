// Rusça Ustalık - minimal ASP.NET Core sunucusu.
// .NET 8+ ile: dotnet new web -n RuscaUstalık yapısına bu dosyayı Program.cs olarak koyabilirsiniz.
// Bu dosya index.html ve main.js'yi aynı klasörden servis eder.
// Front-end soru motoru main.js içinde çalışır; böylece uygulama internetsiz de kullanılabilir.

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var root = AppContext.BaseDirectory;
app.UseDefaultFiles(new DefaultFilesOptions {
    DefaultFileNames = new List<string> { "index.html" }
});
app.UseStaticFiles(new StaticFileOptions {
    FileProvider = new PhysicalFileProvider(root),
    RequestPath = ""
});

// Basit sağlık kontrolü
app.MapGet("/api/health", () => Results.Ok(new {
    app = "Rusça Ustalık",
    version = "1.0",
    levels = new[] {"A1","A2","B1","B2","C1","C2"},
    features = new[] {"infinite-practice","case-explanations","grammar-map","local-progress"}
}));

// İleride sunucu taraflı soru bankası/istatistik eklemek için örnek API sözleşmesi.
app.MapPost("/api/check", async (HttpRequest request) =>
{
    var payload = await JsonSerializer.DeserializeAsync<AnswerRequest>(request.Body);
    if (payload is null || string.IsNullOrWhiteSpace(payload.Answer))
        return Results.BadRequest(new { error = "Cevap boş olamaz." });

    // Asıl eğitim değerlendirmesi şu anda tarayıcıda main.js tarafından yapılır.
    // Buradaki endpoint, ileride kullanıcı hesabı, veritabanı ve gelişmiş değerlendirme
    // motoru bağlamak için hazır bir genişleme noktasıdır.
    return Results.Ok(new {
        received = payload.Answer.Trim(),
        level = payload.Level,
        message = "Cevap alındı. Eğitim değerlendirmesi istemci tarafında çalışıyor."
    });
});

app.Run();

record AnswerRequest(string Answer, string Level);
