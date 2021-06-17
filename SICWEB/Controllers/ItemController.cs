
    using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SICWEB.DbFactory;
using SICWEB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SICWEB.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ItemController : ControllerBase
    {
        private readonly MaintenanceMssqlDbContext _context_MS;
        private readonly string _engine;
        public ItemController(
            MaintenanceMssqlDbContext context_MS,
            IConfiguration configuration
        )
        {
            _context_MS = context_MS;
            _engine = configuration.GetConnectionString("ActiveEngine");

        }

        [HttpGet]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult families()
        {
            if (_engine.Equals("MSSQL"))
            {
                return Ok(_context_MS.ITEM_FAMILIA.ToArray());
            }
            else
            {
                return Ok();
            }
        }
        
        [HttpGet]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult subfamilies()
        {
            if (_engine.Equals("MSSQL"))
            {
                return Ok(_context_MS.ITEM_SUB_FAMILIA.ToArray());
            }
            else
            {
                return Ok();
            }
        }

        [HttpGet]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult units()
        {
            if (_engine.Equals("MSSQL"))
            {
                return Ok(_context_MS.UNIDAD_MEDIDA.ToArray());
            }
            else
            {
                return Ok();
            }
        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Savefamilies([FromBody] NewFamily newFamily)
        {
            if (_engine.Equals("MSSQL"))
            {
                if (_context_MS.ITEM_FAMILIA.Where(u => u.ifm_c_des.Equals(newFamily.family)).Any())
                    return Ok();
                    //return Task.FromResult(Ok(_context_MS.UNIDAD_MEDIDA.ToArray()));
                T_ITEM_FAMILIA _family = new();
                _family.ifm_c_des = newFamily.family;
                _family.ifm_c_bactivo = true;
                _family.segmento_c_yid = 1;
                _context_MS.ITEM_FAMILIA.Add(_family);
                _context_MS.SaveChanges();
                return Ok();
            }
            else
            {
                return Ok();
            }
        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Savesubfamilies([FromBody] NewSubFamily newSubFamily)
        {
            if (_engine.Equals("MSSQL"))
            {
                if (_context_MS.ITEM_SUB_FAMILIA.Where(u => u.isf_c_vdesc.Equals(newSubFamily.subfamily) && u.isf_c_ifm_iid.Equals(newSubFamily.family)).Any())
                    return Ok();
                //return Task.FromResult(Ok(_context_MS.UNIDAD_MEDIDA.ToArray()));
                T_ITEM_SUB_FAMILIA _subFmily = new();
                _subFmily.isf_c_ifm_iid = newSubFamily.family;
                _subFmily.isf_c_vdesc = newSubFamily.subfamily;
                _subFmily.isf_c_bactivo = true;
                _context_MS.ITEM_SUB_FAMILIA.Add(_subFmily);
                _context_MS.SaveChanges();
                return Ok();
            }
            else
            {
                return Ok();
            }
        }

    }
}
