using System.Threading.Tasks;
using PW.Core;
using PW.Core.Entities;

namespace PW.Infrastructure
{
    public interface ITransferDocumentRepository
    {
        Task CreateDocuments(TransferDocumentRequest request, AppDbContext context);
        Task<TransferDocument> CreateDocument(TransferDocumentRequest request, AppDbContext context);
    }
}