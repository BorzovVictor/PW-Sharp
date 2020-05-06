using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Options;
using PW.Core.Entities;

namespace PW.Infrastructure
{
    public class TransferDocumentConfiguration: IEntityTypeConfiguration<TransferDocument>
    {
        public void Configure(EntityTypeBuilder<TransferDocument> builder)
        {
            builder.ToTable("TransferDocuments", AppSettings.DbSchema);
        }
    }
}