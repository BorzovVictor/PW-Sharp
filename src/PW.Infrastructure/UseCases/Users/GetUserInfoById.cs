using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using PW.Core;
using PW.SharedKernel;

namespace PW.Infrastructure.Users
{
    public class GetUserInfoById: UseCase<UserInfoDto>, IGetUserInfoByIdCase
    {
        private readonly ILogger<GetUserInfoById> _logger;
        private readonly IUserRepository _userRepository;

        public GetUserInfoById(ILogger<GetUserInfoById> logger, IUserRepository userRepository)
        {
            _logger = logger;
            _userRepository = userRepository;
        }

        public async Task<ExecutionResult> Execute(ClaimsPrincipal user)
        {
            if (user.IsNullOrEmpty())
                return Failure(new BaseError("current user not found"));
            try
            {
                var currentUserId = Convert.ToInt32(user.Claims.First(c => c.Type == "Id").Value);
                var result = await _userRepository.GetUserInfoById(currentUserId);
                return Success(result);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.GetBaseException().Message);
                return Failure(new BaseError(e.GetBaseException().Message));
            }
        }
    }
}