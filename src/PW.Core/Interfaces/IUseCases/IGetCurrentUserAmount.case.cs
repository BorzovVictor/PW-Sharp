using System.Threading.Tasks;
using PW.SharedKernel;

namespace PW.Core
{
    public interface IGetCurrentUserAmountCase
    {
        Task<UseCase<decimal>.ExecutionResult> Execute();
    }
}