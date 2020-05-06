using System.Threading.Tasks;
using PW.SharedKernel;

namespace PW.Core
{
    public interface ISetStartBalanceCase
    {
        Task<UseCase<bool>.ExecutionResult> Execute(int userId, decimal amount);
    }
}