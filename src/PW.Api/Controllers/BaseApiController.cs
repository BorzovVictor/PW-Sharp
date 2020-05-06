using Microsoft.AspNetCore.Mvc;

namespace PW.Api.Controllers
{
    [Produces("application/json")]
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
    }
}