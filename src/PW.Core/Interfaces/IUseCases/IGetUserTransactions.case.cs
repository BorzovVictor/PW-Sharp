using System.Collections.Generic;
using System.Threading.Tasks;
using PW.SharedKernel;

namespace PW.Core
{
    public interface IGetUserTransactionsCase
    {
        Task<UseCase<IEnumerable<TransactionDto>>.ExecutionResult> Execute(TransactionRequest request);
    }
}