﻿
    using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SICWEB.DbFactory;
using SICWEB.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SICWEB.Controllers
{

    [ApiController]
    [Route("api/[controller]/[action]")]
    public class StyleController : ControllerBase
    {
        private readonly ConfeccionMssqlDbContext _context_MS;
        private readonly MaintenanceMssqlDbContext _context_MS2;
        private readonly string _engine;
        [Obsolete]
        private IHostingEnvironment Environment;

        [Obsolete]
        public StyleController(
            ConfeccionMssqlDbContext context_MS,
            MaintenanceMssqlDbContext context_MS2,
            IConfiguration configuration,
            IHostingEnvironment _environment
        )
        {
            _context_MS = context_MS;
            _context_MS2 = context_MS2;
            _engine = configuration.GetConnectionString("ActiveEngine");
            Environment = _environment;

        }

        [HttpGet]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult allBrands()
        {
            if (_engine.Equals("MSSQL"))
            {
                try
                {
                    return Ok(_context_MS.MARCA.ToArray());
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
        public IActionResult getColor([FromBody] IdKey2 id)
        {
            if (_engine.Equals("MSSQL"))
            {
                var result = _context_MS.MARCA_COLOR.Where(u => u.marca_c_vid.Equals(id.id)).ToArray();

                return Ok(result);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult getCategory([FromBody] IdKey2 id)
        {
            if (_engine.Equals("MSSQL"))
            {
                var result = _context_MS.MARCA_CATEGORIA.Where(u => u.marca_c_vid.Equals(id.id)).ToArray();

                return Ok(result);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult allColors()
        {
            if (_engine.Equals("MSSQL"))
            {
                try
                {
                    return Ok(_context_MS.COLOR.ToArray());
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

        [HttpGet]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult allCategories()
        {
            if (_engine.Equals("MSSQL"))
            {
                try
                {
                    return Ok(_context_MS.CATEGORIA.ToArray());
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

        [HttpGet]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult allTallas()
        {
            if (_engine.Equals("MSSQL"))
            {
                try
                {
                    return Ok(_context_MS.TALLA.ToArray());
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
        public IActionResult getStyle([FromBody] SearchStyleKey searchStyleKey)
        {
            if (_engine.Equals("MSSQL"))
            {
                var query = from A in _context_MS.Set<T_ESTILO>()
                            join C in _context_MS.Set<T_MARCA>()
                            on A.marca_c_vid equals C.marca_c_vid
                            join D in _context_MS.Set<T_MARCA_CATEGORIA>()
                            on A.marca_categoria_c_vid equals D.marca_categoria_c_vid
                            join E in _context_MS.Set<T_MARCA_COLOR>()
                            on A.marca_color_c_vid equals E.marca_color_c_vid
                            join F in _context_MS.Set<T_TALLA>()
                            on A.talla_c_vid equals F.talla_c_vid
                            select new
                            {
                                A.estilo_c_iid,
                                A.estilo_c_vcodigo,
                                A.estilo_c_vnombre,
                                A.estilo_c_vdescripcion,
                                A.itm_c_iid,
                                A.marca_c_vid,
                                A.marca_categoria_c_vid,
                                A.marca_color_c_vid,
                                A.talla_c_vid,
                                brandName = C.marca_c_vdescripcion,
                                categoryName = D.marca_categoria_c_vid,
                                colorName = E.marca_color_c_vid,
                                sizeName = F.talla_c_vdescripcion,
                                itemName = ""
                            };
                if (!(searchStyleKey.code == null) && !searchStyleKey.code.Equals(""))
                {
                    query = query.Where(a => a.estilo_c_vcodigo.Contains(searchStyleKey.code));

                }
                if (!(searchStyleKey.name == null) && !searchStyleKey.name.Equals(""))
                {
                    query = query.Where(a => a.estilo_c_vnombre.Contains(searchStyleKey.name));

                }
                if (!(searchStyleKey.color == null) && !searchStyleKey.color.Equals(""))
                {
                    query = query.Where(a => a.colorName.Contains(searchStyleKey.color));

                }

                var query2 = from A in _context_MS2.Set<T_ITEM>()
                             select new
                             {
                                 A.itm_c_iid,
                                 itemName = A.itm_c_ccodigo
                             };
                var res = new List<Style2>();
                foreach (var i in query)
                {
                    Style2 _s = new();
                    _s.estilo_c_iid = i.estilo_c_iid;
                    _s.estilo_c_vcodigo = i.estilo_c_vcodigo;
                    _s.estilo_c_vnombre = i.estilo_c_vnombre;
                    _s.estilo_c_vdescripcion = i.estilo_c_vdescripcion;
                    _s.itm_c_iid = i.itm_c_iid;
                    _s.marca_c_vid = i.marca_c_vid;
                    _s.marca_categoria_c_vid = i.marca_categoria_c_vid;
                    _s.marca_color_c_vid = i.marca_color_c_vid;
                    _s.talla_c_vid = i.talla_c_vid;
                    _s.brandName = i.brandName;
                    _s.categoryName = i.categoryName;
                    _s.colorName = i.colorName;
                    _s.sizeName = i.sizeName;
                    _s.itemName = query2.Where(a => a.itm_c_iid.Equals(i.itm_c_iid)).First().itemName;
                    res.Add(_s);
                }

                /*var query = from A in _context_MS.Set<T_ESTILO>()
                            join C in _context_MS.Set<T_MARCA>()
                            on A.marca_c_vid equals C.marca_c_vid
                            join D in _context_MS.Set<T_MARCA_CATEGORIA>()
                            on A.marca_categoria_c_vid equals D.marca_c_vid
                            join E in _context_MS.Set<T_MARCA_COLOR>()
                            on A.marca_color_c_vid equals E.color_c_vid
                            join F in _context_MS.Set<T_TALLA>()
                            on A.talla_c_vid equals F.talla_c_vid
                            select new
                            {
                                A.estilo_c_iid,
                                A.estilo_c_vcodigo,
                                A.estilo_c_vnombre,
                                A.estilo_c_vdescripcion,
                                A.itm_c_iid,
                                A.marca_c_vid,
                                A.marca_categoria_c_vid,
                                A.marca_color_c_vid,
                                A.talla_c_vid,
                                brandName = C.marca_c_vdescripcion,
                                categoryName = D.marca_categoria_c_vid,
                                colorName = E.marca_color_c_vid,
                                sizeName = F.talla_c_vdescripcion
                            };

                /*if (!(searchStyleKey.code == null) && !searchStyleKey.code.Equals(""))
                {
                    query = query.Where(a => a.estilo_c_vcodigo.Contains(searchStyleKey.code));

                }
                if (!(searchStyleKey.name == null) && !searchStyleKey.name.Equals(""))
                {
                    query = query.Where(a => a.estilo_c_vnombre.Contains(searchStyleKey.name));

                }
                if (!(searchStyleKey.color == null) && !searchStyleKey.color.Equals(""))
                {
                    query = query.Where(a => a.colorName.Contains(searchStyleKey.color));

                }*/
                /*

                            join B in _context_MS2.Set<T_ITEM>()
                            on A.itm_c_iid equals B.itm_c_iid 


                                itemName = B.itm_c_ccodigo,

                 * */

                //var result = _context_MS.ESTILO.Join
                return Ok(res);
            }
            else
            {
                return Ok();
            }
        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult saveStyle([FromBody] NewStyle style)
        {
            if (_engine.Equals("MSSQL"))
            {
                if (style.id < 0)
                {
                    T_ESTILO item = new();
                    item.estilo_c_vcodigo = style.code;
                    item.estilo_c_vnombre = style.name;
                    item.estilo_c_vdescripcion = style.description;
                    item.itm_c_iid = style.item;
                    item.marca_c_vid = style.brand;
                    item.marca_categoria_c_vid = style.category;
                    item.marca_color_c_vid = style.color;
                    item.talla_c_vid = style.size;
                    _context_MS.ESTILO.Add(item);
                    _context_MS.SaveChanges();
                }
                else
                {
                    var _item = _context_MS.ESTILO.Where(e => e.estilo_c_iid.Equals(style.id)).FirstOrDefault();
                    _item.estilo_c_vcodigo = style.code;
                    _item.estilo_c_vnombre = style.name;
                    _item.estilo_c_vdescripcion = style.description;
                    _item.itm_c_iid = style.item;
                    _item.marca_c_vid = style.brand;
                    _item.marca_categoria_c_vid = style.category;
                    _item.marca_color_c_vid = style.color;
                    _item.talla_c_vid = style.size;
                    _context_MS.ESTILO.Update(_item);
                    _context_MS.SaveChanges();
                }
                
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
        public IActionResult DeleteStyle([FromBody] IdKey item)
        {
            if (_engine.Equals("MSSQL"))
            {
                //if (_context_MS.ITEM_SUB_FAMILIA.Where(u => u.isf_c_vdesc.Equals(newSubFamily.subfamily) && u.isf_c_ifm_iid.Equals(newSubFamily.family)).Any())
                //    return Ok();
                //return Task.FromResult(Ok(_context_MS.UNIDAD_MEDIDA.ToArray()));
                var _item = _context_MS.ESTILO.Where(u => u.estilo_c_iid.Equals(item.id)).FirstOrDefault();
                if (!(_item == null))
                {
                    _context_MS.ESTILO.Remove(_item);
                    _context_MS.SaveChanges();
                    return Ok();
                }
                else
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
        [Obsolete]
        public async Task<IActionResult> imageUploadAsync([FromForm] IFormFile image)
        {
            if (_engine.Equals("MSSQL"))
            {
                string wwwPath = this.Environment.WebRootPath;
                string contentPath = this.Environment.ContentRootPath;
                string path = Path.Combine(contentPath, "Uploads");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                string fileName = Path.GetFileName(image.FileName);

                using (var stream = new FileStream(Path.Combine(path, fileName), FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

    }
}
