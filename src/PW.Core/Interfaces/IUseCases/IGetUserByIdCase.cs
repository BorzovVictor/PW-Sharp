using System.Threading.Tasks;
using PW.SharedKernel;

namespace PW.Core
{
    public interface IGetUserByIdCase
    {
        Task<UseCase<PwUser>.ExecutionResult> Execute(int userId);
    }
}