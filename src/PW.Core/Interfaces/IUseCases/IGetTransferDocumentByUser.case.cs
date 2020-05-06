using System.Collections.Generic;
using System.Threading.Tasks;
using PW.SharedKernel;

namespace PW.Core
{
    public interface IGetTransferDocumentByUserCase
    {
        Task<UseCase<IEnumerable<TransferDocumentDto>>.ExecutionResult> Execute(int userId);
        Task<UseCase<IEnumerable<TransferDocumentDto>>.ExecutionResult> Execute();
    }
}