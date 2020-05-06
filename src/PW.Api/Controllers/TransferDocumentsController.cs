using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PW.Api;
using PW.Api.Controllers;
using PW.Core;

namespace PW.Controllers
{
    [Authorize]
    [Route("api/documents/[controller]")]
    public class TransferDocumentsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> Get([FromServices] IGetTransferDocumentByUserCase service)
        {
            try
            {
                var result = await service.Execute();
                return result.Succeded
                    ? (IActionResult) Ok(result.Success)
                    : BadRequest(result.Failure);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }

        [Route("~/api/documents/create")]
        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> Post(
            [FromServices] ICreateNewDocumentCase service,
            [FromBody] TransferDocumentRequest request
        )
        {
            try
            {
                request.Sender = Convert.ToInt32(User.Claims.First(c => c.Type == "Id").Value);
                var result = await service.Execute(request);
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