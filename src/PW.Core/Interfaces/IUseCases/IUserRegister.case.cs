using System.Threading.Tasks;
using PW.SharedKernel;

namespace PW.Core
{
    public interface IUserRegisterCase
    {
        public Task<UseCase<UserDto>.ExecutionResult> Execute(UserRegisterRequest request);
    }
}