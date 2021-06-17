using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SICWEB.DbFactory
{
    public class MainMssqlDbContext : DbContext
    {
        public string Schema = "Seguridad";
        public string Prefix = "SIC_";
        public string CurrentUserId { get; set; }

        public DbSet<T_USUARIO> USUARIO { get; set; }
        public DbSet<T_MENU> Menu { get; set; }
        
        public MainMssqlDbContext(DbContextOptions<MainMssqlDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<T_MENU>().ToTable(Prefix + "T_MENU", Schema);
            builder.Entity<T_MENU>().HasKey(p => p.Menu_c_iid);
            builder.Entity<T_MENU>().Property(p => p.Menu_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_OPCION>().ToTable(Prefix + "T_OPCION", Schema);
            builder.Entity<T_OPCION>().HasKey(p => p.Opc_c_iid);
            builder.Entity<T_OPCION>().Property(p => p.Opc_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_PERFIL>().ToTable(Prefix + "T_PERFIL", Schema);
            builder.Entity<T_PERFIL>().HasKey(p => p.Perf_c_yid);
            builder.Entity<T_PERFIL>().Property(p => p.Perf_c_yid).ValueGeneratedOnAdd();

            builder.Entity<T_PERFIL_MENU>().ToTable(Prefix + "T_PERFIL_MENU", Schema);
            builder.Entity<T_PERFIL_MENU>().HasKey(p => new { p.Perf_c_yid, p.Menu_c_iid });
            builder.Entity<T_PERFIL_MENU>().Property(p => p.Perf_c_yid).ValueGeneratedOnAdd();

            builder.Entity<T_PERFIL_OPCION>().ToTable(Prefix + "T_PERFIL_OPCION", Schema);
            builder.Entity<T_PERFIL_OPCION>().HasKey(p => new { p.Opc_c_iid, p.Perf_c_yid });
            builder.Entity<T_PERFIL_OPCION>().Property(p => p.Opc_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_USUARIO>().ToTable(Prefix + "T_USUARIO", Schema);
            builder.Entity<T_USUARIO>().HasKey(p => p.Usua_c_cdoc_id);
            builder.Entity<T_USUARIO>().Property(p => p.Usua_c_cdoc_id).ValueGeneratedOnAdd();

            builder.Entity<T_USUARIO_OPCION>().ToTable(Prefix + "T_USUARIO_OPCION", Schema);
            builder.Entity<T_USUARIO_OPCION>().HasKey(p => new { p.Opc_c_iid, p.Usua_c_cdoc_id });
            builder.Entity<T_USUARIO_OPCION>().Property(p => p.Opc_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_USUARIO_PERFIL>().ToTable(Prefix + "T_USUARIO_PERFIL", Schema);
            builder.Entity<T_USUARIO_PERFIL>().HasKey(p => new { p.Usua_c_cdoc_id, p.Usua_perfil_c_cestado });
            builder.Entity<T_USUARIO_PERFIL>().Property(p => p.Usua_c_cdoc_id).ValueGeneratedOnAdd();

        }

        public override int SaveChanges()
        {
            UpdateAuditEntities();
            return base.SaveChanges();
        }
        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            UpdateAuditEntities();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(cancellationToken);
        }
        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void UpdateAuditEntities()
        {
            var modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.Entity is IAuditableEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entry in modifiedEntries)
            {
                var entity = (IAuditableEntity)entry.Entity;
                DateTime now = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedDate = now;
                    entity.CreatedBy = CurrentUserId;
                }
                else
                {
                    base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                    base.Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                }
                entity.UpdatedDate = now;
                entity.UpdatedBy = CurrentUserId;
            }
        }

    }

    public class MaintenanceMssqlDbContext : DbContext
    {
        public string Schema = "Mantenimiento";
        public string Prefix = "SIC_";
        public string CurrentUserId { get; set; }

        public DbSet<T_ITEM_FAMILIA> ITEM_FAMILIA { get; set; }
        public DbSet<T_ITEM_SUB_FAMILIA> ITEM_SUB_FAMILIA { get; set; }
        public DbSet<T_SEGMENTO> SEGMENTO { get; set; }
        public DbSet<T_PRODUCTO_PARTIDA> PRODUCTO_PARTIDA { get; set; }
        public DbSet<T_UNIDAD_MEDIDA> UNIDAD_MEDIDA { get; set; }

        
        public MaintenanceMssqlDbContext(DbContextOptions<MaintenanceMssqlDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<T_ITEM_FAMILIA>().ToTable(Prefix + "T_ITEM_FAMILIA", Schema);
            builder.Entity<T_ITEM_FAMILIA>().HasKey(p => p.ifm_c_iid);
            builder.Entity<T_ITEM_FAMILIA>().Property(p => p.ifm_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_ITEM_SUB_FAMILIA>().ToTable(Prefix + "T_ITEM_SUB_FAMILIA", Schema);
            builder.Entity<T_ITEM_SUB_FAMILIA>().HasKey(p => p.isf_c_iid);
            builder.Entity<T_ITEM_SUB_FAMILIA>().Property(p => p.isf_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_SEGMENTO>().ToTable(Prefix + "T_SEGMENTO", Schema);
            builder.Entity<T_SEGMENTO>().HasKey(p => p.segmento_c_yid);
            builder.Entity<T_SEGMENTO>().Property(p => p.segmento_c_yid).ValueGeneratedOnAdd();

            builder.Entity<T_PRODUCTO_PARTIDA>().ToTable(Prefix + "T_PRODUCTO_PARTIDA", Schema);
            builder.Entity<T_PRODUCTO_PARTIDA>().HasKey(p => p.pro_partida_c_iid);
            builder.Entity<T_PRODUCTO_PARTIDA>().Property(p => p.pro_partida_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_UNIDAD_MEDIDA>().ToTable(Prefix + "T_UNIDAD_MEDIDA", Schema);
            builder.Entity<T_UNIDAD_MEDIDA>().HasKey(p => p.und_c_yid);
            //builder.Entity<T_UNIDAD_MEDIDA>().Property(p => p.und_c_yid).ValueGeneratedOnAdd();

            //builder.Entity<T_ITEM_FAMILIA>().HasMany(p => p.T_ITEM_SUB_FAMILIAS).WithOne().HasForeignKey(c => c.isf_c_ifm_iid).HasPrincipalKey(p => p.ifm_c_iid);

            // builder.Entity<T_ITEM_SUB_FAMILIA>().HasOne(p => p.T_ITEM_FAMILIA).WithMany(b => b.T_ITEM_SUB_FAMILIAS).HasForeignKey(p => p.isf_c_ifm_iid).HasPrincipalKey(c => c.ifm_c_iid); 
        }

        public override int SaveChanges()
        {
            UpdateAuditEntities();
            return base.SaveChanges();
        }
        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            UpdateAuditEntities();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(cancellationToken);
        }
        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void UpdateAuditEntities()
        {
            var modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.Entity is IAuditableEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entry in modifiedEntries)
            {
                var entity = (IAuditableEntity)entry.Entity;
                DateTime now = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedDate = now;
                    entity.CreatedBy = CurrentUserId;
                }
                else
                {
                    base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                    base.Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                }
                entity.UpdatedDate = now;
                entity.UpdatedBy = CurrentUserId;
            }
        }

    }
}
