using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PW.Core;

namespace PW.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UsersController : BaseApiController
    {

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<PwUser>), 200)]
        [ProducesResponseType(400)]
        [Produces("application/json")]
        public async Task<IActionResult> Get(
            [FromServices] ILoadUsersCase service,
            [FromQuery] UserFilter filter
            )
        {
            try
            {
                var currentUserId = Convert.ToInt32(User.Claims.First(c => c.Type == "Id").Value);
                var result = await service.Execute(filter, filter.ExceptSelf ? currentUserId : (int?) null);
                return result.Succeded
                    ? (IActionResult) Ok(result.Success)
                    : BadRequest(result.Failure);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }
        
        [HttpGet("getSelfInfo")]
        [ProducesResponseType(typeof(UserInfoDto), 200)]
        [ProducesResponseType(400)]
        [Produces("application/json")]
        public async Task<IActionResult> GetCurrentUserInfo([FromServices] IGetUserInfoByIdCase service)
        {
            try
            {
                var result = await service.Execute(User);
                return result.Succeded
                    ? (IActionResult) Ok(result.Success)
                    : BadRequest(result.Failure);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PwUser), 200)]
        [ProducesResponseType(400)]
        [Produces("application/json")]
        public async Task<IActionResult> GetUserById([FromServices] IGetUserByIdCase service, int id)
        {
            try
            {
                var result = await service.Execute(id);
                return result.Succeded
                    ? (IActionResult) Ok(result.Success)
                    : BadRequest(result.Failure);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }

    }
}