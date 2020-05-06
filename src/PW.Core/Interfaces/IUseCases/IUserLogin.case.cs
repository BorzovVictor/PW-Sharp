using System.Threading.Tasks;
using PW.SharedKernel;

namespace PW.Core
{
    public interface IUserLoginCase
    {
        public Task<UseCase<UserDto>.ExecutionResult> Execute(UserLoginRequest request);
    }
}