# 🔐 Guía de Estudio: JWT (JSON Web Tokens)

## 📖 ¿Qué es un JWT?

Un **JWT** (pronunciado "jot") es un **string codificado** que se usa para autenticar usuarios
sin necesidad de guardar sesiones en el servidor.

Es como un **DNI digital**: el servidor lo genera cuando hacés login, y después
vos lo mostrás cada vez que querés acceder a algo protegido.

---

## 🧱 Estructura del token

Un JWT tiene **3 partes** separadas por puntos:

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.abc123firma
|______HEADER_______|.|______PAYLOAD______|.|__FIRMA__|
```

### 1️⃣ Header (Cabecera)
Dice **qué algoritmo** se usa para firmar.

```json
{
  "alg": "HS256",    // Algoritmo: HMAC con SHA-256
  "typ": "JWT"       // Tipo: JWT
}
```
> Se codifica en Base64URL → `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

### 2️⃣ Payload (Contenido / Claims)
Contiene los **datos del usuario** y metadatos del token.

```json
{
  "sub": "42",                        // Subject: ID del usuario
  "email": "juan@email.com",         // Email
  "name": "Juan Pérez",              // Nombre
  "is_guest": "false",               // Dato custom
  "jti": "a1b2c3d4-e5f6-...",       // ID único del token
  "exp": 1710000000,                 // Expiración (Unix timestamp)
  "iss": "MembranaEchesortu.API",    // Issuer: quién lo emitió
  "aud": "MembranaEchesortu.Frontend" // Audience: para quién es
}
```

> ⚠️ **IMPORTANTE**: El payload NO está encriptado, solo codificado en Base64.
> Cualquiera puede leerlo. NUNCA pongas contraseñas u otra info sensible acá.

**Tipos de claims:**

| Tipo | Ejemplos | Descripción |
|------|----------|-------------|
| **Registrados** | `sub`, `exp`, `iss`, `aud`, `jti` | Definidos por el estándar JWT (RFC 7519) |
| **Públicos** | `email`, `name` | Nombres conocidos, registrados en IANA |
| **Privados** | `is_guest` | Claims custom que inventás vos |

### 3️⃣ Signature (Firma)
Es la **prueba de que nadie alteró el token**. Se calcula así:

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

- Si alguien cambia el payload (ej: cambia su `sub` de "42" a "1" para hacerse admin),
  la firma ya NO coincide → el servidor rechaza el token.
- Solo quien tiene la `SECRET_KEY` puede generar firmas válidas.

---

## 🔄 Flujo completo (paso a paso)

```
┌─────────────────────────────────────────────────────────────────┐
│                        FLUJO DE LOGIN                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Frontend envía:                                             │
│     POST /api/auth/login                                        │
│     { "email": "juan@email.com", "password": "123456" }        │
│                                                                 │
│  2. Backend recibe y hace:                                      │
│     a) Busca el usuario por email en la DB                      │
│     b) Compara la contraseña con BCrypt.Verify()                │
│     c) Si es válida → genera el JWT con JwtService              │
│     d) Devuelve: { token: "eyJhbG...", name: "Juan", ... }    │
│                                                                 │
│  3. Frontend guarda el token (localStorage, cookie, etc.)       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    REQUESTS PROTEGIDAS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  4. Frontend envía requests con el header:                      │
│     Authorization: Bearer eyJhbGciOi...                         │
│                                                                 │
│  5. Backend (middleware UseAuthentication) hace:                 │
│     a) Extrae el token del header                               │
│     b) Decodifica header y payload                              │
│     c) Recalcula la firma con la SECRET_KEY                     │
│     d) Compara: ¿la firma calculada = firma del token?          │
│     e) Verifica: ¿el issuer es válido?                          │
│     f) Verifica: ¿el audience es válido?                        │
│     g) Verifica: ¿no expiró? (exp > ahora)                     │
│                                                                 │
│  6. Si TODO es válido:                                          │
│     → HttpContext.User se llena con los claims                  │
│     → El endpoint puede acceder a los datos del usuario         │
│                                                                 │
│  7. Si ALGO falla:                                              │
│     → Devuelve 401 Unauthorized                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Cómo lo implementamos en nuestro proyecto

### Arquitectura (Clean Architecture)

```
Application/                       ← Define QUÉ necesita
  └── Interfaces/
      └── IJwtService.cs           ← "Necesito generar tokens"

