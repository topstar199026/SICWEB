using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SICWEB.DbFactory;
using SICWEB.Hubs;
using SICWEB.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SICWEB.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AuthController : ControllerBase
    {
        private readonly IHubContext<UsersHub> _hubContext;
        private readonly MssqlDbContext _context_MS;
        private readonly IConfiguration _configuration;
        private readonly string _engine;
        public AuthController(
            IHubContext<UsersHub> usersHub,
            MssqlDbContext context_MS,
            IConfiguration configuration
            )
        {
            _hubContext = usersHub;
            _context_MS = context_MS;
            _configuration = configuration;
            _engine = configuration.GetConnectionString("ActiveEngine");

        }

        [HttpPost]
        [AllowAnonymous]
        [ProducesResponseType(typeof(AuthUser), StatusCodes.Status200OK)]
        public async Task<IActionResult> Login([FromBody] Credentials request)
        {
            var authUser = new AuthUser("success", "", request.UserName);
            if (_engine.Equals("MSSQL"))
            {
                if (_context_MS.USUARIO.Where(u => u.Usua_c_cdoc_id.Equals(request.UserName)).Count() == 0)
                    return Ok(new AuthUser("fail", "El usuario y/o contraseña, son incorrectos.", ""));
                else if (_context_MS.USUARIO.Where(u => u.Usua_c_vpass.Equals(request.Password)).Count() == 0)
                    return Ok(new AuthUser("fail", "El usuario y/o contraseña, son incorrectos.", ""));
                else
                {
                    authUser.Token = CreateToken(authUser);
                }
            }
            else
            {
                authUser.Token = CreateToken(authUser);
            }
            await _hubContext.Clients.All.SendAsync("UserLogin");
            return Ok(authUser);
        }
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Signup([FromBody] Credentials request)
        {
            var authUser = new AuthUser("success", "", request.UserName);
            if (_engine.Equals("MSSQL"))
            {
                if (_context_MS.USUARIO.Where(u => u.Usua_c_cdoc_id.Equals(request.UserName)).Count() > 0)
                    return Ok(new AuthUser("fail", "El nombre de usuario ya existe.", ""));
                else
                {
                    try
                    {
                        T_USUARIO user = new T_USUARIO
                        {
                            Usua_c_cusu_red = "",
                            Usua_c_cdoc_id = authUser.UserName,
                            Usua_c_vpass = request.Password
                        };
                        await _context_MS.USUARIO.AddAsync(user);
                        await _context_MS.SaveChangesAsync();
                    }
                    catch (Exception) { }
                    authUser.Token = CreateToken(authUser);
                }
            }
            else
            {
                authUser.Token = CreateToken(authUser);
            }
            await _hubContext.Clients.All.SendAsync("UserLogin");
            return Ok(authUser);
        }

        [Authorize(Roles = "cliente")]
        public IEnumerable<T_USUARIO> getUsersList(int startIndex)
        {
            return _context_MS.USUARIO.ToArray();
        }


        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Logout()
        {
            await _hubContext.Clients.All.SendAsync("UserLogout");
            return Ok();
        }

        public string CreateToken(AuthUser user)
        {
            var key = Encoding.ASCII.GetBytes(_configuration.GetConnectionString("AppSecret"));
            var tokenHandler = new JwtSecurityTokenHandler();
            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.Role, "cliente")
                }),
                Expires = DateTime.UtcNow.AddHours(1.0),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(descriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}