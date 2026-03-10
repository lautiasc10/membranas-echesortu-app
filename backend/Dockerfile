# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiamos la solución y los proyectos primero para restaurar dependencias
COPY *.sln .
COPY src/Domain/*.csproj ./src/Domain/
COPY src/Application/*.csproj ./src/Application/
COPY src/Infrastructure/*.csproj ./src/Infrastructure/
COPY src/Web/*.csproj ./src/Web/

RUN dotnet restore

# Copiamos el resto del código y construimos
COPY src/ ./src/
WORKDIR /app/src/Web
RUN dotnet build -c Release -o /app/build
RUN dotnet publish -c Release -o /app/publish

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# El servidor de Railway usará el puerto provisto por variable de entorno (PORT)
# ASP.NET usa HTTP_PORTS para configurarlo (la nube de Render/Railway suele pasarlo automático)
# Garantizamos seguridad base.
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

ENTRYPOINT ["dotnet", "Web.dll"]