Infrastructure/                    ← Define CÓMO se hace
  └── Services/
      └── JwtService.cs            ← Implementación real con la librería JWT

Web/                               ← Conecta todo
  ├── Program.cs                   ← Registra servicios + configura auth
  ├── appsettings.json             ← Guarda la config (Key, Issuer, etc.)
  └── Controllers/
      └── AuthController.cs        ← Usa IJwtService para generar el token
```

### Paso 1: La interfaz (Application/Interfaces/IJwtService.cs)

```csharp
public interface IJwtService
{
    string GenerateToken(Client client);
}
```
**¿Por qué interfaz?** Porque la capa Application no debe depender de librerías externas.
Solo define "necesito algo que haga esto". La implementación concreta vive en Infrastructure.

### Paso 2: La implementación (Infrastructure/Services/JwtService.cs)

```csharp
public string GenerateToken(Client client)
{
    // 1. Leer la config
    var jwtKey = _configuration["Jwt:Key"];

    // 2. Crear la clave de firma
    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

    // 3. Definir los claims
    var claims = new List<Claim>
    {
        new(JwtRegisteredClaimNames.Sub, client.Id.ToString()),
        new(JwtRegisteredClaimNames.Email, client.Email ?? ""),
        new("name", client.Name),
    };

    // 4. Armar el token
    var token = new JwtSecurityToken(
        issuer: issuer,
        audience: audience,
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(480),
        signingCredentials: credentials
    );

    // 5. Serializar a string
    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

### Paso 3: La configuración (appsettings.json)

```json
"Jwt": {
    "Key": "MembranaEchesortu_SuperSecretKey_2024_MinLength32Chars!",
    "Issuer": "MembranaEchesortu.API",
    "Audience": "MembranaEchesortu.Frontend",
    "ExpirationMinutes": 480
}
```

| Campo | Qué es | Por qué importa |
|-------|--------|------------------|
| **Key** | Clave secreta para firmar | Mínimo 32 chars. NUNCA se comparte |
| **Issuer** | Quién emitió el token | El servidor verifica que coincida |
| **Audience** | Para quién es el token | El servidor verifica que coincida |
| **ExpirationMinutes** | Cuánto dura el token | 480 = 8 horas. Después hay que re-loguearse |

### Paso 4: Configurar ASP.NET (Program.cs)

```csharp
// A) Registrar el servicio en el DI container
builder.Services.AddScoped<IJwtService, JwtService>();

// B) Decirle a ASP.NET cómo validar tokens
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,           // ¿El issuer es el nuestro?
            ValidateAudience = true,         // ¿El audience es el nuestro?
            ValidateLifetime = true,         // ¿No expiró?
            ValidateIssuerSigningKey = true, // ¿La firma es válida?
            ValidIssuer = "...",
            ValidAudience = "...",
            IssuerSigningKey = new SymmetricSecurityKey(...)
        };
    });

// C) Agregar los middlewares (¡EL ORDEN IMPORTA!)
app.UseAuthentication();   // Primero: ¿QUIÉN sos?
app.UseAuthorization();    // Después: ¿QUÉ podés hacer?
```

### Paso 5: Usar en el controlador (AuthController.cs)

```csharp
[HttpPost("login")]
public async Task<ActionResult> Login([FromBody] LoginRequest dto)
{
    var user = await _clientService.LoginAsync(dto.Email, dto.Password);
    var token = _jwtService.GenerateToken(user);  // ← el JWT real
    return Ok(new LoginDto(token, user.Name, user.Email));
}
```

---

## 🛡️ Proteger endpoints con [Authorize]

Una vez configurado, proteger un endpoint es muy fácil:

```csharp
// Solo usuarios autenticados pueden acceder
[Authorize]
[HttpGet("perfil")]
public IActionResult MiPerfil()
{
    // Acceder a los claims del token:
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;  // el "sub"
    var email = User.FindFirst(ClaimTypes.Email)?.Value;
    var name = User.FindFirst("name")?.Value;

    return Ok(new { userId, email, name });
}
```

Si el frontend **no envía** el token → respuesta `401 Unauthorized`.
Si el token **expiró** o la **firma es inválida** → respuesta `401 Unauthorized`.

---

## 🌐 Desde el Frontend (JavaScript)

```javascript
// LOGIN: guardar el token
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});
const data = await response.json();
localStorage.setItem('token', data.token);  // guardar

// REQUESTS PROTEGIDAS: enviar el token
const token = localStorage.getItem('token');
const response = await fetch('/api/productos', {
    headers: {
        'Authorization': `Bearer ${token}`  // ← así se envía
    }
});
```

---

## ❓ Preguntas frecuentes

### ¿Por qué NO se encripta el payload?
Porque el JWT **no es para guardar secretos**, es para **verificar identidad**.
Los claims son como tu DNI: cualquiera puede leer tu nombre, pero nadie puede
falsificar el documento porque no tiene el sello oficial (la firma).

### ¿Qué pasa si alguien roba un token?
Puede usarlo hasta que expire. Por eso:
- Usamos tiempos de expiración cortos (8 horas)
- Se puede implementar una "blacklist" de tokens revocados
- Se puede usar HTTPS para evitar que lo intercepten

### ¿Qué es "simétrico" vs "asimétrico"?
- **Simétrico (HS256)**: la MISMA clave firma y verifica. Más simple. Es lo que usamos.
- **Asimétrico (RS256)**: una clave PRIVADA firma, una clave PÚBLICA verifica.
  Útil cuando múltiples servicios necesitan verificar pero solo uno firma.

### ¿Qué es el Refresh Token?
Es un segundo token de larga duración que se usa para pedir un nuevo JWT
cuando el original expira, sin tener que re-loguearse. Es una mejora futura.

### ¿Diferencia entre Authentication y Authorization?
- **Authentication** (autenticación): ¿QUIÉN sos? → Verificar el token
- **Authorization** (autorización): ¿QUÉ podés hacer? → Verificar permisos/roles

---

## 🧪 Verificar un token

Podés ir a [jwt.io](https://jwt.io), pegar tu token, y vas a ver:
- El **header** decodificado
- El **payload** con todos los claims
- Si ponés la **secret key**, te dice si la firma es válida

---

## 📚 Clases clave de .NET que usamos

| Clase | Namespace | Qué hace |
|-------|-----------|----------|
| `SymmetricSecurityKey` | Microsoft.IdentityModel.Tokens | Envuelve la clave secreta en bytes |
| `SigningCredentials` | Microsoft.IdentityModel.Tokens | Combina la clave + algoritmo de firma |
| `JwtSecurityToken` | System.IdentityModel.Tokens.Jwt | Representa el token como objeto |
| `JwtSecurityTokenHandler` | System.IdentityModel.Tokens.Jwt | Serializa/deserializa tokens a string |
| `Claim` | System.Security.Claims | Un par clave-valor dentro del token |
| `JwtRegisteredClaimNames` | System.IdentityModel.Tokens.Jwt | Constantes: Sub, Email, Jti, etc. |
| `TokenValidationParameters` | Microsoft.IdentityModel.Tokens | Reglas de validación del token |

---

*Archivo creado el 2026-03-08 como referencia de estudio.*
*Proyecto: Membranas Echesortu*
