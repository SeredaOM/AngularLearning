using System.Configuration;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace WebAPI.DAL
{
    public partial class BrowserWarContext : DbContext
    {
        public BrowserWarContext()
        {
        }

        public BrowserWarContext(DbContextOptions<BrowserWarContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Game> Games { get; set; }
        public virtual DbSet<Map> Maps { get; set; }
        public virtual DbSet<MapTerrainType> MapTerrainTypes { get; set; }
        public virtual DbSet<MapTile> MapTiles { get; set; }
        public virtual DbSet<Player> Players { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySQL(ConfigurationManager.ConnectionStrings[0].ConnectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Game>(entity =>
            {
                entity.ToTable("game");

                entity.HasIndex(e => e.MapId, "game_map_id_idx");

                entity.HasIndex(e => e.Id, "id_UNIQUE")
                    .IsUnique();

                entity.HasIndex(e => e.Name, "name_UNIQUE")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Explored)
                    .HasColumnType("tinyint")
                    .HasColumnName("explored")
                    .HasComment("Is the whole game terrain visible to all players on start?");

                entity.Property(e => e.MapId).HasColumnName("map_id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(45)
                    .HasColumnName("name");

                entity.HasOne(d => d.Map)
                    .WithMany(p => p.Games)
                    .HasForeignKey(d => d.MapId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("game_map_id");
            });

            modelBuilder.Entity<Map>(entity =>
            {
                entity.ToTable("map");

                entity.HasIndex(e => e.Id, "map_id_UNIQUE")
                    .IsUnique();

                entity.HasIndex(e => e.OwnerId, "owner_id_idx");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(45)
                    .HasColumnName("name");

                entity.Property(e => e.OwnerId).HasColumnName("owner_id");

                entity.Property(e => e.Published)
                    .HasColumnType("tinyint")
                    .HasColumnName("published");

                entity.HasOne(d => d.Owner)
                    .WithMany(p => p.Maps)
                    .HasForeignKey(d => d.OwnerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("owner_id");
            });

            modelBuilder.Entity<MapTerrainType>(entity =>
            {
                entity.ToTable("map_terrain_type");

                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(45)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<MapTile>(entity =>
            {
                entity.ToTable("map_tile");

                entity.HasIndex(e => e.MapId, "map_id_idx");

                entity.HasIndex(e => e.MapTerrainTypeId, "terrain_type_id_idx");

                entity.HasIndex(e => new { e.MapId, e.X, e.Y }, "x_y_unique")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.MapId).HasColumnName("map_id");

                entity.Property(e => e.MapTerrainTypeId).HasColumnName("map_terrain_type_id");

                entity.Property(e => e.X).HasColumnName("x");

                entity.Property(e => e.Y).HasColumnName("y");

                entity.HasOne(d => d.Map)
                    .WithMany(p => p.MapTiles)
                    .HasForeignKey(d => d.MapId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("map_id");

                entity.HasOne(d => d.MapTerrainType)
                    .WithMany(p => p.MapTiles)
                    .HasForeignKey(d => d.MapTerrainTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("terrain_type_id");
            });

            modelBuilder.Entity<Player>(entity =>
            {
                entity.ToTable("player");

                entity.HasIndex(e => e.Email, "email_UNIQUE")
                    .IsUnique();

                entity.HasIndex(e => e.Nick, "nick_UNIQUE")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(45)
                    .HasColumnName("email");

                entity.Property(e => e.Nick)
                    .IsRequired()
                    .HasMaxLength(45)
                    .HasColumnName("nick");

                entity.Property(e => e.RegistrationDate)
                    .HasColumnType("date")
                    .HasColumnName("registration_date");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
