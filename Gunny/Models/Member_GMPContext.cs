using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace Gunny.Models
{
    public partial class Member_GMPContext : DbContext
    {
        public Member_GMPContext()
        {
        }

        public Member_GMPContext(DbContextOptions<Member_GMPContext> options)
            : base(options)
        {
        }

        public virtual DbSet<ConfigCharge> ConfigCharges { get; set; }
        public virtual DbSet<ConfigChargeMoMo> ConfigChargeMoMos { get; set; }
        public virtual DbSet<ConfigChargePayPal> ConfigChargePayPals { get; set; }
        public virtual DbSet<IpBlock> IpBlocks { get; set; }
        public virtual DbSet<IpBlockNew> IpBlockNews { get; set; }
        public virtual DbSet<LogCard> LogCards { get; set; }
        public virtual DbSet<LogMomo> LogMomos { get; set; }
        public virtual DbSet<LuckyBoxDatum> LuckyBoxData { get; set; }
        public virtual DbSet<LuckyBoxList> LuckyBoxLists { get; set; }
        public virtual DbSet<MemAccount> MemAccounts { get; set; }
        public virtual DbSet<MemAccountBlock> MemAccountBlocks { get; set; }
        public virtual DbSet<MemBag> MemBags { get; set; }
        public virtual DbSet<MemCoinGame> MemCoinGames { get; set; }
        public virtual DbSet<MemEventLog> MemEventLogs { get; set; }
        public virtual DbSet<MemHistory> MemHistories { get; set; }
        public virtual DbSet<MemLauncher> MemLaunchers { get; set; }
        public virtual DbSet<MemSocial> MemSocials { get; set; }
        public virtual DbSet<MemSupport> MemSupports { get; set; }
        public virtual DbSet<MemSupportDatum> MemSupportData { get; set; }
        public virtual DbSet<NewUserAdmin> NewUserAdmins { get; set; }
        public virtual DbSet<News> News { get; set; }
        public virtual DbSet<ServerList> ServerLists { get; set; }
        public virtual DbSet<SupportCategory> SupportCategories { get; set; }
        public virtual DbSet<UserAdmin> UserAdmins { get; set; }
        public virtual DbSet<WsItemDuaTop> WsItemDuaTops { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=IAMMAITOAN\\SQL2019;Database=Member_GMP2;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<ConfigCharge>(entity =>
            {
                entity.ToTable("Config_Charge");

                entity.Property(e => e.Id).HasColumnName("ID");
            });

            modelBuilder.Entity<ConfigChargeMoMo>(entity =>
            {
                entity.ToTable("Config_Charge_MoMo");

                entity.Property(e => e.Id).HasColumnName("ID");
            });

            modelBuilder.Entity<ConfigChargePayPal>(entity =>
            {
                entity.ToTable("Config_Charge_PayPal");

                entity.Property(e => e.Id).HasColumnName("ID");
            });

            modelBuilder.Entity<IpBlock>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("IP_Block");

                entity.Property(e => e.BlockTime)
                    .HasMaxLength(100)
                    .HasColumnName("block_time")
                    .IsFixedLength(true);

                entity.Property(e => e.Blocked)
                    .HasMaxLength(10)
                    .HasColumnName("blocked")
                    .IsFixedLength(true);

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.Property(e => e.UserIp)
                    .HasMaxLength(100)
                    .HasColumnName("UserIP")
                    .IsFixedLength(true);
            });

            modelBuilder.Entity<IpBlockNew>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("IP_Block_New");

                entity.Property(e => e.BlockTime)
                    .HasMaxLength(100)
                    .HasColumnName("block_time")
                    .IsFixedLength(true);

                entity.Property(e => e.Blocked)
                    .HasMaxLength(100)
                    .HasColumnName("blocked")
                    .IsFixedLength(true);

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.Property(e => e.UserIp)
                    .HasMaxLength(100)
                    .HasColumnName("UserIP")
                    .IsFixedLength(true);
            });

            modelBuilder.Entity<LogCard>(entity =>
            {
                entity.ToTable("Log_Card");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Passcard)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Serial)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.TaskId).HasMaxLength(50);

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<LogMomo>(entity =>
            {
                entity.ToTable("Log_Momo");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.TimeCreate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Transactionid)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("transactionid")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<LuckyBoxDatum>(entity =>
            {
                entity.ToTable("LuckyBox_Data");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.BoxId).HasColumnName("BoxID");

                entity.Property(e => e.IsOnlyVip).HasColumnName("IsOnlyVIP");

                entity.Property(e => e.TemplateId).HasColumnName("TemplateID");
            });

            modelBuilder.Entity<LuckyBoxList>(entity =>
            {
                entity.ToTable("LuckyBox_List");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.PriceCg).HasColumnName("PriceCG");
            });

            modelBuilder.Entity<MemAccount>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.ToTable("Mem_Account");

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.Property(e => e.AllowSocialLogin)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.BankNumber).HasMaxLength(500);

                entity.Property(e => e.BankUserName).HasMaxLength(500);

                entity.Property(e => e.Cmndname)
                    .HasMaxLength(500)
                    .HasColumnName("CMNDName");

                entity.Property(e => e.Cmndnumber)
                    .HasMaxLength(500)
                    .HasColumnName("CMNDNumber");

                entity.Property(e => e.Cmndpath1).HasColumnName("CMNDPath1");

                entity.Property(e => e.Cmndpath2).HasColumnName("CMNDPath2");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Fullname).HasMaxLength(500);

                entity.Property(e => e.Ipcreate)
                    .HasMaxLength(100)
                    .HasColumnName("IPCreate");

                entity.Property(e => e.MemEmail).HasMaxLength(50);

                entity.Property(e => e.Nickname).HasMaxLength(500);

                entity.Property(e => e.Password).HasMaxLength(500);

                entity.Property(e => e.Password2).HasMaxLength(500);

                entity.Property(e => e.Phone).HasMaxLength(100);

                entity.Property(e => e.Presenter).HasMaxLength(500);

                entity.Property(e => e.UserAgent).HasMaxLength(500);

                entity.Property(e => e.Vipexp).HasColumnName("VIPExp");

                entity.Property(e => e.Viplevel).HasColumnName("VIPLevel");

                entity.HasOne(d => d.Parent)
                    .WithMany(p => p.InverseParent)
                    .HasForeignKey(d => d.ParentId)
                    .HasConstraintName("FK_Mem_Account_Mem_Account");
            });

            modelBuilder.Entity<MemAccountBlock>(entity =>
            {
                entity.ToTable("Mem_AccountBlock");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Messager)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasDefaultValueSql("(N'Tài khoản này tạm thời bị khóa')");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<MemBag>(entity =>
            {
                entity.HasKey(e => e.ItemId);

                entity.ToTable("Mem_Bag");

                entity.Property(e => e.ItemId).HasColumnName("ItemID");

                entity.Property(e => e.ServerId).HasColumnName("ServerID");

                entity.Property(e => e.TemplateId).HasColumnName("TemplateID");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<MemCoinGame>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.ServerId });

                entity.ToTable("Mem_CoinGame");

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.Property(e => e.ServerId).HasColumnName("ServerID");
            });

            modelBuilder.Entity<MemEventLog>(entity =>
            {
                entity.ToTable("Mem_EventLog");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.EventId).HasColumnName("EventID");

                entity.Property(e => e.String1).HasMaxLength(200);

                entity.Property(e => e.String2).HasMaxLength(200);

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<MemHistory>(entity =>
            {
                entity.ToTable("Mem_History");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Content).IsRequired();

                entity.Property(e => e.Ipcreate)
                    .HasMaxLength(100)
                    .HasColumnName("IPCreate");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<MemLauncher>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.ToTable("Mem_Launcher");

                entity.Property(e => e.UserId)
                    .ValueGeneratedNever()
                    .HasColumnName("UserID");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.KeyVerify)
                    .IsRequired()
                    .HasMaxLength(200);
            });

            modelBuilder.Entity<MemSocial>(entity =>
            {
                entity.ToTable("Mem_Social");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Ipcreate)
                    .HasMaxLength(100)
                    .HasColumnName("IPCreate");

                entity.Property(e => e.SocialEmail)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.SocialId)
                    .IsRequired()
                    .HasMaxLength(500)
                    .HasColumnName("SocialID");

                entity.Property(e => e.SocialName)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<MemSupport>(entity =>
            {
                entity.ToTable("Mem_Support");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Content).IsRequired();

                entity.Property(e => e.Ipcreate)
                    .HasMaxLength(200)
                    .HasColumnName("IPCreate");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<MemSupportDatum>(entity =>
            {
                entity.ToTable("Mem_SupportData");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Content).IsRequired();

                entity.Property(e => e.TicketId).HasColumnName("TicketID");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<NewUserAdmin>(entity =>
            {
                entity.ToTable("new_user_admin");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Password)
                    .HasMaxLength(50)
                    .HasColumnName("password");

                entity.Property(e => e.Type).HasColumnName("type");

                entity.Property(e => e.Username)
                    .HasMaxLength(50)
                    .HasColumnName("username");
            });

            modelBuilder.Entity<News>(entity =>
            {
                entity.Property(e => e.NewsId).HasColumnName("NewsID");

                entity.Property(e => e.Content).IsRequired();

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200);
            });

            modelBuilder.Entity<ServerList>(entity =>
            {
                entity.HasKey(e => e.ServerId);

                entity.ToTable("Server_List");

                entity.Property(e => e.ServerId)
                    .ValueGeneratedNever()
                    .HasColumnName("ServerID");

                entity.Property(e => e.Database)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.DateOpen)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Host)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.LinkCenter)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.LinkConfig)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.LinkFlash)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.LinkRequest)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.LoginKey).HasMaxLength(500);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.ServerName)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(200);
            });

            modelBuilder.Entity<SupportCategory>(entity =>
            {
                entity.ToTable("Support_Category");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(500);
            });

            modelBuilder.Entity<UserAdmin>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("user_admin");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Password)
                    .HasColumnType("text")
                    .HasColumnName("password");

                entity.Property(e => e.Type).HasColumnName("type");

                entity.Property(e => e.Username)
                    .HasMaxLength(50)
                    .HasColumnName("username");
            });

            modelBuilder.Entity<WsItemDuaTop>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("Ws_item_dua_top");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.TemplateId).HasColumnName("TemplateID");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
