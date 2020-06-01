using System.Threading.Tasks;
using PW.SharedKernel;

namespace PW.Core
{
    public interface IGetTransactionByDocIdCase
    {
        Task<UseCase<TransactionDto>.ExecutionResult> Execute(long docId);
    }
}