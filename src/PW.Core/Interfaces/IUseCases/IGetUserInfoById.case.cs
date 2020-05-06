using System.Security.Claims;
using System.Threading.Tasks;
using PW.SharedKernel;

namespace PW.Core
{
    public interface IGetUserInfoByIdCase
    {
        Task<UseCase<UserInfoDto>.ExecutionResult> Execute(ClaimsPrincipal user);
    }
}