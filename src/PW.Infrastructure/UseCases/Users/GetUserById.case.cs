using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using PW.Core;
using PW.SharedKernel;

namespace PW.Infrastructure.Users
{
    public class GetUserById: UseCase<PwUser>, IGetUserByIdCase
    {
        private readonly ILogger<GetUserById> _logger;
        private readonly IUserRepository _userRepository;

        public GetUserById(ILogger<GetUserById> logger, IUserRepository userRepository)
        {
            _logger = logger;
            _userRepository = userRepository;
        }

        public async Task<ExecutionResult> Execute(int userId)
        {
            try
            {
                var result = await _userRepository.GetById(userId);
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