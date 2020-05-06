using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using PW.SharedKernel;

namespace PW.Core
{
    public interface ILoadUsersCase
    {
        Task<UseCase<IEnumerable<PwUser>>.ExecutionResult> Execute(UserFilter filter, int? currentUserId);
    }
}