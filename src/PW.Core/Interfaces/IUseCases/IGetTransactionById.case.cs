using System.Threading.Tasks;
using PW.SharedKernel;

namespace PW.Core
{
    public interface IGetTransactionByIdCase
    {
        Task<UseCase<TransactionDto>.ExecutionResult> Execute(long transactionId);
    }
}