using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using PW.Core;
using PW.SharedKernel;

namespace PW.Infrastructure
{
    public class GetCurrentUserAmount : UseCase<decimal>, IGetCurrentUserAmountCase
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<GetCurrentUserAmount> _logger;
        private readonly IHttpContextAccessor _httpContext;

        public GetCurrentUserAmount(ILogger<GetCurrentUserAmount> logger,
            IHttpContextAccessor httpContext, IUserRepository userRepository)
        {
            _logger = logger;
            _httpContext = httpContext;
            _userRepository = userRepository;
        }

        public async Task<ExecutionResult> Execute()
        {
            var currUser = _httpContext.HttpContext.User;
            if (currUser.IsNullOrEmpty())
                return Failure(new BaseError("current user not found"));

            try
            {
                int currentUserId = Convert.ToInt32(currUser.Claims.First(c => c.Type == "Id").Value);
                var amount = await _userRepository.GetBalance(currentUserId);
                return Success(amount);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.GetBaseException().Message);
                return Failure(new BaseError(e.GetBaseException().Message));
            }
        }
    }
}