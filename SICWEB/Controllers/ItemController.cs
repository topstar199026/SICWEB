﻿
    using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public IActionResult allfamilies()
        {
            if (_engine.Equals("MSSQL"))
            {
                try
                {
                    return Ok(_context_MS.ITEM_FAMILIA.ToArray());
                }
                catch (Exception e)
                {
                    return NotFound();
                }

            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult families([FromBody] IdKey key)
        {
            if (_engine.Equals("MSSQL"))
            {
                try
                {
                    return Ok(_context_MS.ITEM_FAMILIA.Where(c => c.segmento_c_yid.Equals(Convert.ToByte(key.id))).ToArray());
                }
                catch (Exception e){
                    return NotFound();
                }
                
            }
            else
            {
                return NotFound();
            }
        }
        
        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult subfamilies([FromBody] IdKey key)
        {
            if (_engine.Equals("MSSQL"))
            {
                return Ok(_context_MS.ITEM_SUB_FAMILIA.Where(c => c.isf_c_ifm_iid.Equals(key.id)).ToArray());
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

        [HttpGet]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult segments()
        {
            if (_engine.Equals("MSSQL"))
            {
                return Ok(_context_MS.SEGMENTO.ToArray());
            }
            else
            {
                return Ok();
            }
        }

        [HttpGet]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult products()
        {
            if (_engine.Equals("MSSQL"))
            {
                return Ok(_context_MS.PRODUCTO_PARTIDA.ToArray());
            }
            else
            {
                return Ok();
            }
        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult familysub([FromBody] IdKey pid)
        {
            if (_engine.Equals("MSSQL"))
            {
                var product = _context_MS.PRODUCTO_PARTIDA.Where(u => u.pro_partida_c_iid.Equals(pid.id)).FirstOrDefault();
                if(product == null) return Conflict();
                var subFamily = _context_MS.ITEM_SUB_FAMILIA.Where(u => u.isf_c_iid.Equals(product.isf_c_iid)).FirstOrDefault();
                if (subFamily == null) return Conflict();
                var family = _context_MS.ITEM_FAMILIA.Where(u => u.ifm_c_iid.Equals(subFamily.isf_c_ifm_iid)).FirstOrDefault();
                if (family == null) return Conflict();
                FamilySub familySub = new();
                familySub.Family = family;
                familySub.SubFamily = subFamily;
                return Ok(familySub);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Items([FromBody] SearchKey searchKey)
        {
            if (_engine.Equals("MSSQL"))
            {
                
                return Ok(_context_MS.ITEM.ToArray());
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult SaveUnit([FromBody] NewUnit newUnit)
        {
            if (_engine.Equals("MSSQL"))
            {
                if (_context_MS.UNIDAD_MEDIDA.Where(u => u.und_c_vdesc.Equals(newUnit.unit)).Any())
                    return Conflict();
                //return Task.FromResult(Ok(_context_MS.UNIDAD_MEDIDA.ToArray()));
                byte max = _context_MS.UNIDAD_MEDIDA.Max(i => i.und_c_yid);
                max++;
                T_UNIDAD_MEDIDA _unit = new();
                _unit.und_c_yid = max;
                _unit.und_c_vdesc = newUnit.unit;
                _unit.und_c_bactivo = newUnit.flag;
                _context_MS.UNIDAD_MEDIDA.Add(_unit);
                _context_MS.SaveChanges();
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult SaveFamily([FromBody] NewFamily newFamily)
        {
            if (_engine.Equals("MSSQL"))
            {
                if (_context_MS.ITEM_FAMILIA.Where(u => u.ifm_c_des.Equals(newFamily.family) && u.segmento_c_yid.Equals(Convert.ToByte(newFamily.segId))).Any())
                    return Conflict();
                T_ITEM_FAMILIA _family = new();
                _family.ifm_c_des = newFamily.family;
                _family.ifm_c_bactivo = newFamily.flag;
                _family.segmento_c_yid = (byte)newFamily.segId;
                _context_MS.ITEM_FAMILIA.Add(_family);
                _context_MS.SaveChanges();
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult SaveSubFamily([FromBody] NewSubFamily newSubFamily)
        {
            if (_engine.Equals("MSSQL"))
            {
                if (_context_MS.ITEM_SUB_FAMILIA.Where(u => u.isf_c_vdesc.Equals(newSubFamily.subfamily) && u.isf_c_ifm_iid.Equals(newSubFamily.fid)).Any())
                    return Conflict();
                T_ITEM_SUB_FAMILIA _subFmily = new();
                _subFmily.isf_c_ifm_iid = newSubFamily.fid;
                _subFmily.isf_c_vdesc = newSubFamily.subfamily;
                _subFmily.isf_c_bactivo = newSubFamily.flag;
                _context_MS.ITEM_SUB_FAMILIA.Add(_subFmily);
                _context_MS.SaveChanges();
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }


        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Saveitem([FromBody] NewItem item)
        {
            if (_engine.Equals("MSSQL"))
            {
                //if (_context_MS.ITEM_SUB_FAMILIA.Where(u => u.isf_c_vdesc.Equals(newSubFamily.subfamily) && u.isf_c_ifm_iid.Equals(newSubFamily.family)).Any())
                //    return Ok();
                //return Task.FromResult(Ok(_context_MS.UNIDAD_MEDIDA.ToArray()));
                T_ITEM _item = new();
                _item.itm_c_ccodigo = item.code;
                _item.itm_c_vdescripcion = item.description;

                _item.itm_c_dprecio_compra = item.purchaseprice;
                _item.itm_c_dprecio_venta = item.saleprice;
                _item.und_c_yid = item.unit;
                _item.pro_partida_c_iid = item.pid;
                _item.itm_c_bactivo = true;
                _context_MS.ITEM.Add(_item);
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
