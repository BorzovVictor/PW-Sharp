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
    [Route("api/documents/[controller]")]
    public class TransactionsController : BaseApiController
    {
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<TransactionDto>), 200)]
        [ProducesResponseType(400)]
        [Produces("application/json")]
        public async Task<IActionResult> Get(
            [FromServices] IGetUserTransactionsCase service,
            [FromQuery] TransactionRequest filter
        )
        {
            try
            {
                var result = await service.Execute(filter);
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
        [ProducesResponseType(typeof(TransactionDto), 200)]
        [ProducesResponseType(400)]
        [Produces("application/json")]
        public async Task<IActionResult> GetById([FromServices] IGetTransactionByIdCase service, long id)
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
        
        [HttpPost("create")]
        [ValidateModel]
        public async Task<IActionResult> Post(
            [FromServices] ICreateNewDocumentCase service,
            [FromServices] IGetTransactionByDocIdCase trService,
            [FromBody] TransferDocumentRequest request
        )
        {
            try
            {
                request.Sender = Convert.ToInt32(User.Claims.First(c => c.Type == "Id").Value);
                var doc = await service.Execute(request);
                if (doc.Failed)
                    return BadRequest(doc.Failure);
                var result = await trService.Execute(doc.Success.Id);
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