using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PW.Core;

namespace PW.Api.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class AuthController : BaseApiController
    {
        [HttpPost("register")]
        [ProducesResponseType(typeof(UserDto), 201)]
        [ProducesResponseType(400)]
        [Produces("application/json")]
        public async Task<IActionResult> Register(
            [FromServices] IUserRegisterCase userRegisterCase,
            [FromBody] UserRegisterRequest userForRegister
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await userRegisterCase.Execute(userForRegister);
                return result.Succeded
                    ? (IActionResult) Created("", result.Success)
                    : BadRequest(result.Failure);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(UserDto), 200)]
        [ProducesResponseType(400)]
        [ValidateModel]
        public async Task<IActionResult> Login([FromServices] IUserLoginCase session, UserLoginRequest userLogin)
        {
            try
            {
                var result = await session.Execute(userLogin);
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