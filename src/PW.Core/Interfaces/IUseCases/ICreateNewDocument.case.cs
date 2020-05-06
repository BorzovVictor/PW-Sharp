using System.Threading.Tasks;
using PW.SharedKernel;

namespace PW.Core
{
    public interface ICreateNewDocumentCase
    {
        Task<UseCase<TransferDocumentDto>.ExecutionResult> Execute(TransferDocumentRequest request);
    }
}