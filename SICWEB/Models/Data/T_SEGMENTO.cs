using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SICWEB
{
    public class T_SEGMENTO
    {
        public Byte segmento_c_yid { get; set; }
        [Column(TypeName = "VARCHAR")]
        [StringLength(50)]
        public string segmento_c_vcodigo { get; set; }
        [Column(TypeName = "VARCHAR")]
        [StringLength(200)]
        public string segmento_c_vdescripcion { get; set; }
    }
}
