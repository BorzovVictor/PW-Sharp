using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using PW.Core;
using PW.SharedKernel;

namespace PW.Infrastructure.Users
{
    public class LoadUsers: UseCase<IEnumerable<PwUser>>, ILoadUsersCase
    {
        private readonly ILogger<LoadUsers> _logger;
        private readonly IUserRepository _userRepository;

        public LoadUsers(ILogger<LoadUsers> logger, IUserRepository userRepository)
        {
            _logger = logger;
            _userRepository = userRepository;
        }

        public async Task<ExecutionResult> Execute(UserFilter filter, int? currentUserId)
        {
            try
            {
                var result = await _userRepository.LoadUsers(filter, currentUserId);
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