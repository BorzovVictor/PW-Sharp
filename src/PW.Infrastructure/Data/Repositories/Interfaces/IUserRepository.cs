using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using PW.Core;
using PW.SharedKernel;

namespace PW.Infrastructure
{
    public interface IUserRepository: IRepository
    {
        Task<UserDto> GetUserForSession(UserLoginRequest login);
        Task<decimal> GetBalance(int userId);
        Task UpdateCurrentBalance(int userId, decimal currentBalance, AppDbContext db = null, bool autoSave = false);
        Task<bool> UserExists(int userId);
        Task<UserDto> GetUserByEmail(string email);
        Task<UserInfoDto> GetUserInfoById(int userId);
        Task<IEnumerable<PwUser>> LoadUsers(UserFilter filter, int? currentUserId);
    }
}